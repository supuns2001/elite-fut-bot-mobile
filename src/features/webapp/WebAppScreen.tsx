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

export function WebAppScreen(): React.ReactElement {
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const controlsSheetRef = useRef<BottomSheetModal>(null);
  const logSheetRef = useRef<BottomSheetModal>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [loops, setLoops] = useState(0);
  const [isListing, setIsListing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Background loop counter when bot is running
  useEffect(() => {
    if (!isRunning) return;
    const loopInterval = setInterval(() => {
      setLoops((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(loopInterval);
  }, [isRunning]);

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
      setShowToast(true);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), 2400);
    }, 1200);
  }, []);

  const handleOpenControls = useCallback(() => controlsSheetRef.current?.present(), []);
  const handleCloseControls = useCallback(() => controlsSheetRef.current?.dismiss(), []);
  const handleOpenActivityLog = useCallback(() => logSheetRef.current?.present(), []);
  const handleCloseActivityLog = useCallback(() => logSheetRef.current?.dismiss(), []);

  const handleToggleRun = useCallback(() => {
    setIsRunning((prev) => {
      const next = !prev;
      setLoops(next ? 1 : 0);
      return next;
    });
  }, []);

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
        isRunning={isRunning}
        loops={loops}
        onReload={handleReload}
      />

      <WebAppToast
        visible={showToast}
        topInset={insets.top}
        message="3 cards listed at FUTBIN +5%"
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
          onLoadEnd={() => {
            setIsLoading(false);
          }}
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
        isRunning={isRunning}
        loops={loops}
        onToggleRun={handleToggleRun}
        onOpenActivityLog={handleOpenActivityLog}
        onClose={handleCloseControls}
      />

      <ActivityLogSheet
        ref={logSheetRef}
        isLive={isRunning}
        onClose={handleCloseActivityLog}
      />
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
    zIndex: 10,
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
