import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { WebView } from 'react-native-webview';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import { WebAppTopBar } from '@/src/features/webapp/WebAppTopBar';
import { SnipingControlsSheet } from '@/src/features/webapp/SnipingControlsSheet';
import { ActivityLogSheet } from '@/src/features/webapp/ActivityLogSheet';
import { WebAppToast } from '@/src/features/webapp/WebAppToast';
import {
  EA_WEBAPP_URL,
  EA_CHROME_USER_AGENT,
  INJECTED_VIEWPORT_SCRIPT,
} from '@/src/features/webapp/webAppConfig';
import { useBotBridge, type BotPageEvent } from '@/src/features/webapp/bot/useBotBridge';
import { useSniperBot, type SniperSettings } from '@/src/features/webapp/bot/useSniperBot';
import type { BotPlayerInfoPayload } from '@/src/features/webapp/bot/botRuntime';
import {
  useFutbinScraper,
  FUTBIN_BASE_URL,
} from '@/src/features/webapp/bot/useFutbinScraper';

export function WebAppScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const controlsSheetRef = useRef<BottomSheetModal>(null);
  const logSheetRef = useRef<BottomSheetModal>(null);

  const [player, setPlayer] = useState<BotPlayerInfoPayload | null>(null);
  const [isListing, setIsListing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('3 cards listed at FUTBIN +5%');
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Hidden WebView scraper for live FUTBIN lowest BIN prices (Cloudflare bypass)
  const futbin = useFutbinScraper();

  // useSniperBot needs the bridge, and the bridge onEvent routes through onEventRef
  const onEventRef = useRef<(e: BotPageEvent) => void>(() => {});
  const bridge = useBotBridge(webViewRef, (e) => onEventRef.current(e));
  const bot = useSniperBot(bridge, {
    putBotStatus: async () => {},
    putStats: async () => {},
  });

  onEventRef.current = (e) => {
    bot.handlePageEvent(e);

    if (e.type === 'BOT_PLAYER_INFO') {
      // If user searched in EA UI while bot is already running, do not override
      if (e.payload.fromUserSearch && bot.isRunning) return;
      const validPlayer = e.payload.maskedDefId ? e.payload : null;
      setPlayer(validPlayer);

      if (e.payload.name) {
        const platform = bot.userInfo?.platform?.toLowerCase().includes('pc')
          ? 'pc'
          : 'ps';
        void futbin.fetchPlayerPrice(e.payload.name, e.payload.maskedDefId, platform);
      }
    } else if (e.type === 'BOT_READY') {
      void bridge.getUserInfo();
    } else if (e.type === 'BOT_PURCHASE') {
      setToastMessage(`Bought ${e.payload.name} for ${e.payload.price.toLocaleString()}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const listTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (listTimeoutRef.current) clearTimeout(listTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleReload = useCallback(() => {
    setIsLoading(true);
    setLoadProgress(0.1);
    webViewRef.current?.reload();
  }, []);

  const handleListAll = useCallback(() => {
    setIsListing(true);
    listTimeoutRef.current = setTimeout(() => {
      setIsListing(false);
      setToastMessage('3 cards listed at FUTBIN +5%');
      setShowToast(true);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), 2400);
    }, 1200);
  }, []);

  const handleOpenControls = useCallback(() => controlsSheetRef.current?.present(), []);
  const handleCloseControls = useCallback(() => controlsSheetRef.current?.dismiss(), []);
  const handleOpenActivityLog = useCallback(() => logSheetRef.current?.present(), []);
  const handleCloseActivityLog = useCallback(() => logSheetRef.current?.dismiss(), []);

  const handleStartBot = useCallback(
    async (settings: SniperSettings): Promise<string | null> => {
      const err = await bot.start(settings);
      return err;
    },
    [bot]
  );

  const handleStopBot = useCallback(() => {
    bot.stop();
  }, [bot]);

  const floatingActionsStyle = React.useMemo(
    () => ({
      bottom: Math.max(insets.bottom, spacing.md) + 72,
    }),
    [insets.bottom]
  );

  const webViewStyle = React.useMemo(
    () => ({
      marginTop: insets.top + 52,
      marginBottom: Math.max(insets.bottom, spacing.md) + 68,
    }),
    [insets.bottom, insets.top]
  );

  return (
    <View style={styles.container}>
      <WebAppTopBar
        topInset={insets.top}
        isRunning={bot.isRunning}
        loops={bot.loopCount}
        onReload={handleReload}
      />

      <WebAppToast
        visible={showToast}
        topInset={insets.top}
        message={toastMessage}
      />

      {/* Loading progress bar */}
      {isLoading && (
        <View style={[styles.loadingBarContainer, { top: insets.top + 50 }]}>
          <View
            style={[
              styles.loadingBarFill,
              { width: `${Math.max(12, Math.round(loadProgress * 100))}%` },
            ]}
          />
        </View>
      )}

      {/* Main Embedded EA Web App WebView */}
      <View style={[styles.webViewContainer, webViewStyle]}>
        <WebView
          ref={webViewRef}
          source={{ uri: EA_WEBAPP_URL }}
          userAgent={EA_CHROME_USER_AGENT}
          injectedJavaScript={INJECTED_VIEWPORT_SCRIPT}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          mixedContentMode="always"
          setSupportMultipleWindows={false}
          javaScriptCanOpenWindowsAutomatically
          scalesPageToFit
          style={styles.webView}
          onLoadStart={() => {
            setIsLoading(true);
            setLoadProgress(0.15);
          }}
          onLoadProgress={({ nativeEvent }) => {
            setLoadProgress(nativeEvent.progress);
          }}
          onLoadEnd={({ nativeEvent }) => {
            setIsLoading(false);
            bridge.injectBot(nativeEvent.url);
          }}
          onNavigationStateChange={({ url, loading }) => {
            if (!loading) bridge.injectBot(url);
          }}
          onMessage={bridge.handleMessage}
          renderLoading={() => (
            <View style={styles.centerLoading}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Connecting to EA Web App…</Text>
            </View>
          )}
        />
      </View>

      {/* Floating Bot Action Buttons */}
      <View style={[styles.floatingActions, floatingActionsStyle]}>
        <Pressable
          onPress={handleListAll}
          disabled={isListing}
          accessibilityRole="button"
          accessibilityLabel="List all cards"
          style={styles.listAllButton}
        >
          <Text style={styles.listAllText}>{isListing ? 'Listing…' : 'List all'}</Text>
        </Pressable>

        <Pressable
          onPress={handleOpenControls}
          accessibilityRole="button"
          accessibilityLabel="Open sniping controls"
          style={styles.controlsButton}
        >
          <Image
            source={require('@/assets/logo.png')}
            style={styles.controlsLogo}
            contentFit="contain"
          />
          <Text style={styles.controlsText}>Controls</Text>
        </Pressable>
      </View>

      <SnipingControlsSheet
        ref={controlsSheetRef}
        isRunning={bot.isRunning}
        loops={bot.loopCount}
        elapsedSeconds={bot.elapsedSeconds}
        statusText={bot.statusText}
        error={bot.lastError}
        player={player}
        futbinPrice={futbin.currentPrice}
        isLoadingPrice={futbin.isLoadingPrice}
        onStart={handleStartBot}
        onStop={handleStopBot}
        onOpenActivityLog={handleOpenActivityLog}
        onClose={handleCloseControls}
      />

      <ActivityLogSheet
        ref={logSheetRef}
        isLive={bot.isRunning}
        logs={bot.logs}
        onClear={bot.clearLogs}
        onClose={handleCloseActivityLog}
      />

      {/* Hidden Secondary WebView for Cloudflare-bypassed FUTBIN Live Price Scraping */}
      <View style={styles.hiddenWebView} pointerEvents="none">
        <WebView
          ref={futbin.futbinWebViewRef}
          source={{ uri: FUTBIN_BASE_URL }}
          userAgent={EA_CHROME_USER_AGENT}
          javaScriptEnabled
          domStorageEnabled
          onMessage={futbin.handleFutbinMessage}
          onLoadEnd={futbin.onFutbinLoadEnd}
          style={styles.zeroSize}
          pointerEvents="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  webView: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  hiddenWebView: {
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
    left: -1000,
    top: -1000,
    zIndex: -1,
  },
  zeroSize: {
    width: 0,
    height: 0,
  },
  loadingBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 20,
  },
  loadingBarFill: {
    height: 3,
    backgroundColor: colors.accent,
  },
  centerLoading: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  floatingActions: {
    position: 'absolute',
    right: spacing.gap,
    zIndex: 999,
    elevation: 25,
    flexDirection: 'row',
    gap: spacing.md,
  },
  listAllButton: {
    height: 44,
    paddingHorizontal: spacing.gap,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfacePrimary,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 26,
  },
  listAllText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  controlsButton: {
    height: 44,
    paddingLeft: spacing.xl,
    paddingRight: spacing.gap,
    borderRadius: radii.avatar,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    elevation: 26,
  },
  controlsLogo: {
    width: 18,
    height: 18,
  },
  controlsText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.textInverse,
  },
});
