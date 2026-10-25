import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/src/theme/tokens';
import { HomeHeader } from '@/src/features/home/HomeHeader';
import { HomeHeroCard } from '@/src/features/home/HomeHeroCard';
import { HomeStatsSection } from '@/src/features/home/HomeStatsSection';
import { HomeServerPingCard } from '@/src/features/home/HomeServerPingCard';

import { authService, UserSession } from '@/src/services/authService';

export function HomeScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [session, setSession] = React.useState<UserSession | null>(() =>
    authService.getCurrentSession()
  );

  React.useEffect(() => {
    void authService.loadPersistedSession().then((loaded) => {
      if (loaded) {
        setSession(loaded);
      }
    });
  }, []);

  const handleOpenWebApp = useCallback(() => {
    router.navigate('/(tabs)/webapp');
  }, [router]);

  const displayName = React.useMemo(() => {
    if (!session) return 'FUT Trader';
    const fullName = `${session.firstName} ${session.lastName}`.trim();
    return fullName || session.firstName || 'FUT Trader';
  }, [session]);

  const planText = React.useMemo(() => {
    if (!session || session.plan === 'mobile') {
      return 'Pro · Mobile';
    }
    if (session.mobileAccessExpiresAt) {
      const diffMs = new Date(session.mobileAccessExpiresAt).getTime() - Date.now();
      if (diffMs > 0) {
        const hours = Math.ceil(diffMs / (1000 * 60 * 60));
        return `Trial · ${hours}h`;
      }
      return 'Trial · Expired';
    }
    return 'Trial · Active';
  }, [session]);

  const screenInsetsStyle = React.useMemo(
    () => ({
      paddingTop: Math.max(insets.top, spacing.md),
    }),
    [insets.top]
  );

  const scrollContentStyle = React.useMemo(
    () => ({
      paddingBottom: Math.max(insets.bottom, spacing.md) + 80,
    }),
    [insets.bottom]
  );

  return (
    <View style={[styles.container, screenInsetsStyle]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, scrollContentStyle]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <HomeHeader
          username={displayName}
          plan={session?.plan ?? 'trial'}
          planText={planText}
        />
        <HomeHeroCard onOpenWebApp={handleOpenWebApp} />
        <HomeStatsSection />
        <HomeServerPingCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.gap,
    gap: spacing.xxl,
    paddingTop: spacing.xs,
  },
});
