import React, { useState, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ProfileReferralCardProps {
  referralCode: string;
}

export const ProfileReferralCard = React.memo(function ProfileReferralCard({
  referralCode,
}: ProfileReferralCardProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Your Referral Code</Text>
        <Text style={styles.cardSubtitle}>
          Share your code with friends to unlock sniper rewards
        </Text>
      </View>
      <Pressable
        onPress={handleCopy}
        style={styles.referralCodeBox}
        accessibilityRole="button"
        accessibilityLabel="Copy referral code"
      >
        <Text style={styles.referralCodeText}>{referralCode || 'ELITE6'}</Text>
        <Text style={styles.copyLabel}>{copied ? '✓ Copied' : 'Tap code'}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    gap: spacing.xxs,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  referralCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radii.input,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderFocus,
  },
  referralCodeText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: 2,
    color: colors.accent,
  },
  copyLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
});
