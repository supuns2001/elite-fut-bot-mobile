import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface PasswordStrengthMeterProps {
  password?: string;
}

export const PasswordStrengthMeter = React.memo(function PasswordStrengthMeter({
  password = '',
}: PasswordStrengthMeterProps): React.ReactElement {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score++;
  if (password.length >= 12 || /[^a-zA-Z0-9]/.test(password)) score++;
  if (password.length > 0 && password.length < 8) score = 0;

  let strengthLabel = '';
  if (password.length > 0) {
    if (score === 0) {
      strengthLabel = 'Too short';
    } else {
      const labels = ['Weak', 'Good', 'Strong'] as const;
      strengthLabel = labels[score - 1];
    }
  }

  const getBarStyle = (isLit: boolean, colorType: 'off' | 'error' | 'warning' | 'success') => {
    if (!isLit) return styles.barOff;
    if (colorType === 'error') return styles.barError;
    if (colorType === 'warning') return styles.barWarning;
    return styles.barSuccess;
  };

  const getLabelStyle = () => {
    if (score === 0) return styles.textError;
    if (score === 1) return styles.textError;
    if (score === 2) return styles.textWarning;
    return styles.textSuccess;
  };

  const colorType = score === 0 ? 'error' : score === 1 ? 'error' : score === 2 ? 'warning' : 'success';

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        <View style={[styles.bar, getBarStyle(password.length > 0, colorType)]} />
        <View style={[styles.bar, getBarStyle(score >= 2, colorType)]} />
        <View style={[styles.bar, getBarStyle(score >= 3, colorType)]} />
      </View>
      <Text style={[styles.strengthText, getLabelStyle()]}>{strengthLabel}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.sm,
    minHeight: 18,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: radii.xs / 2,
  },
  barOff: {
    backgroundColor: '#2A2A2A',
  },
  barError: {
    backgroundColor: colors.error,
  },
  barWarning: {
    backgroundColor: colors.warning,
  },
  barSuccess: {
    backgroundColor: colors.accent,
  },
  strengthText: {
    minWidth: 64,
    textAlign: 'right',
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
  },
  textError: {
    color: colors.error,
  },
  textWarning: {
    color: colors.warning,
  },
  textSuccess: {
    color: colors.accent,
  },
});
