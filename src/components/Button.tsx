import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ArrowRight, ArrowUpRight } from '@/src/components/icons';
import {
  colors,
  fonts,
  fontSizes,
  layout,
  radii,
  spacing,
} from '@/src/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'pill-with-arrow'
  | 'dark-pill-with-arrow'
  | 'danger';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  arrowType?: 'diagonal' | 'right';
  centerText?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export const Button = React.memo(function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  accessibilityLabel,
  arrowType = 'diagonal',
  centerText = false,
  textStyle: customTextStyle,
}: ButtonProps): React.ReactElement {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    'worklet';
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isInteractive = !disabled && !loading;

  const containerStyle = [
    styles.base,
    variant === 'primary' && styles.primaryContainer,
    variant === 'secondary' && styles.secondaryContainer,
    variant === 'pill-with-arrow' && styles.pillArrowContainer,
    variant === 'dark-pill-with-arrow' && styles.darkPillArrowContainer,
    variant === 'danger' && styles.dangerContainer,
    disabled && styles.disabledContainer,
  ];

  const computedTextStyle = [
    styles.baseText,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'pill-with-arrow' && styles.pillArrowText,
    variant === 'dark-pill-with-arrow' && styles.darkPillArrowText,
    variant === 'danger' && styles.dangerText,
    disabled && styles.disabledText,
    customTextStyle,
  ];

  const renderContent = (): React.ReactElement => {
    if (loading) {
      const spinnerColor =
        variant === 'primary' || variant === 'pill-with-arrow' || variant === 'danger'
          ? colors.textInverse
          : colors.textPrimary;
      return <ActivityIndicator size="small" color={spinnerColor} />;
    }

    if (variant === 'pill-with-arrow' || variant === 'dark-pill-with-arrow') {
      const isDarkPill = variant === 'dark-pill-with-arrow';
      const isCentered = centerText;
      const arrowColor = isDarkPill ? colors.textInverse : colors.accent;
      const arrowIcon = arrowType === 'diagonal' ? (
        <ArrowUpRight size={18} color={arrowColor} />
      ) : (
        <ArrowRight size={18} color={arrowColor} />
      );

      return (
        <View style={[styles.pillArrowRow, isCentered && styles.pillArrowRowCentered]}>
          <Text style={[computedTextStyle, isCentered && styles.pillArrowTextCentered]}>
            {title}
          </Text>
          <View
            style={[
              isDarkPill ? styles.iconCircleLime : styles.iconCircleDark,
              isCentered && styles.absoluteRight,
            ]}
          >
            {arrowIcon}
          </View>
        </View>
      );
    }

    return <Text style={computedTextStyle}>{title}</Text>;
  };

  return (
    <AnimatedPressable
      onPress={isInteractive ? onPress : undefined}
      onPressIn={isInteractive ? handlePressIn : undefined}
      onPressOut={isInteractive ? handlePressOut : undefined}
      disabled={!isInteractive}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      style={[styles.wrapper, animatedStyle]}
    >
      <View style={containerStyle}>{renderContent()}</View>
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  base: {
    height: layout.buttonHeight,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  primaryContainer: { backgroundColor: colors.accent },
  secondaryContainer: {
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: '#2E2E2E',
  },
  pillArrowContainer: {
    backgroundColor: colors.accent,
    paddingLeft: spacing.section,
    paddingRight: spacing.md,
  },
  darkPillArrowContainer: {
    backgroundColor: colors.background,
    paddingLeft: spacing.section,
    paddingRight: spacing.md,
  },
  dangerContainer: { backgroundColor: colors.error },
  disabledContainer: { opacity: 0.5 },
  baseText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    letterSpacing: -0.2,
  },
  primaryText: {
    color: colors.textInverse,
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
  },
  secondaryText: {
    color: colors.textPrimary,
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
  },
  pillArrowText: {
    color: colors.textInverse,
  },
  darkPillArrowText: {
    color: colors.textPrimary,
  },
  dangerText: {
    color: colors.textInverse,
  },
  disabledText: {
    color: colors.textMuted,
  },
  pillArrowRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillArrowRowCentered: {
    justifyContent: 'center',
  },
  pillArrowTextCentered: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    paddingHorizontal: 44,
  },
  iconCircleDark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleLime: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteRight: {
    position: 'absolute',
    right: 0,
  },
});
