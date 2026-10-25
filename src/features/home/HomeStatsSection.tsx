import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CardsIcon, CoinIcon } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export const HomeStatsSection = React.memo(function HomeStatsSection(): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today</Text>
        <Text style={styles.sectionSubtitle}>Since midnight</Text>
      </View>

      <View style={styles.gridRow}>
        {/* Left Tall Card: Est. Profit */}
        <View style={styles.profitCard}>
          <Text style={styles.statLabel}>Est. profit</Text>
          <Text style={styles.profitValue}>+38.2K</Text>

          <View style={styles.chartContainer}>
            <View style={[styles.bar, styles.bar1]} />
            <View style={[styles.bar, styles.bar2]} />
            <View style={[styles.bar, styles.bar3]} />
            <View style={[styles.bar, styles.bar4]} />
            <View style={[styles.bar, styles.bar5]} />
            <View style={[styles.bar, styles.bar6]} />
            <View style={[styles.bar, styles.bar7Active]} />
          </View>
        </View>

        {/* Right Stack: Cards bought & Coins spent */}
        <View style={styles.rightStack}>
          {/* Card 1: Cards bought */}
          <View style={styles.metricCard}>
            <View style={styles.iconBox}>
              <CardsIcon size={16} color={colors.textPrimary} strokeWidth={2} />
            </View>
            <View style={styles.metricTextGroup}>
              <Text style={styles.metricValue}>18</Text>
              <Text style={styles.metricLabel}>Cards bought</Text>
            </View>
          </View>

          {/* Card 2: Coins spent */}
          <View style={styles.metricCard}>
            <View style={styles.iconBox}>
              <CoinIcon size={16} color={colors.textPrimary} strokeWidth={2} />
            </View>
            <View style={styles.metricTextGroup}>
              <Text style={styles.metricValue}>142.5K</Text>
              <Text style={styles.metricLabel}>Coins spent</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xxs,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: -0.36,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  profitCard: {
    flex: 1,
    borderRadius: radii.cardLg,
    backgroundColor: colors.surfaceCard,
    padding: spacing.gap,
    justifyContent: 'space-between',
    minHeight: 184,
  },
  statLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  profitValue: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.displaySm,
    letterSpacing: -1.2,
    color: colors.accent,
  },
  chartContainer: {
    marginTop: 'auto',
    height: 72,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs + 1, // 5px
  },
  bar: {
    flex: 1,
    borderRadius: radii.xs,
    backgroundColor: colors.border,
  },
  bar1: { height: '30%' },
  bar2: { height: '45%' },
  bar3: { height: '38%' },
  bar4: { height: '60%' },
  bar5: { height: '55%' },
  bar6: { height: '78%' },
  bar7Active: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  rightStack: {
    flex: 1,
    gap: spacing.lg,
  },
  metricCard: {
    flex: 1,
    borderRadius: radii.cardLg,
    backgroundColor: colors.surfaceCard,
    padding: spacing.gap,
    gap: spacing.lg,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.md - 1, // 11px
    backgroundColor: colors.surfacePill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTextGroup: {
    gap: spacing.xxs,
  },
  metricValue: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLg - 2, // 22px
    letterSpacing: -0.66,
    color: colors.textPrimary,
  },
  metricLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
});
