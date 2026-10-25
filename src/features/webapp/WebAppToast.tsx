import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface WebAppToastProps {
  visible: boolean;
  topInset: number;
  message: string;
}

export const WebAppToast = React.memo(function WebAppToast({
  visible,
  topInset,
  message,
}: WebAppToastProps): React.ReactElement | null {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: visible ? 250 : 300,
    });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const placementStyle = React.useMemo(
    () => ({ top: topInset + 62 }),
    [topInset]
  );

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, placementStyle, animatedStyle]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.none,
    right: spacing.none,
    zIndex: 25,
    alignItems: 'center',
  },
  text: {
    height: 36,
    paddingHorizontal: spacing.xxl,
    borderRadius: radii.input,
    backgroundColor: colors.textPrimary,
    color: colors.textInverse,
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    lineHeight: 36,
  },
});
