import { useCallback, useEffect, useRef, useState } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import type { BotBridge } from '@/src/features/webapp/bot/useBotBridge';
import type {
  BotLogDetail,
  BotLogLevel,
  BotUserInfoResultPayload,
} from '@/src/features/webapp/bot/botRuntime';

// Port of the loop scheduler in the extension's screens/BasicMode.tsx
// (runSingleLoop + handleStartStop). The page bundle only runs ONE
// search/buy cycle per call; all pacing and account-safety rules live here.
// Keep the numbers in sync with the extension.

export type SpeedPresetKey = 'safe' | 'caution' | 'risky';

// store/slices/botSlice.ts TAB_RPM
export const PRESET_RPM: Record<SpeedPresetKey, number> = {
  safe: 3,
  caution: 6,
  risky: 9,
};

// config.ts
const HOURLY_SEARCH_SOFT_THROTTLE = 200;
const HOURLY_SEARCH_HARD_CAP = 250;
const HOURLY_WINDOW_MS = 60 * 60 * 1000;

const MIN_BID_VALUES = [150, 200, 250, 300, 350];
const FUTBIN_LIST_MARKUP_PERCENT = 5;
const FUTBIN_LIST_MARKUP_COINS = 250;

const BURST_MIN_SEARCHES = 4;
const BURST_MAX_SEARCHES = 7;
const FATIGUE_STEP = 0.075;
const FATIGUE_INTERVAL_SECONDS = 30 * 60;

const KEEP_AWAKE_TAG = 'elitefutbot-sniper';

function randomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function getDelayFromRpm(rpm: number): number {
  const safeRpm = Number.isFinite(rpm) && rpm > 0 ? rpm : 4;
  return Math.max(1000, Math.round((60 / safeRpm) * 1000));
}

function getFatigueMultiplier(elapsedSeconds: number): number {
  return 1 + Math.floor(elapsedSeconds / FATIGUE_INTERVAL_SECONDS) * FATIGUE_STEP;
}

function getBurstGapDelay(baseDelayMs: number): number {
  return randomInt(Math.round(baseDelayMs * 0.4), Math.round(baseDelayMs * 0.8));
}

function getBurstPauseDelay(baseDelayMs: number): number {
  return randomInt(Math.round(baseDelayMs * 1.5), Math.round(baseDelayMs * 4));
}

// FUTBIN + 5% + 250 coins; botLogic.ts rounds it up to a clean price step.
export function futbinListStartPrice(futbinPrice: number): number {
  return Math.round(
    futbinPrice * (1 + FUTBIN_LIST_MARKUP_PERCENT / 100) + FUTBIN_LIST_MARKUP_COINS
  );
}

export interface SniperSettings {
  minPrice: number;
  maxPrice: number;
  preset: SpeedPresetKey;
  autoList: boolean;
  // FUTBIN/fut.gg price for the user's platform; required when autoList is on
  // (the mobile UI only offers "list at FUTBIN +5%").
  futbinPrice: number | null;
  filterMode: boolean;
  actLikeHuman: boolean;
  humanPlusPlus: boolean;
  sleepEveryMinutes: number | null;
  sleepDurationMinutes: number | null;
  purchaseLimit: number | null;
}

export const DEFAULT_SNIPER_SETTINGS: SniperSettings = {
  minPrice: 1,
  maxPrice: 0,
  preset: 'safe',
  autoList: false,
  futbinPrice: null,
  filterMode: false,
  actLikeHuman: false,
  humanPlusPlus: false,
  sleepEveryMinutes: 15,
  sleepDurationMinutes: 5,
  purchaseLimit: null,
};

export interface SniperLogEntry {
  id: string;
  time: Date;
  level: BotLogLevel;
  message: string;
  detail?: BotLogDetail;
}

// Backend calls (JWT-authenticated, against elitefutbot-backend). Both are
// best-effort and must never block the loop.
export interface SniperBackend {
  putBotStatus?: (
    status: 'idle' | 'running' | 'stopped',
    extra?: { activeFilters?: unknown; purchase?: { name: string; price: number; tradeId?: number | string } }
  ) => Promise<void>; // PUT /users/bot-status
  putStats?: (delta: { purchases: number; profits: number }) => Promise<void>; // PUT /users/stats
}

export function useSniperBot(bridge: BotBridge, backend: SniperBackend = {}) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loopCount, setLoopCount] = useState(0);
  const [cardsBought, setCardsBought] = useState(0);
  const [sessionSpent, setSessionSpent] = useState(0);
  const [sessionProfit, setSessionProfit] = useState(0);
  const [statusText, setStatusText] = useState('Idle');
  const [lastError, setLastError] = useState<string | null>(null);
  const [hourlySearchCount, setHourlySearchCount] = useState(0);
  const [userInfo, setUserInfo] = useState<BotUserInfoResultPayload | null>(null);
  const [logs, setLogs] = useState<SniperLogEntry[]>([]);

  // Loop state lives in refs so the timer callbacks never see stale values.
  const runningRef = useRef(false);
  const settingsRef = useRef<SniperSettings>(DEFAULT_SNIPER_SETTINGS);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAtRef = useRef(0);
  const loopCountRef = useRef(0);
  const cardsBoughtRef = useRef(0);
  const lastSleepElapsedRef = useRef(0);
  const burstRemainingRef = useRef(0);
  const searchesUntilClickSequenceRef = useRef(0);
  // Deliberately not reset on start: it reflects real account load this hour.
  const searchTimestampsRef = useRef<number[]>([]);
  const lastLoggedErrorRef = useRef<string | null>(null);
  const backendRef = useRef(backend);
  backendRef.current = backend;

  const elapsed = () => Math.floor((Date.now() - startedAtRef.current) / 1000);

  const addLog = useCallback((level: BotLogLevel, message: string, detail?: BotLogDetail) => {
    // Skip repeated identical errors, as the extension does.
    if (level === 'error') {
      if (message === lastLoggedErrorRef.current) return;
      lastLoggedErrorRef.current = message;
    } else {
      lastLoggedErrorRef.current = null;
    }
    setLogs((prev) =>
      [
        ...prev,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, time: new Date(), level, message, detail },
      ].slice(-1000) // MAX_LOG_COUNT
    );
  }, []);

  const pushBotStatus: NonNullable<SniperBackend['putBotStatus']> = useCallback(async (status, extra) => {
    try {
      await backendRef.current.putBotStatus?.(status, extra);
    } catch (error) {
      console.error('Failed to push bot status to backend:', error);
    }
  }, []);

  const getHourlySearchCount = () => {
    const now = Date.now();
    searchTimestampsRef.current = searchTimestampsRef.current.filter((t) => now - t < HOURLY_WINDOW_MS);
    return searchTimestampsRef.current.length;
  };

  const halt = useCallback(
    (error: string | null) => {
      runningRef.current = false;
      setIsRunning(false);
      setStatusText('Idle');
      if (error) setLastError(error);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      bridge.stop();
      deactivateKeepAwake(KEEP_AWAKE_TAG);
      void pushBotStatus('stopped');
    },
    [bridge, pushBotStatus]
  );

  // runSingleLoop and queueNextLoop call each other; keep the latest in a ref.
  const runSingleLoopRef = useRef<(isRetry?: boolean) => Promise<void>>(async () => {});

  const queueNextLoop = (delay: number, isRetry = false) => {
    if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      void runSingleLoopRef.current(isRetry);
    }, delay);
  };

  runSingleLoopRef.current = async (isRetry = false) => {
    if (!runningRef.current) return;
    const settings = settingsRef.current;

    if (!isRetry) {
      loopCountRef.current += 1;
      setLoopCount(loopCountRef.current);
    }
    setStatusText(`Searching market (Loop #${loopCountRef.current})`);

    // Hourly search budget, sliding 60-minute window.
    const hourlyBefore = getHourlySearchCount();
    if (hourlyBefore >= HOURLY_SEARCH_HARD_CAP) {
      const restDuration = 15 * 60 * 1000 + Math.floor(Math.random() * 5 * 60 * 1000);
      const resumeTime = new Date(Date.now() + restDuration).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStatusText('Cooling down to protect account');
      addLog('info', `Hourly search limit reached (${hourlyBefore}/${HOURLY_SEARCH_HARD_CAP}). Resting until ${resumeTime} to prevent EA soft-ban.`);
      queueNextLoop(restDuration);
      return;
    }
    if (hourlyBefore === HOURLY_SEARCH_SOFT_THROTTLE) {
      addLog('info', `Approaching hourly limit (${hourlyBefore}/${HOURLY_SEARCH_HARD_CAP}). Slowing down...`);
    }
    searchTimestampsRef.current.push(Date.now());
    setHourlySearchCount(getHourlySearchCount());

    try {
      if (!isRetry) {
        setLastError(null);
        addLog('info', `Loop ${loopCountRef.current}: searching ${settings.minPrice}-${settings.maxPrice}`, {
          kind: 'loop',
          loop: loopCountRef.current,
          filterMode: settings.filterMode,
          minPrice: settings.minPrice,
          maxPrice: settings.maxPrice,
        });
      }

      const listStartPrice =
        settings.autoList && settings.futbinPrice !== null ? futbinListStartPrice(settings.futbinPrice) : null;

      const response = await bridge.runLoop({
        minPrice: settings.minPrice,
        maxPrice: settings.maxPrice,
        minBid: MIN_BID_VALUES[Math.floor(Math.random() * MIN_BID_VALUES.length)],
        maxBid: 0,
        autoList: settings.autoList,
        listMinPrice: listStartPrice,
        listMaxPrice: listStartPrice !== null ? listStartPrice + 100 : null,
        listTargetProfit: null,
        listFixedPrice: null,
        purchaseLimit: settings.purchaseLimit,
        currentPurchases: cardsBoughtRef.current,
        maxPurchasesPerSearch: 1,
        minRating: null,
        maxRating: null,
        cardRating: null,
        actionDelayMs: 1000,
        actLikeHuman: settings.actLikeHuman,
        humanPlusPlus: settings.humanPlusPlus,
        filterMode: settings.filterMode,
      });

      if (!runningRef.current) return;

      if (!response.ok) {
        const errorMessage = response.error ?? 'Loop request failed.';
        setLastError(errorMessage);

        if (response.stopped) {
          halt(errorMessage);
          return;
        }
        addLog('error', errorMessage);

        // Same error classification as BasicMode.tsx.
        if (/\b429\b/.test(errorMessage)) {
          halt('Rate limited by EA (HTTP 429). Cooling down — try again in 20 minutes.');
          return;
        }
        if (/\b458\b/.test(errorMessage) || /captcha/i.test(errorMessage)) {
          halt('EA Captcha required. Solve the puzzle in the Web App, then restart the bot.');
          return;
        }
        if (/\b(512|521)\b/.test(errorMessage)) {
          addLog('error', 'EA server error. Pausing 5 minutes before retrying...');
          queueNextLoop(5 * 60 * 1000, true);
          return;
        }
        if (/expired/i.test(errorMessage)) {
          halt('EA session expired. Reload the Web App and log in again, then restart.');
          return;
        }
        if (/error communicating/i.test(errorMessage)) {
          addLog('info', 'EA server blip. Retrying in 10 seconds...');
          queueNextLoop(10000, true);
          return;
        }
        queueNextLoop(2500 + (Math.random() * 2 - 1) * 375, true);
        return;
      }

      const boughtCount = response.boughtCount ?? 0;
      const estimatedProfit = response.estimatedProfit ?? 0;
      cardsBoughtRef.current += boughtCount;
      setCardsBought(cardsBoughtRef.current);
      setSessionSpent((v) => v + (response.spent ?? 0));
      setSessionProfit((v) => v + estimatedProfit);

      if (boughtCount > 0) {
        try {
          await backendRef.current.putStats?.({ purchases: boughtCount, profits: estimatedProfit });
        } catch (error) {
          console.error('Failed to sync user stats with backend:', error);
        }
      }

      if (settings.humanPlusPlus) {
        searchesUntilClickSequenceRef.current -= 1;
        if (searchesUntilClickSequenceRef.current <= 0 && runningRef.current) {
          searchesUntilClickSequenceRef.current = randomInt(5, 10);
          addLog('info', 'Taking a human-like browsing pause...');
          const clickResult = await bridge.runClickSequence();
          if (!clickResult.ok) {
            addLog('error', `Human++ browsing pause failed: ${clickResult.error ?? 'unknown error'}`);
          }
        }
      }

      if (!runningRef.current) return;

      // Sleep schedule, then burst + fatigue timing.
      const elapsedNow = elapsed();
      const baseDelay = getDelayFromRpm(PRESET_RPM[settings.preset]);
      let nextDelay: number;

      if (
        settings.sleepEveryMinutes !== null &&
        settings.sleepDurationMinutes !== null &&
        elapsedNow > 0 &&
        elapsedNow - lastSleepElapsedRef.current >= settings.sleepEveryMinutes * 60
      ) {
        nextDelay = settings.sleepDurationMinutes * 60 * 1000;
        lastSleepElapsedRef.current = elapsedNow + settings.sleepDurationMinutes * 60;
        const wakeupTime = new Date(Date.now() + nextDelay).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setStatusText(`Sleeping for ${settings.sleepDurationMinutes}m`);
        addLog('info', `Sleeping... Will wake up at ${wakeupTime}`);
      } else {
        const fatigue = getFatigueMultiplier(elapsedNow);
        burstRemainingRef.current -= 1;
        if (burstRemainingRef.current <= 0) {
          burstRemainingRef.current = randomInt(BURST_MIN_SEARCHES, BURST_MAX_SEARCHES);
          nextDelay = getBurstPauseDelay(baseDelay) * fatigue;
        } else {
          nextDelay = getBurstGapDelay(baseDelay) * fatigue;
        }
        if (getHourlySearchCount() >= HOURLY_SEARCH_SOFT_THROTTLE) {
          nextDelay = Math.max(nextDelay, getDelayFromRpm(3));
        }
      }

      queueNextLoop(nextDelay);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown loop error.';
      setLastError(errorMessage);
      addLog('error', errorMessage);
      queueNextLoop(2500, true);
    }
  };

  // Running timer for the "STOP SNIPING (RUNNING 04:12)" button.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setElapsedSeconds(elapsed()), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
      deactivateKeepAwake(KEEP_AWAKE_TAG);
    },
    []
  );

  const stop = useCallback(() => {
    if (!runningRef.current) return;
    addLog('info', 'Bot stopped', { kind: 'stop' });
    halt(null);
  }, [addLog, halt]);

  /** Validates like BasicMode.handleStartStop, then starts the loop. Returns an error message or null. */
  const start = useCallback(
    async (settings: SniperSettings): Promise<string | null> => {
      if (runningRef.current) return null;

      const fail = (message: string) => {
        setLastError(message);
        return message;
      };

      const info = await bridge.getUserInfo();
      if (!info || info.error || !info.personaName) {
        setUserInfo(null);
        return fail('Please sign into the EA Web App first.');
      }
      setUserInfo(info);

      if (!(settings.minPrice > 0) || !(settings.maxPrice > 0)) return fail('Enter valid min and max prices.');
      if (settings.minPrice > settings.maxPrice) return fail('Min price cannot be greater than max price.');
      if (settings.autoList && settings.futbinPrice === null) {
        return fail('FUTBIN price not loaded yet. Wait for the price, or turn off Auto-List.');
      }

      settingsRef.current = settings;
      runningRef.current = true;
      startedAtRef.current = Date.now();
      loopCountRef.current = 0;
      cardsBoughtRef.current = 0;
      lastSleepElapsedRef.current = 0;
      searchesUntilClickSequenceRef.current = randomInt(5, 10);
      burstRemainingRef.current = randomInt(BURST_MIN_SEARCHES, BURST_MAX_SEARCHES);
      setIsRunning(true);
      setElapsedSeconds(0);
      setLoopCount(0);
      setCardsBought(0);
      setSessionSpent(0);
      setSessionProfit(0);
      setLastError(null);
      addLog('info', 'Bot started', { kind: 'start' });
      void activateKeepAwakeAsync(KEEP_AWAKE_TAG);
      void pushBotStatus('running', { activeFilters: settings });

      queueNextLoop(0);
      return null;
    },
    [addLog, bridge, pushBotStatus]
  );

  /** Let the user change settings mid-run (picked up on the next loop). */
  const updateSettings = useCallback((settings: SniperSettings) => {
    settingsRef.current = settings;
  }, []);

  /** Feed bridge events in here (from useBotBridge's onEvent). */
  const handlePageEvent = useCallback(
    (event: { type: string; payload?: any }) => {
      if (event.type === 'BOT_PROGRESS') {
        addLog(event.payload.level, event.payload.message, event.payload.detail);
      } else if (event.type === 'BOT_PURCHASE') {
        const { name, rating, price, tradeId } = event.payload;
        const settings = settingsRef.current;
        // Filter Snipe logs its own "Sniped ..." entry (botLogic.ts).
        if (!settings.filterMode) {
          addLog('success', `${name} bought for ${price}`, {
            kind: 'snipe',
            name,
            rating,
            price,
            underMax: settings.maxPrice - price,
            listManually: !settings.autoList,
          });
        }
        void pushBotStatus('running', { purchase: { name, price, tradeId } });
      } else if (event.type === 'BOT_USER_INFO_RESULT' && !event.payload?.error) {
        setUserInfo(event.payload);
      }
    },
    [addLog, pushBotStatus]
  );

  const clearLogs = useCallback(() => setLogs([]), []);

  return {
    isRunning,
    elapsedSeconds,
    loopCount,
    cardsBought,
    sessionSpent,
    sessionProfit,
    statusText,
    lastError,
    hourlySearchCount,
    userInfo,
    logs,
    start,
    stop,
    updateSettings,
    handlePageEvent,
    clearLogs,
  };
}
