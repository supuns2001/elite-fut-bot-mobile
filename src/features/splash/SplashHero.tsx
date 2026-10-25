import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { colors, fonts, fontSizes, spacing } from '@/src/theme/tokens';

export const SplashHero = React.memo(function SplashHero(): React.ReactElement {
  const popScale = useSharedValue(0.7);
  const popOpacity = useSharedValue(0);

  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.5);

  const textTranslateY = useSharedValue(10);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo Pop animation: scale 0.7 -> 1.04 -> 1.0, opacity 0 -> 1
    popOpacity.value = withTiming(1, { duration: 400 });
    popScale.value = withSequence(
      withTiming(1.04, {
        duration: 420,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      }),
      withTiming(1.0, {
        duration: 280,
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      })
    );

    // Ring pulse animation (repeats infinitely)
    ringScale.value = withDelay(
      600,
      withRepeat(
        withTiming(1.9, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );
    ringOpacity.value = withDelay(
      600,
      withRepeat(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      )
    );

    // Text slide up and fade in
    textTranslateY.value = withDelay(
      350,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) })
    );
    textOpacity.value = withDelay(
      350,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) })
    );
  }, [popOpacity, popScale, ringOpacity, ringScale, textOpacity, textTranslateY]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: popOpacity.value,
    transform: [{ scale: popScale.value }],
  }));

  const animatedRingStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.logoAnchor}>
        <Animated.View style={[styles.pulseRing, animatedRingStyle]} />
        <Animated.View style={[styles.logoSquircle, animatedLogoStyle]}>
          <Image
            source={require('@/assets/logo.png')}
            style={styles.logoImage}
            contentFit="contain"
            tintColor="#000000"
            priority="high"
          />
        </Animated.View>
      </View>

      <Animated.View style={[styles.textGroup, animatedTextStyle]}>
        <Text style={styles.title}>EliteFutBot</Text>
        <Text style={styles.tagline}>FUT sniping, on autopilot</Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.section + spacing.sm, // 28px
  },
  logoAnchor: {
    width: 104,
    height: 104,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  logoSquircle: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 34,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 56,
    height: 56,
  },
  textGroup: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.displaySm,
    color: colors.textPrimary,
    letterSpacing: -1.05,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
});
