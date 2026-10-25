import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  StepSessionCard,
  StepProfitCard,
  StepProtectionCard,
} from '@/src/features/intro/IntroStepCards';

export interface IntroCardStackProps {
  activeStep: number;
  onStepChange: (newStep: number) => void;
}

interface CardLayerProps {
  index: number;
  stepProgress: SharedValue<number>;
  children: React.ReactNode;
}

const CardLayer = React.memo(function CardLayer({
  index,
  stepProgress,
  children,
}: CardLayerProps): React.ReactElement {
  const animatedStyle = useAnimatedStyle(() => {
    const diff = index - stepProgress.value;

    const translateX = interpolate(
      diff,
      [-1, 0, 1, 2],
      [-380, 0, 10, -14],
      Extrapolation.EXTEND
    );

    const translateY = interpolate(
      diff,
      [-1, 0, 1, 2],
      [0, 0, 4, 10],
      Extrapolation.CLAMP
    );

    const rotate = interpolate(
      diff,
      [-1, 0, 1, 2],
      [-14, 0, 4, -7],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      diff,
      [-1, 0, 1, 2],
      [1, 1, 0.96, 0.92],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      diff,
      [-1, -0.6, 0, 2, 2.2],
      [0, 0.7, 1, 1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {children}
    </Animated.View>
  );
});

const decorativeLayerAStyle = {
  transform: [{ rotate: '-7deg' }, { translateX: -14 }, { translateY: 10 }, { scale: 0.92 }],
};

const decorativeLayerBStyle = {
  transform: [{ rotate: '4deg' }, { translateX: 10 }, { translateY: 4 }, { scale: 0.96 }],
};

export const IntroCardStack = React.memo(function IntroCardStack({
  activeStep,
  onStepChange,
}: IntroCardStackProps): React.ReactElement {
  const stepProgress = useSharedValue(activeStep);
  const isInteracting = useSharedValue(false);
  const startProgress = useSharedValue(activeStep);

  // Sync external step changes (e.g. Next button or pagination dots)
  useEffect(() => {
    if (!isInteracting.value && Math.abs(stepProgress.value - activeStep) > 0.01) {
      stepProgress.value = withTiming(activeStep, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [activeStep, isInteracting, stepProgress]);

  const handleStepCommit = useCallback(
    (target: number) => {
      if (target !== activeStep) {
        onStepChange(target);
      }
    },
    [activeStep, onStepChange]
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onStart(() => {
      'worklet';
      isInteracting.value = true;
      startProgress.value = stepProgress.value;
    })
    .onUpdate((event) => {
      'worklet';
      const dragDelta = -event.translationX / 240;
      let next = startProgress.value + dragDelta;
      if (next < 0) {
        next = next * 0.15;
      } else if (next > 2) {
        next = 2 + (next - 2) * 0.15;
      }
      stepProgress.value = next;
    })
    .onEnd((event) => {
      'worklet';
      isInteracting.value = false;

      // Restrict each swipe gesture to advance at most +/- 1 card from start
      const baseStep = Math.round(startProgress.value);
      let target = baseStep;

      const threshold = 50;
      const velocity = event.velocityX;

      if (event.translationX < -threshold || velocity < -300) {
        target = Math.min(2, baseStep + 1);
      } else if (event.translationX > threshold || velocity > 300) {
        target = Math.max(0, baseStep - 1);
      }

      stepProgress.value = withSpring(
        target,
        { damping: 20, stiffness: 220, mass: 0.8 },
        (finished) => {
          if (finished) {
            runOnJS(handleStepCommit)(target);
          }
        }
      );
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>
        {/* Layer A (bottom-most decorative shell) */}
        <View style={[styles.backCardA, decorativeLayerAStyle]} />

        {/* Layer B (middle decorative shell) */}
        <View style={[styles.backCardB, decorativeLayerBStyle]} />

        {/* Persistent Deck: Card 2 rendered first (lowest) */}
        <CardLayer index={2} stepProgress={stepProgress}>
          <StepProtectionCard />
        </CardLayer>

        {/* Persistent Deck: Card 1 rendered next */}
        <CardLayer index={1} stepProgress={stepProgress}>
          <StepProfitCard />
        </CardLayer>

        {/* Persistent Deck: Card 0 rendered last (highest / front) */}
        <CardLayer index={0} stepProgress={stepProgress}>
          <StepSessionCard />
        </CardLayer>
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 310,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: 280,
    height: 310,
    borderRadius: 28,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
    padding: 22,
  },
  backCardA: {
    position: 'absolute',
    width: 270,
    height: 300,
    borderRadius: 28,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#1C1C1C',
  },
  backCardB: {
    position: 'absolute',
    width: 280,
    height: 310,
    borderRadius: 28,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
});
