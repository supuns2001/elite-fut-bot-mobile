import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface PaywallStatusRowProps {
  statusText: string;
  isChecking: boolean;
  onRefresh: () => void;
}

export const PaywallStatusRow = React.memo(function PaywallStatusRow({
  statusText,
  isChecking,
  onRefresh,
}: PaywallStatusRowProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>Already upgraded?</Text>
        <Text style={styles.statusText}>
          {statusText}
        </Text>
      </View>

      <Pressable
        onPress={onRefresh}
        disabled={isChecking}
        accessibilityRole="button"
        accessibilityLabel="Refresh license status"
        style={[styles.refreshButton, isChecking && styles.refreshButtonDisabled]}
      >
        <Text style={styles.refreshText}>{isChecking ? 'Checking…' : 'Refresh'}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.gap,
    paddingRight: spacing.sm,
    gap: spacing.xl,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  statusText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  refreshButton: {
    height: 44,
    paddingHorizontal: spacing.gap,
    borderRadius: radii.avatar,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
