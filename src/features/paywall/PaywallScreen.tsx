import React, { useCallback, useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/src/components/Button';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import { PaywallHeader } from '@/src/features/paywall/PaywallHeader';
import { PaywallFeatureGrid } from '@/src/features/paywall/PaywallFeatureGrid';
import { PaywallStatusRow } from '@/src/features/paywall/PaywallStatusRow';

export function PaywallScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isChecking, setIsChecking] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const refreshTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const handleSignOut = useCallback(() => {
    router.replace('/sign-in');
  }, [router]);

  const handleRefresh = useCallback(() => {
    setIsChecking(true);
    refreshTimeoutRef.current = setTimeout(() => {
      setIsChecking(false);
      setIsChecked(true);
    }, 1300);
  }, []);

  const handleUpgradeWeb = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com');
  }, []);

  const handleSupportPress = useCallback(() => {
    void Linking.openURL('https://discord.gg/Rkb9nF6WG6');
  }, []);

  const statusText = isChecking
    ? 'Checking your license…'
    : isChecked
    ? 'Checked just now · still inactive'
    : 'Refresh to update your access';

  const screenInsetsStyle = React.useMemo(
    () => ({
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, spacing.md),
    }),
    [insets.top, insets.bottom]
  );

  return (
    <View style={[styles.container, screenInsetsStyle]}>
      <PaywallHeader onSignOutPress={handleSignOut} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentBody}>
          <View style={styles.titleSection}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Web license only</Text>
            </View>

            <Text style={styles.title}>Take sniping mobile</Text>
            <Text style={styles.subtitle}>
              Add the Mobile add-on to your license to run EliteFutBot from your phone.
            </Text>
          </View>

          <PaywallFeatureGrid />

          <PaywallStatusRow
            statusText={statusText}
            isChecking={isChecking}
            onRefresh={handleRefresh}
          />
        </View>

        <View style={styles.bottomActions}>
          <Button
            title="Add Mobile on the web"
            variant="pill-with-arrow"
            arrowType="diagonal"
            onPress={handleUpgradeWeb}
          />

          <Pressable
            onPress={handleSupportPress}
            accessibilityRole="link"
            accessibilityLabel="Chat with support"
            style={styles.supportButton}
          >
            <Text style={styles.supportText}>Questions? Chat with support</Text>
          </Pressable>
        </View>
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
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.gap,
    paddingBottom: spacing.sm,
  },
  contentBody: {
    gap: spacing.section,
  },
  titleSection: {
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 28,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: '#1F1A0C',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.warning,
  },
  title: {
    marginTop: spacing.sm,
    fontFamily: fonts.bold,
    fontSize: fontSizes.displayMd,
    lineHeight: 38,
    color: colors.textPrimary,
    letterSpacing: -1.19,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    lineHeight: 23,
    color: colors.textSecondary,
  },
  bottomActions: {
    marginTop: spacing.jumbo,
    gap: spacing.xs,
  },
  supportButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
});
