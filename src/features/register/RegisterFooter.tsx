import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '@/src/theme/tokens';

export interface RegisterFooterProps {
  onTermsPress: () => void;
  onPrivacyPress: () => void;
  onSignInPress: () => void;
}

export const RegisterFooter = React.memo(function RegisterFooter({
  onTermsPress,
  onPrivacyPress,
  onSignInPress,
}: RegisterFooterProps): React.ReactElement {
  return (
    <>
      <Text style={styles.termsText}>
        By creating an account you agree to our{' '}
        <Text onPress={onTermsPress} style={styles.termsLink}>
          Terms
        </Text>{' '}
        and{' '}
        <Text onPress={onPrivacyPress} style={styles.termsLink}>
          Privacy Policy
        </Text>
        .
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text onPress={onSignInPress} style={styles.signInLink}>
            Sign in
          </Text>
        </Text>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  termsText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    lineHeight: 18,
    color: colors.textMuted,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.textSecondary,
  },
  footerRow: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
  signInLink: {
    fontFamily: fonts.medium,
    color: colors.accent,
  },
});
