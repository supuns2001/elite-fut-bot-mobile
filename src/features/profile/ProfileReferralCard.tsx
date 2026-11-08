import React, { useState, useCallback } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowUpRight, Tag } from '@/src/components/icons';
import { preferencesService } from '@/src/services/preferencesService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ProfileReferralCardProps {
  referralCode?: string;
}

export const ProfileReferralCard = React.memo(function ProfileReferralCard({
  referralCode,
}: ProfileReferralCardProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const code = referralCode || 'ELITE6';

  const handleCopy = useCallback(() => {
    setCopied(true);
    if (preferencesService.getPreferencesSync().haptics) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTimeout(() => setCopied(false), 2200);
  }, []);

  const handleShare = useCallback(async () => {
    try {
      if (preferencesService.getPreferencesSync().haptics) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await Share.share({
        message: `Use my referral code ${code} on EliteFutBot to unlock bonus sniper rewards! Download at https://www.elitefutbot.com`,
      });
    } catch {
      // User dismissed
    }
  }, [code]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconTile}>
          <Tag size={20} color={colors.accent} />
        </View>
        <View style={styles.headerMeta}>
          <Text style={styles.cardTitle}>Referral Rewards</Text>
          <Text style={styles.cardSubtitle}>
            Share with friends to unlock bonus sniper days
          </Text>
        </View>
      </View>

      <View style={styles.codeRow}>
        <Pressable
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copy referral code"
          style={({ pressed }) => [
            styles.codeBox,
            pressed && styles.codeBoxPressed,
          ]}
        >
          <View style={styles.codeTextGroup}>
            <Text style={styles.codeLabel}>YOUR CODE</Text>
            <Text style={styles.codeValue}>{code}</Text>
          </View>
          <View style={styles.copyPill}>
            <Text style={[styles.copyLabel, copied && styles.copyLabelActive]}>
              {copied ? '✓ Copied' : 'Tap code'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={handleShare}
          accessibilityRole="button"
          accessibilityLabel="Share referral code"
          style={({ pressed }) => [
            styles.shareButton,
            pressed && styles.shareButtonPressed,
          ]}
        >
          <Text style={styles.shareText}>Share</Text>
          <ArrowUpRight size={14} color={colors.textPrimary} />
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
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radii.iconTile,
    backgroundColor: colors.surfaceIconTile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerMeta: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  codeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radii.innerRow,
    paddingHorizontal: spacing.gap,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    minHeight: 52,
  },
  codeBoxPressed: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(203, 242, 29, 0.05)',
  },
  codeTextGroup: {
    gap: 1,
  },
  codeLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 9,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  codeValue: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
    letterSpacing: 2,
    color: colors.accent,
  },
  copyPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  copyLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  copyLabelActive: {
    fontFamily: fonts.bold,
    color: colors.accent,
  },
  shareButton: {
    height: 52,
    backgroundColor: colors.surfaceTrack,
    borderRadius: radii.innerRow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.gap,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  shareButtonPressed: {
    opacity: 0.8,
  },
  shareText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
});
