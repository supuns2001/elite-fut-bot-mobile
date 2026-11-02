import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toggle } from '@/src/components/Toggle';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export const ControlsAdvancedModeRow = React.memo(function ControlsAdvancedModeRow(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.title}>Advanced Mode</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Custom RPM, sleep timers, action delays & purchase limits
        </Text>
      </View>
      <Toggle value={false} onValueChange={() => {}} disabled={true} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#161616',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#262626',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  leftGroup: {
    flex: 1,
    paddingRight: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 2,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: '#D4D4D4',
  },
  badge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#666666',
  },
});

