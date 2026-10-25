import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@/src/components/Button';
import { TextField } from '@/src/components/TextField';
import { authService } from '@/src/services/authService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import { SignInHeader } from '@/src/features/auth/SignInHeader';
import { SignInFooter } from '@/src/features/auth/SignInFooter';
import { ForgotPasswordSheet } from '@/src/features/auth/ForgotPasswordSheet';

export function SignInScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const forgotPasswordSheetRef = useRef<BottomSheetModal>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    router.replace('/intro');
  }, [router]);

  const handleOpenReset = useCallback(() => {
    forgotPasswordSheetRef.current?.present();
  }, []);

  const handleCloseReset = useCallback(() => {
    forgotPasswordSheetRef.current?.dismiss();
  }, []);

  const handleRegisterPress = useCallback(() => {
    router.push('/register');
  }, [router]);

  const handleDiscordPress = useCallback(() => {
    void Linking.openURL('https://discord.gg/Rkb9nF6WG6');
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      setHasError(false);
      setErrorMessage(null);
      setIsLoading(true);
      const session = await authService.signIn(email, password);
      setIsLoading(false);
      if (session.hasMobileAccess) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/paywall');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setHasError(true);
      const message =
        err instanceof Error
          ? err.message
          : 'Wrong email or password.';
      setErrorMessage(message);
    }
  }, [email, password, router]);

  const handleEmailChange = useCallback((text: string) => {
    setEmail(text);
    setHasError(false);
    setErrorMessage(null);
  }, []);

  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
    setHasError(false);
    setErrorMessage(null);
  }, []);

  const screenInsetsStyle = React.useMemo(
    () => ({
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, spacing.md),
    }),
    [insets.top, insets.bottom]
  );

  return (
    <View style={[styles.container, screenInsetsStyle]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <SignInHeader onBackPress={handleBack} />

          <View style={styles.sheetCard}>
            <View style={styles.inputsGroup}>
              <TextField
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={hasError}
              />

              <TextField
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="••••••••"
                isPassword
                autoCapitalize="none"
                autoComplete="password"
                error={hasError}
              />
            </View>

            <View style={styles.statusRow}>
              {hasError ? (
                <Text style={styles.errorAlert} accessibilityRole="alert">
                  {errorMessage || 'Wrong email or password.'}
                </Text>
              ) : (
                <View style={styles.spacer} />
              )}

              <Pressable
                onPress={handleOpenReset}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>

            <View style={styles.buttonWrapper}>
              <Button
                title={isLoading ? 'Signing in…' : 'Sign in'}
                variant="primary"
                loading={isLoading}
                onPress={handleLogin}
              />
            </View>

            <SignInFooter
              onRegisterPress={handleRegisterPress}
              onDiscordPress={handleDiscordPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ForgotPasswordSheet
        ref={forgotPasswordSheetRef}
        email={email}
        onClose={handleCloseReset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  sheetCard: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.screenPadding,
    paddingBottom: spacing.gap,
    gap: spacing.xl,
  },
  inputsGroup: {
    gap: spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 32,
  },
  errorAlert: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.error,
  },
  spacer: {
    flex: 1,
  },
  forgotButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  forgotText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.accent,
  },
  buttonWrapper: {
    marginTop: spacing.xxs,
  },
});
