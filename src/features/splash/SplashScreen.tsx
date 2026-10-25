import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/src/theme/tokens';
import { authService } from '@/src/services/authService';
import { SplashHero } from '@/src/features/splash/SplashHero';
import { SplashProgress } from '@/src/features/splash/SplashProgress';

export function SplashScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);

  const autoContinueRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (autoContinueRef.current) {
        clearTimeout(autoContinueRef.current);
      }
    };
  }, []);

  const navigateNext = useCallback(async () => {
    if (autoContinueRef.current) {
      clearTimeout(autoContinueRef.current);
    }
    try {
      const session = await authService.loadPersistedSession();
      if (session) {
        if (session.hasMobileAccess) {
          router.replace('/(tabs)/home');
          return;
        }
        router.replace('/paywall');
        return;
      }
    } catch {
      // Fallback to intro
    }
    router.replace('/intro');
  }, [router]);

  const handleContinue = useCallback(() => {
    void navigateNext();
  }, [navigateNext]);

  const handleReady = useCallback(() => {
    setIsReady(true);
    autoContinueRef.current = setTimeout(() => {
      void navigateNext();
    }, 600);
  }, [navigateNext]);

  const handleScreenPress = useCallback(() => {
    if (isReady) {
      handleContinue();
    }
  }, [isReady, handleContinue]);

  const bottomInsetPadding = React.useMemo(
    () => ({
      paddingBottom: Math.max(insets.bottom, spacing.lg),
      paddingTop: Math.max(insets.top, spacing.lg),
    }),
    [insets.bottom, insets.top]
  );

  return (
    <Pressable
      onPress={handleScreenPress}
      style={[styles.container, bottomInsetPadding]}
      accessibilityRole="button"
      accessibilityLabel="EliteFutBot Splash Screen"
    >
      <View style={styles.centerSection}>
        <SplashHero />
      </View>

      <SplashProgress onContinue={handleContinue} onReady={handleReady} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
