import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { ArrowUpRight } from '@/src/components/icons';
import { fonts } from '@/src/theme/tokens';
import { IntroHeader } from '@/src/features/intro/IntroHeader';
import { IntroCardStack } from '@/src/features/intro/IntroCardStack';
import { IntroPagination } from '@/src/features/intro/IntroPagination';

const STEPS = [
  {
    title: 'Snipe smarter. Earn on autopilot.',
    body: 'The bot works the transfer market for you while you get on with your day.',
  },
  {
    title: 'Buys low. Sells at market.',
    body: 'Every card it wins is listed at live FUTBIN or FUT.GG prices, EA tax covered.',
  },
  {
    title: 'Your account, protected.',
    body: 'Safe speeds and human-like pauses are on by default. Your EA login stays with EA.',
  },
];

export function IntroScreen(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeStep, setActiveStep] = useState(0);
  const [displayedStep, setDisplayedStep] = useState(0);

  const textTranslateY = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const prevStepRef = useRef(activeStep);

  useEffect(() => {
    if (prevStepRef.current !== activeStep) {
      prevStepRef.current = activeStep;

      // out translateY 0 -> -8 with fade, 160ms
      textTranslateY.value = withTiming(-8, { duration: 160 });
      textOpacity.value = withTiming(0, { duration: 160 });

      // update displayed text at 100ms
      const timeout = setTimeout(() => {
        setDisplayedStep(activeStep);
      }, 100);

      // In translateY 8 -> 0 with fade, 220ms, starting 100ms in
      textTranslateY.value = withDelay(
        100,
        withTiming(0, { duration: 220, easing: Easing.out(Easing.ease) })
      );
      textOpacity.value = withDelay(
        100,
        withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) })
      );

      return () => clearTimeout(timeout);
    }
  }, [activeStep, textOpacity, textTranslateY]);

  const handleNext = useCallback(() => {
    setActiveStep((prev) => Math.min(prev + 1, 2));
  }, []);

  const handleStepChange = useCallback((stepIndex: number) => {
    setActiveStep(stepIndex);
  }, []);

  const handleSignIn = useCallback(() => {
    router.push('/sign-in');
  }, [router]);

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const statusBarPadding = React.useMemo(
    () => ({ height: Math.max(insets.top, 47) }),
    [insets.top]
  );

  return (
    <View style={styles.container}>
      <View style={statusBarPadding} />

      <IntroHeader />

      <View style={styles.cardStackSection}>
        <IntroCardStack
          activeStep={activeStep}
          onStepChange={handleStepChange}
        />
      </View>

      <View style={styles.textAndControlsBlock}>
        <Animated.View style={[styles.textGroup, animatedTextStyle]}>
          <Text style={styles.title}>{STEPS[displayedStep].title}</Text>
          <Text style={styles.body}>{STEPS[displayedStep].body}</Text>
        </Animated.View>

        <IntroPagination
          activeStep={activeStep}
          totalSteps={STEPS.length}
          onStepPress={handleStepChange}
          onNextPress={handleNext}
        />

        <View style={styles.ctaGroup}>
          <Pressable
            onPress={handleSignIn}
            style={styles.signInCta}
            accessibilityRole="button"
            accessibilityLabel="Sign In"
          >
            <Text style={styles.signInCtaText}>Sign In</Text>
            <View style={styles.arrowCircle}>
              <ArrowUpRight size={18} color="#CBF21D" strokeWidth={2} />
            </View>
          </Pressable>

          <Text style={styles.disclaimer}>
            Results vary. Not affiliated with Electronic Arts Inc.
          </Text>
        </View>
      </View>

      <View style={styles.homeIndicatorArea}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  cardStackSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textAndControlsBlock: {
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 4,
    gap: 20,
  },
  textGroup: {
    gap: 10,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -1.19, // -0.035em
    color: '#FAFAFA',
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: '#A1A1A1',
  },
  ctaGroup: {
    gap: 0,
  },
  signInCta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#CBF21D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 8,
  },
  signInCtaText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#0A0A0A',
    textAlign: 'center',
  },
  arrowCircle: {
    position: 'absolute',
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disclaimer: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#808080',
    textAlign: 'center',
    marginTop: 4,
  },
  homeIndicatorArea: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FAFAFA',
  },
});
