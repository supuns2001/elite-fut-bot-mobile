import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface ControlsStatsStripProps {
  cardsBought?: number;
  elapsedSeconds?: number;
  profitMade?: number;
}

export const ControlsStatsStrip = React.memo(function ControlsStatsStrip({
  cardsBought = 0,
  elapsedSeconds = 0,
  profitMade = 0,
}: ControlsStatsStripProps): React.ReactElement {
  const formattedTime = useMemo(() => {
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(mins)}:${pad(secs)}`;
  }, [elapsedSeconds]);

  return (
    <View style={styles.container}>
      {/* Cards Bought */}
      <View style={styles.statCol}>
        <Text style={styles.statLabel}>Cards Bought</Text>
        <Text style={styles.statValue}>{cardsBought}</Text>
      </View>

      <View style={styles.divider} />

      {/* Time Running */}
      <View style={styles.statCol}>
        <Text style={styles.statLabel}>Time Running</Text>
        <Text style={[styles.statValue, styles.timeValue]}>{formattedTime}</Text>
      </View>

      <View style={styles.divider} />

      {/* Profit Made */}
      <View style={styles.statCol}>
        <Text style={styles.statLabel}>Profit Made</Text>
        <View style={styles.profitRow}>
          <Text style={styles.coinSymbol}>©</Text>
          <Text style={styles.statValue}>{profitMade.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#262626',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.md,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs - 1,
    color: '#888888',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.titleSm,
    color: colors.accent,
  },
  timeValue: {
    color: '#CBFF00',
  },
  profitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  coinSymbol: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.xs,
    color: colors.accent,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#262626',
  },
});

