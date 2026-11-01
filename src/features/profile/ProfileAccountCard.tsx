import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw } from '@/src/components/icons';
import { UserSession } from '@/src/services/authService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ProfileAccountCardProps {
  session: UserSession | null;
  onRefreshSubscription: () => Promise<void>;
}

export const ProfileAccountCard = React.memo(function ProfileAccountCard({
  session,
  onRefreshSubscription,
}: ProfileAccountCardProps): React.ReactElement {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpToDate, setIsUpToDate] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    await onRefreshSubscription();
    setIsRefreshing(false);
    setIsUpToDate(true);
  }, [isRefreshing, onRefreshSubscription]);

  const fullName = useMemo(() => {
    if (!session) return 'Kasun Perera';
    const name = `${session.firstName} ${session.lastName}`.trim();
    return name || session.firstName || 'FUT Trader';
  }, [session]);

  const initials = useMemo(() => {
    if (!session?.firstName) return 'KP';
    const first = session.firstName.charAt(0);
    const last = session.lastName ? session.lastName.charAt(0) : '';
    return `${first}${last}`.toUpperCase() || 'KP';
  }, [session]);

  const planName = useMemo(() => {
    return session?.plan === 'mobile' ? 'Pro Mobile Plan' : '2-Day Free Trial';
  }, [session?.plan]);

  const expiryDateFormatted = useMemo(() => {
    if (session?.mobileAccessExpiresAt) {
      const d = new Date(session.mobileAccessExpiresAt);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return 'Dec 31, 2026';
  }, [session?.mobileAccessExpiresAt]);

  const statusLine = isUpToDate
    ? `Up to date · Active until ${expiryDateFormatted}`
    : `Active until ${expiryDateFormatted}`;

  return (
    <View style={styles.card}>
      {/* Top User Info Row */}
      <View style={styles.userRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.userMeta}>
          <Text style={styles.userName} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {session?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Inner Status Row */}
      <View style={styles.innerRow}>
        <View style={styles.planCol}>
          <View style={styles.planBadgeRow}>
            <View style={styles.accentDot} />
            <Text style={styles.planName}>{planName}</Text>
          </View>
          <Text style={styles.statusLine} numberOfLines={1}>
            {statusLine}
          </Text>
        </View>

        <Pressable
          onPress={handleRefresh}
          disabled={isRefreshing}
          accessibilityRole="button"
          accessibilityLabel="Refresh subscription"
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed,
            isRefreshing && styles.refreshButtonDisabled,
          ]}
        >
          <RotateCcw size={14} color={colors.accent} strokeWidth={2.2} />
          <Text style={styles.refreshText}>
            {isRefreshing ? 'Checking…' : 'Refresh'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.cardXl,
    padding: spacing.xxxl,
    gap: spacing.inset,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textInverse,
  },
  userMeta: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleMd,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
  innerRow: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.innerRow,
    minHeight: 52,
    paddingHorizontal: spacing.gap,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  planCol: {
    flex: 1,
    gap: 3,
  },
  planBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  accentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  planName: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  statusLine: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  refreshButton: {
    height: 40,
    backgroundColor: colors.surfaceTrack,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.gap,
    gap: spacing.sm,
  },
  refreshButtonPressed: {
    opacity: 0.8,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
});
