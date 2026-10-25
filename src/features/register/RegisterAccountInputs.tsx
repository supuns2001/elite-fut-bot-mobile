import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check } from '@/src/components/icons';
import { TextField } from '@/src/components/TextField';
import { PasswordStrengthMeter } from '@/src/features/register/PasswordStrengthMeter';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface RegisterAccountInputsProps {
  email: string;
  badEmail?: boolean;
  onEmailChange: (text: string) => void;
  password: string;
  badPassword?: boolean;
  onPasswordChange: (text: string) => void;
  referral: string;
  onReferralChange: (text: string) => void;
}

export const RegisterAccountInputs = React.memo(function RegisterAccountInputs({
  email,
  badEmail,
  onEmailChange,
  password,
  badPassword,
  onPasswordChange,
  referral,
  onReferralChange,
}: RegisterAccountInputsProps): React.ReactElement {
  const isReferralValid = referral.length >= 4;

  const referralAccessory = isReferralValid ? (
    <View style={styles.referralBadge}>
      <Check size={12} color={colors.accent} strokeWidth={2.6} />
      <Text style={styles.referralBadgeText}>Added</Text>
    </View>
  ) : undefined;

  return (
    <>
      <TextField
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={badEmail}
      />

      <View style={styles.passwordGroup}>
        <TextField
          label="Password"
          value={password}
          onChangeText={onPasswordChange}
          placeholder="8+ characters"
          isPassword
          autoCapitalize="none"
          autoComplete="new-password"
          error={badPassword}
        />
        <PasswordStrengthMeter password={password} />
      </View>

      <TextField
        label="Referral ID"
        sublabel="optional"
        value={referral}
        onChangeText={onReferralChange}
        placeholder="e.g. ELITE24"
        isMonospace
        isDashed
        rightAccessory={referralAccessory}
      />
    </>
  );
});

const styles = StyleSheet.create({
  passwordGroup: {
    gap: spacing.md,
  },
  referralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 28,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: '#161C05',
  },
  referralBadgeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.accent,
  },
});
