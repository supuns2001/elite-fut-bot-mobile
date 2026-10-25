import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radii, spacing } from '@/src/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CardVariant = 'default' | 'elevated' | 'accent' | 'subtle';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  children: React.ReactNode;
}

export const Card = React.memo(function Card({
  variant = 'default',
  padding = 'md',
  onPress,
  children,
  style,
  ...rest
}: CardProps): React.ReactElement {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    'worklet';
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    'worklet';
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const cardStyle = [
    styles.base,
    variant === 'default' && styles.defaultVariant,
    variant === 'elevated' && styles.elevatedVariant,
    variant === 'accent' && styles.accentVariant,
    variant === 'subtle' && styles.subtleVariant,
    padding === 'none' && styles.paddingNone,
    padding === 'sm' && styles.paddingSm,
    padding === 'md' && styles.paddingMd,
    padding === 'lg' && styles.paddingLg,
    style,
  ];

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[cardStyle, animatedStyle]}
        accessibilityRole="button"
      >
        {children}
      </AnimatedPressable>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.cardLg,
    overflow: 'hidden',
  },
  defaultVariant: {
    backgroundColor: colors.surfaceCard,
  },
  elevatedVariant: {
    backgroundColor: colors.surfaceTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.cardXl,
  },
  accentVariant: {
    backgroundColor: colors.accent,
    borderRadius: radii.cardXl,
  },
  subtleVariant: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  paddingNone: {
    padding: spacing.none,
  },
  paddingSm: {
    padding: spacing.xl,
  },
  paddingMd: {
    padding: spacing.gap,
  },
  paddingLg: {
    padding: spacing.section,
  },
});
