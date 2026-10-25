import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface PaywallHeaderProps {
  onSignOutPress: () => void;
}

export const PaywallHeader = React.memo(function PaywallHeader({
  onSignOutPress,
}: PaywallHeaderProps): React.ReactElement {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          source={require('@/assets/logo.png')}
          style={styles.logo}
          contentFit="contain"
          priority="high"
        />
        <Text style={styles.brandTitle}>EliteFutBot</Text>
      </View>

      <Pressable
        onPress={onSignOutPress}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        style={styles.signOutButton}
      >
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.screenPadding,
    paddingRight: spacing.gap,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    width: 24,
    height: 24,
  },
  brandTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
    letterSpacing: -0.16,
  },
  signOutButton: {
    height: 36,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.input,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
});
