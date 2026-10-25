import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Shield, Smartphone, SyncIcon, Tag } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export const PaywallFeatureGrid = React.memo(function PaywallFeatureGrid(): React.ReactElement {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        {/* Card 1: Featured Lime */}
        <View style={[styles.card, styles.featuredCard]}>
          <Smartphone size={22} color={colors.textInverse} strokeWidth={1.9} />
          <View style={styles.textGroup}>
            <Text style={styles.featuredTitle}>Snipe on the go</Text>
            <Text style={styles.featuredDesc}>The engine runs on your phone</Text>
          </View>
        </View>

        {/* Card 2: Auto-listing */}
        <View style={[styles.card, styles.darkCard]}>
          <Tag size={22} color={colors.accent} strokeWidth={1.9} />
          <View style={styles.textGroup}>
            <Text style={styles.darkTitle}>Auto-listing</Text>
            <Text style={styles.darkDesc}>At FUTBIN / FUT.GG prices</Text>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        {/* Card 3: Safety */}
        <View style={[styles.card, styles.darkCard]}>
          <Shield size={22} color={colors.accent} strokeWidth={1.9} />
          <View style={styles.textGroup}>
            <Text style={styles.darkTitle}>Safety built in</Text>
            <Text style={styles.darkDesc}>Limits and sleep breaks</Text>
          </View>
        </View>

        {/* Card 4: Sync */}
        <View style={[styles.card, styles.darkCard]}>
          <SyncIcon size={22} color={colors.accent} strokeWidth={1.9} />
          <View style={styles.textGroup}>
            <Text style={styles.darkTitle}>Always in sync</Text>
            <Text style={styles.darkDesc}>With your web dashboard</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  gridContainer: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: radii.card,
    padding: spacing.gap,
    gap: spacing.xxl,
    justifyContent: 'space-between',
    minHeight: 116,
  },
  featuredCard: {
    backgroundColor: colors.accent,
  },
  darkCard: {
    backgroundColor: colors.surfaceCard,
  },
  textGroup: {
    gap: spacing.xxs,
  },
  featuredTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
    color: colors.textInverse,
  },
  featuredDesc: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    lineHeight: 17,
    color: colors.textAccentDark,
  },
  darkTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  darkDesc: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    lineHeight: 17,
    color: colors.textSecondary,
  },
});
