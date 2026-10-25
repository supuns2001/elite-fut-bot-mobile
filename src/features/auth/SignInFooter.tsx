import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/src/components/Button';
import { colors, fonts, fontSizes, spacing } from '@/src/theme/tokens';

export interface SignInFooterProps {
  onRegisterPress: () => void;
  onDiscordPress: () => void;
}

export const SignInFooter = React.memo(function SignInFooter({
  onRegisterPress,
  onDiscordPress,
}: SignInFooterProps): React.ReactElement {
  return (
    <>
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>New to EliteFutBot?</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button
        title="Start free 24h trial"
        variant="secondary"
        onPress={onRegisterPress}
      />

      <View style={styles.footerGroup}>
        <Pressable
          onPress={onDiscordPress}
          accessibilityRole="link"
          accessibilityLabel="Chat on Discord"
        >
          <Text style={styles.supportLink}>
            Need help? <Text style={styles.supportHighlight}>Chat on Discord</Text>
          </Text>
        </Pressable>

        <Text style={styles.legalDisclaimer}>
          Terms · Privacy · Not affiliated with Electronic Arts Inc.
        </Text>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginVertical: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  footerGroup: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: spacing.xs,
    paddingTop: spacing.gap,
    paddingBottom: spacing.sm,
  },
  supportLink: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  supportHighlight: {
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  legalDisclaimer: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs - 1,
    lineHeight: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
