import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface SignInHeaderProps {
  onBackPress: () => void;
}

export const SignInHeader = React.memo(function SignInHeader({
  onBackPress,
}: SignInHeaderProps): React.ReactElement {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBackPress}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.backButton}
      >
        <ChevronLeft size={18} color={colors.textPrimary} strokeWidth={2} />
      </Pressable>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to start sniping.</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.section,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  title: {
    marginTop: spacing.xxxl,
    fontFamily: fonts.bold,
    fontSize: fontSizes.displayMd,
    lineHeight: 38,
    color: colors.textPrimary,
    letterSpacing: -1.19,
  },
  subtitle: {
    marginTop: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSizes.md,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
