import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Button } from '@/src/components/Button';
import { colors, fonts, fontSizes, spacing } from '@/src/theme/tokens';

export default function ProfileTabRoute(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSignOut = useCallback(() => {
    router.replace('/sign-in');
  }, [router]);

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
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>E</Text>
        </View>

        <Text style={styles.username}>Epic_Sniper281</Text>
        <Text style={styles.planStatus}>Pro · Mobile License Active</Text>

        <View style={styles.buttonWrapper}>
          <Button
            title="Sign out"
            variant="secondary"
            onPress={handleSignOut}
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLg,
    color: colors.accent,
  },
  username: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLg,
    color: colors.textPrimary,
  },
  planStatus: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
