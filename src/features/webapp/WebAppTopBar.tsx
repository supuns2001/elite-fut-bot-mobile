import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RotateCcw, Sun } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface WebAppTopBarProps {
  topInset: number;
  isRunning: boolean;
  loops: number;
  onReload: () => void;
}

export const WebAppTopBar = React.memo(function WebAppTopBar({
  topInset,
  isRunning,
  loops,
  onReload,
}: WebAppTopBarProps): React.ReactElement {
  const barText = isRunning ? `Running · ${loops} loops` : 'Bot ready';

  const containerStyle = React.useMemo(
    () => [styles.floatingBar, { top: topInset + spacing.xs }],
    [topInset]
  );

  return (
    <View style={containerStyle}>
      <Pressable
        onPress={onReload}
        accessibilityRole="button"
        accessibilityLabel="Reload Web App"
        style={styles.reloadButton}
      >
        <RotateCcw size={18} color="#D4D4D4" strokeWidth={1.75} />
      </Pressable>

      <View style={styles.statusCol}>
        <View style={styles.limeDot} />
        <Text style={[styles.statusText, isRunning && styles.statusRunning]} numberOfLines={1}>
          {barText}
        </Text>
      </View>

      <View style={styles.awakeBadge}>
        <Sun size={14} color={colors.warning} strokeWidth={2} />
        <Text style={styles.awakeText}>Awake</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  floatingBar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    height: 48,
    zIndex: 10,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(10, 10, 10, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: spacing.xxs,
    paddingRight: spacing.xl,
  },
  reloadButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statusCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  limeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  statusRunning: {
    color: colors.accent,
  },
  awakeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
  },
  awakeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.warning,
  },
});
