import React, { useCallback } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/src/components/Button';
import { colors, fonts, fontSizes, spacing } from '@/src/theme/tokens';

export default function SupportTabRoute(): React.ReactElement {
  const insets = useSafeAreaInsets();

  const handleDiscordPress = useCallback(() => {
    void Linking.openURL('https://discord.gg/Rkb9nF6WG6');
  }, []);

  const containerInset = React.useMemo(
    () => ({
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, spacing.md) + 80,
    }),
    [insets.top, insets.bottom]
  );

  return (
    <View style={[styles.container, containerInset]}>
      <View style={styles.centerBox}>
        <Text style={styles.title}>Help &amp; Support</Text>
        <Text style={styles.subtitle}>24/7 Community and Live Bot Assistance</Text>

        <View style={styles.buttonWrapper}>
          <Button
            title="Join Discord Support"
            variant="pill-with-arrow"
            arrowType="diagonal"
            onPress={handleDiscordPress}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.screenPadding,
    gap: spacing.md,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.displayMd,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
