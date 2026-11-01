import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Mail } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ProfileUserCardProps {
  displayName: string;
  email: string;
  trialBadge: string;
}

export const ProfileUserCard = React.memo(function ProfileUserCard({
  displayName,
  email,
  trialBadge,
}: ProfileUserCardProps): React.ReactElement {
  const avatarInitial = useMemo(() => {
    return displayName.trim().charAt(0).toUpperCase() || 'E';
  }, [displayName]);

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatarInitial}</Text>
      </View>
      <View style={styles.profileMeta}>
        <Text style={styles.userName} numberOfLines={1}>
          {displayName}
        </Text>
        <View style={styles.emailRow}>
          <Mail size={14} color={colors.textSecondary} />
          <Text style={styles.userEmail} numberOfLines={1}>
            {email}
          </Text>
        </View>
        <View style={styles.planBadge}>
          <View style={styles.planBadgeDot} />
          <Text style={styles.planBadgeText}>{trialBadge}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLg,
    color: colors.accent,
  },
  profileMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  userName: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    color: colors.textPrimary,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userEmail: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  planBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#161C05',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  planBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  planBadgeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.accent,
  },
});
