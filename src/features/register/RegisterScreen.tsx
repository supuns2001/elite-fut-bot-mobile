import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@/src/components/Button';
import { authService } from '@/src/services/authService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import { RegisterHeader } from '@/src/features/register/RegisterHeader';
import { RegisterNameFields } from '@/src/features/register/RegisterNameFields';
import { RegisterAccountInputs } from '@/src/features/register/RegisterAccountInputs';
import { RegisterFooter } from '@/src/features/register/RegisterFooter';
import { RegisterSuccessSheet } from '@/src/features/register/RegisterSuccessSheet';

interface BadFields {
  first?: boolean;
  last?: boolean;
  email?: boolean;
  password?: boolean;
}

export function RegisterScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const successSheetRef = useRef<BottomSheetModal>(null);

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [badFields, setBadFields] = useState<BadFields>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = useCallback(() => router.replace('/intro'), [router]);
  const handleSignInPress = useCallback(() => router.push('/sign-in'), [router]);

  const handleTermsPress = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com/terms');
  }, []);

  const handlePrivacyPress = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com/privacy');
  }, []);

  const handleSuccessConfirm = useCallback(() => {
    successSheetRef.current?.dismiss();
    router.replace('/(tabs)/home');
  }, [router]);

  const handleFirstChange = useCallback((t: string) => {
    setFirst(t);
    setBadFields((b) => ({ ...b, first: false }));
    setErrorMessage(null);
  }, []);

  const handleLastChange = useCallback((t: string) => {
    setLast(t);
    setBadFields((b) => ({ ...b, last: false }));
    setErrorMessage(null);
  }, []);

  const handleEmailChange = useCallback((t: string) => {
    setEmail(t);
    setBadFields((b) => ({ ...b, email: false }));
    setErrorMessage(null);
  }, []);

  const handlePasswordChange = useCallback((t: string) => {
    setPassword(t);
    setBadFields((b) => ({ ...b, password: false }));
    setErrorMessage(null);
  }, []);

  const handleReferralChange = useCallback((text: string) => {
    setReferral(text.toUpperCase().replace(/\s/g, ''));
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const bad: BadFields = {
      first: !first.trim(),
      last: !last.trim(),
      email: !/.+@.+\..+/.test(email),
      password: password.length < 8,
    };

    if (Object.values(bad).some(Boolean)) {
      setBadFields(bad);
      return;
    }

    try {
      setBadFields({});
      setErrorMessage(null);
      setIsLoading(true);
      await authService.register(first, last, email, password, referral);
      setIsLoading(false);
      successSheetRef.current?.present();
    } catch (err: unknown) {
      setIsLoading(false);
      const message =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please check your connection.';
      setErrorMessage(message);
      if (message.toLowerCase().includes('email')) {
        setBadFields({ email: true });
      }
    }
  }, [first, last, email, password, referral]);

  const hasAnyBad = Object.values(badFields).some(Boolean) || Boolean(errorMessage);
  const errorText =
    errorMessage ||
    (badFields.password && !badFields.first && !badFields.last && !badFields.email
      ? 'Password needs at least 8 characters.'
      : 'Please fill in the highlighted fields.');

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
          <RegisterHeader onBackPress={handleBack} />

          <View style={styles.sheetCard}>
            <RegisterNameFields
              first={first}
              last={last}
              badFirst={badFields.first}
              badLast={badFields.last}
              onFirstChange={handleFirstChange}
              onLastChange={handleLastChange}
            />

            <RegisterAccountInputs
              email={email}
              badEmail={badFields.email}
              onEmailChange={handleEmailChange}
              password={password}
              badPassword={badFields.password}
              onPasswordChange={handlePasswordChange}
              referral={referral}
              onReferralChange={handleReferralChange}
            />

            {hasAnyBad ? (
              <Text style={styles.errorAlert} accessibilityRole="alert">
                {errorText}
              </Text>
            ) : null}

            <View style={styles.buttonWrapper}>
              <Button
                title={isLoading ? 'Creating account…' : 'Create account'}
                variant="primary"
                loading={isLoading}
                onPress={handleSubmit}
              />
            </View>

            <RegisterFooter
              onTermsPress={handleTermsPress}
              onPrivacyPress={handlePrivacyPress}
              onSignInPress={handleSignInPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <RegisterSuccessSheet
        ref={successSheetRef}
        firstName={first}
        email={email}
        onConfirm={handleSuccessConfirm}
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
  },
  sheetCard: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.section,
    paddingBottom: spacing.gap,
    gap: spacing.lg,
  },
  errorAlert: {
    paddingHorizontal: spacing.sm,
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.error,
  },
  buttonWrapper: {
    marginTop: spacing.xs,
  },
});
