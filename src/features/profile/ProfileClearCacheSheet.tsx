import React, { forwardRef, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface ProfileClearCacheSheetProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ProfileClearCacheSheet = forwardRef<
  BottomSheetModal,
  ProfileClearCacheSheetProps
>(function ProfileClearCacheSheet({ onConfirm, onCancel }, ref): React.ReactElement {
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.65}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['40%']}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      style={styles.sheetModal}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.textGroup}>
          <Text style={styles.title}>Clear cache and session?</Text>
          <Text style={styles.body}>
            You'll need to log in to the EA Web App again. Your settings stay as
            they are.
          </Text>
        </View>

        <View style={styles.buttonsGroup}>
          <Pressable
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel="Clear now"
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearButtonText}>Clear now</Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  sheetModal: {
    marginHorizontal: 8,
  },
  sheetBackground: {
    backgroundColor: '#1A1A1A',
    borderRadius: radii.cardXl,
  },
  handleIndicator: {
    backgroundColor: '#3E3E3E',
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  textGroup: {
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  buttonsGroup: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  clearButton: {
    height: 56,
    borderRadius: radii.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonPressed: {
    backgroundColor: colors.accentPressed,
  },
  clearButtonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.textInverse,
  },
  cancelButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
});
