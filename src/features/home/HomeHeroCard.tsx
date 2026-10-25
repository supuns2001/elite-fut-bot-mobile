import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Shield } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface HomeHeroCardProps {
  onOpenWebApp: () => void;
}

export const HomeHeroCard = React.memo(function HomeHeroCard({
  onOpenWebApp,
}: HomeHeroCardProps): React.ReactElement {
  return (
    <View style={styles.card}>
      <View style={styles.badgesRow}>
        <View style={styles.botReadyBadge}>
          <View style={styles.limeDot} />
          <Text style={styles.botReadyText}>Bot ready</Text>
        </View>

        <View style={styles.safeModeBadge}>
          <Shield size={13} color={colors.textAccentDark} strokeWidth={2.2} />
          <Text style={styles.safeModeText}>Safe mode</Text>
        </View>
      </View>

      <Text style={styles.title}>Ready to snipe?</Text>
      <Text style={styles.subtitle}>Open the EA Web App and start your session.</Text>

      <Pressable
        onPress={onOpenWebApp}
        accessibilityRole="button"
        accessibilityLabel="Open EA Web App"
        style={styles.openButton}
      >
        <Text style={styles.buttonText}>Open EA Web App</Text>
        <View style={styles.iconCircle}>
          <ArrowRight size={18} color={colors.textInverse} strokeWidth={2.2} />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.cardXl,
    backgroundColor: colors.accent,
    padding: spacing.section,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  botReadyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 28,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
  },
  limeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  botReadyText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.accent,
  },
  safeModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    height: 28,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceAccentSubtleAlt,
  },
  safeModeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: colors.textAccentDark,
  },
  title: {
    marginTop: spacing.section,
    fontFamily: fonts.bold,
    fontSize: fontSizes.displayLg,
    lineHeight: 38,
    letterSpacing: -1.44,
    color: colors.textInverse,
  },
  subtitle: {
    marginTop: spacing.md,
    marginBottom: spacing.section,
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    lineHeight: 21,
    color: colors.textAccentDarker,
  },
  openButton: {
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.section,
    paddingRight: spacing.md,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
