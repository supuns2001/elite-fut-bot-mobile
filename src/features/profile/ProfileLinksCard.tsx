import React, { useCallback } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowUpRight } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export const ProfileLinksCard = React.memo(function ProfileLinksCard(): React.ReactElement {
  const handleOpenDiscord = useCallback(() => {
    void Linking.openURL('https://discord.gg/Rkb9nF6WG6');
  }, []);

  const handleOpenTerms = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com/terms');
  }, []);

  const handleOpenPrivacy = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com/privacy');
  }, []);

  return (
    <View style={styles.card}>
      <Pressable onPress={handleOpenDiscord} style={styles.linkRow}>
        <Text style={styles.linkText}>Join Discord Community</Text>
        <ArrowUpRight size={16} color={colors.accent} />
      </Pressable>
      <View style={styles.divider} />
      <Pressable onPress={handleOpenTerms} style={styles.linkRow}>
        <Text style={styles.linkText}>Terms of Service</Text>
        <ArrowUpRight size={16} color={colors.textSecondary} />
      </Pressable>
      <View style={styles.divider} />
      <Pressable onPress={handleOpenPrivacy} style={styles.linkRow}>
        <Text style={styles.linkText}>Privacy Policy</Text>
        <ArrowUpRight size={16} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
