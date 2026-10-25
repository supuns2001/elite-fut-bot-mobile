import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button } from '@/src/components/Button';
import { Check } from '@/src/components/icons';
import {
  colors,
  fonts,
  fontSizes,
  radii,
  spacing,
} from '@/src/theme/tokens';

export interface RegisterSuccessSheetProps {
  firstName: string;
  email: string;
  onConfirm: () => void;
  onDismiss?: () => void;
}

export const RegisterSuccessSheet = forwardRef<BottomSheetModal, RegisterSuccessSheetProps>(
  function RegisterSuccessSheet(
    { firstName, email, onConfirm, onDismiss },
    ref
  ): React.ReactElement {
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

    const displayName = firstName.trim() || 'there';
    const displayEmail = email.trim() || 'your email';

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        onDismiss={onDismiss}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.checkIconBox}>
            <Check size={22} color={colors.textInverse} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>You&apos;re in, {displayName}</Text>
          <Text style={styles.description}>
            Your free 24h trial is active. We sent a confirmation to {displayEmail}.
          </Text>

          <View style={styles.buttonWrapper}>
            <Button
              title="Let's go"
              variant="primary"
              onPress={onConfirm}
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
  checkIconBox: {
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
