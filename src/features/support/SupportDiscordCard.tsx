import React, { useCallback } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowUpRight, DiscordIcon } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

const DISCORD_INVITE_URL = 'https://discord.gg/Rkb9nF6WG6';

export const SupportDiscordCard = React.memo(function SupportDiscordCard(): React.ReactElement {
  const handleOpenDiscord = useCallback(() => {
    void Linking.openURL(DISCORD_INVITE_URL);
  }, []);

  return (
    <View style={styles.card}>
      {/* Oversized Discord watermark (160px, white, opacity 0.08) at top-right */}
      <View style={styles.watermark}>
        <DiscordIcon size={160} color="#FFFFFF" />
      </View>

      {/* Info Row: 52px #5865F2 tile, title 18 Bold, subtext 13 #B8BBDD */}
      <View style={styles.contentRow}>
        <View style={styles.iconTile}>
          <DiscordIcon size={28} color="#FFFFFF" />
        </View>
        <View style={styles.textColumn}>
          <Text style={styles.title}>Contact us on Discord</Text>
          <Text style={styles.subtext}>
            The fastest way to get help from our team.
          </Text>
        </View>
      </View>

      {/* Full-width pill button (bg #4F5BD5, height 56) */}
      <Pressable
        onPress={handleOpenDiscord}
        accessibilityRole="button"
        accessibilityLabel="Open Discord"
        style={({ pressed }) => [
          styles.pillButton,
          pressed && styles.pillButtonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Open Discord</Text>
        <View style={styles.circleArrow}>
          <ArrowUpRight size={20} color={colors.discordButton} strokeWidth={2.4} />
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.discordCard,
    borderRadius: radii.cardXl,
    padding: spacing.xxxl,
    gap: spacing.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(88, 101, 242, 0.25)',
  },
  watermark: {
    position: 'absolute',
    top: -24,
    right: -24,
    opacity: 0.08,
    pointerEvents: 'none',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconTile: {
    width: 52,
    height: 52,
    borderRadius: radii.input,
    backgroundColor: colors.discordTile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xxs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: -0.4,
    color: '#FFFFFF',
  },
  subtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.discordSubtext,
    lineHeight: 18,
  },
  pillButton: {
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.discordButton,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacing.screenPadding,
    paddingRight: spacing.sm,
  },
  pillButtonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: '#FFFFFF',
  },
  circleArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
