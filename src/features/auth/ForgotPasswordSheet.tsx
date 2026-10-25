import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button } from '@/src/components/Button';
import { Mail } from '@/src/components/icons';
import {
  colors,
  fonts,
  fontSizes,
  radii,
  spacing,
} from '@/src/theme/tokens';

export interface ForgotPasswordSheetProps {
  email: string;
  onClose: () => void;
}

export const ForgotPasswordSheet = forwardRef<BottomSheetModal, ForgotPasswordSheetProps>(
  function ForgotPasswordSheet({ email, onClose }, ref): React.ReactElement {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      []
    );

    const displayEmail = email.trim() || 'your email';

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        onDismiss={onClose}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.mailIconBox}>
            <Mail size={22} color={colors.textInverse} strokeWidth={2} />
          </View>

          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.description}>
            If an account exists for {displayEmail}, we&apos;ve sent a link to reset your
            password.
          </Text>

          <View style={styles.buttonWrapper}>
            <Button
              title="Got it"
              variant="secondary"
              onPress={onClose}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radii.cardXl,
  },
  handleIndicator: {
    backgroundColor: '#333333',
    width: 36,
  },
  sheetContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.jumbo,
    gap: spacing.md,
  },
  mailIconBox: {
    width: 48,
    height: 48,
    borderRadius: radii.xl,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleLg - 2, // 22px
    color: colors.textPrimary,
    letterSpacing: -0.44,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  buttonWrapper: {
    marginTop: spacing.sm,
  },
});
