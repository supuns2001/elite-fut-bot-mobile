import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface HomeHeaderProps {
  username?: string;
  plan?: 'mobile' | 'trial';
  planText?: string;
}

export const HomeHeader = React.memo(function HomeHeader({
  username = 'Epic_Sniper281',
  plan = 'mobile',
  planText: customPlanText,
}: HomeHeaderProps): React.ReactElement {
  const isMobile = plan === 'mobile';
  const planText = customPlanText ?? (isMobile ? 'Pro · Mobile' : 'Trial · 18h');

  const badgeContainerStyle = [
    styles.planBadge,
    isMobile ? styles.badgeMobile : styles.badgeTrial,
  ];

  const dotStyle = [
    styles.badgeDot,
    isMobile ? styles.dotMobile : styles.dotTrial,
  ];

  const textStyle = [
    styles.badgeText,
    isMobile ? styles.textMobile : styles.textTrial,
  ];

  const avatarInitial = username.trim().charAt(0).toUpperCase() || 'E';

  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatarInitial}</Text>
      </View>

      <View style={styles.welcomeCol}>
        <Text style={styles.welcomeLabel}>Welcome back</Text>
        <Text style={styles.usernameText} numberOfLines={1}>
          {username}
        </Text>
      </View>

      <View style={badgeContainerStyle}>
        <View style={dotStyle} />
        <Text style={textStyle}>{planText}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.accent,
  },
  welcomeCol: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  welcomeLabel: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  usernameText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: -0.36,
    color: colors.textPrimary,
  },
  planBadge: {
    height: 32,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },
  badgeMobile: {
    backgroundColor: '#161C05',
  },
  badgeTrial: {
    backgroundColor: '#1F1A0C',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotMobile: {
    backgroundColor: colors.accent,
  },
  dotTrial: {
    backgroundColor: colors.warning,
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
  },
  textMobile: {
    color: colors.accent,
  },
  textTrial: {
    color: colors.warning,
  },
});
