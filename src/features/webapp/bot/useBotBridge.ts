import { useCallback, useEffect, useRef, type RefObject } from 'react';
import type { WebView, WebViewMessageEvent } from 'react-native-webview';
import { MOBILE_BUNDLE } from '@/src/features/webapp/bot/mobileBundle';
import type {
  BotClickSequenceResult,
  BotLoopResult,
  BotRunLoopPayload,
  BotUserInfoResultPayload,
  PageToExtensionMessage,
} from '@/src/features/webapp/bot/botRuntime';

// Same timeouts the extension's content script uses.
const LOOP_TIMEOUT_MS = 45000;
const USER_INFO_TIMEOUT_MS = 10000;
const CLICK_SEQUENCE_TIMEOUT_MS = 15000;

// Only inject on the Web App itself, never on signin.ea.com / accounts.ea.com.
const WEB_APP_PATH = '/ultimate-team/web-app';

// Messages that answer a specific request. BOT_LOG also carries the loop's
// requestId, so matching on requestId alone would resolve loops too early.
const RESPONSE_TYPES = new Set([
  'FUTSNIPE_RESULT',
  'BOT_USER_INFO_RESULT',
  'CLICK_SEQUENCE_RESULT',
]);

export type BotPageEvent =
  | PageToExtensionMessage
  | { source: 'futsnipe-page'; type: 'BOT_READY' };

interface PendingRequest {
  resolve: (payload: unknown) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

function createRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Bridge between React Native and mobile-bundle.js running inside the EA Web
 * App WebView. Replaces the extension's content.tsx + background.ts routing.
 *
 * Wire it up on the <WebView>:
 *   onLoadEnd={({ nativeEvent }) => bridge.injectBot(nativeEvent.url)}
 *   onMessage={bridge.handleMessage}
 */
export function useBotBridge(
  webViewRef: RefObject<WebView | null>,
  onEvent: (event: BotPageEvent) => void
) {
  const pendingRef = useRef(new Map<string, PendingRequest>());
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useEffect(() => {
    const pending = pendingRef.current;
    return () => {
      pending.forEach(({ timeoutId }) => clearTimeout(timeoutId));
      pending.clear();
    };
  }, []);

  const injectBot = useCallback(
    (url: string | undefined) => {
      if (!url || !url.includes(WEB_APP_PATH)) return;
      // The bundle guards on window.__eliteBot, so re-injecting is a no-op.
      webViewRef.current?.injectJavaScript(`${MOBILE_BUNDLE}\ntrue;`);
    },
    [webViewRef]
  );

  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    let message: (BotPageEvent & { requestId?: string; payload?: unknown }) | null = null;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }
    if (!message || message.source !== 'futsnipe-page') return;

    if (message.requestId && RESPONSE_TYPES.has(message.type)) {
      const pending = pendingRef.current.get(message.requestId);
      if (pending) {
        clearTimeout(pending.timeoutId);
        pendingRef.current.delete(message.requestId);
        pending.resolve(message.payload);
      }
    }

    onEventRef.current(message);
  }, []);

  // Calls window.__eliteBot.<method>(...args, requestId) in the page and
  // resolves with the matching response, or `fallback` if the bot isn't
  // loaded or the page never answers.
  const request = useCallback(
    <T>(method: string, args: unknown[], timeoutMs: number, fallback: T): Promise<T> => {
      const webView = webViewRef.current;
      if (!webView) return Promise.resolve(fallback);

      const requestId = createRequestId();
      return new Promise<T>((resolve) => {
        const timeoutId = setTimeout(() => {
          pendingRef.current.delete(requestId);
          resolve(fallback);
        }, timeoutMs);
        pendingRef.current.set(requestId, {
          resolve: (payload) => resolve(payload as T),
          timeoutId,
        });

        const callArgs = [...args, requestId].map((a) => JSON.stringify(a)).join(',');
        const notLoaded = JSON.stringify({
          source: 'futsnipe-page',
          type: 'FUTSNIPE_RESULT',
          requestId,
          payload: { ok: false, error: 'Bot not loaded. Open the EA Web App first.' },
        });
        webView.injectJavaScript(`
          (function() {
            if (window.__eliteBot) { window.__eliteBot.${method}(${callArgs}); }
            else if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(${JSON.stringify(notLoaded)}); }
          })();
          true;
        `);
      });
    },
    [webViewRef]
  );

  const runLoop = useCallback(
    (payload: BotRunLoopPayload) =>
      request<BotLoopResult>('run', [payload], LOOP_TIMEOUT_MS, {
        ok: false,
        error: 'Timed out waiting for FUT page response.',
      }),
    [request]
  );

  const getUserInfo = useCallback(
    () =>
      request<BotUserInfoResultPayload>('userInfo', [], USER_INFO_TIMEOUT_MS, {
        error: 'Timed out waiting for user info response.',
      }),
    [request]
  );

  const runClickSequence = useCallback(
    () =>
      request<BotClickSequenceResult>('clickSequence', [], CLICK_SEQUENCE_TIMEOUT_MS, {
        ok: false,
        error: 'Timed out waiting for click sequence.',
      }),
    [request]
  );

  const stop = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      'window.__eliteBot && window.__eliteBot.stop(); true;'
    );
  }, [webViewRef]);

  return { injectBot, handleMessage, runLoop, getUserInfo, runClickSequence, stop };
}

export type BotBridge = ReturnType<typeof useBotBridge>;
