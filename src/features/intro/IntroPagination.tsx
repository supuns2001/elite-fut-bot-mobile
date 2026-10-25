import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight } from '@/src/components/icons';

export interface IntroPaginationProps {
  activeStep: number;
  totalSteps?: number;
  onStepPress: (stepIndex: number) => void;
  onNextPress: () => void;
}

interface DotItemProps {
  index: number;
  isActive: boolean;
  onPress: () => void;
}

const DotItem = React.memo(function DotItem({
  index,
  isActive,
  onPress,
}: DotItemProps): React.ReactElement {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    // Width and color animate over 250ms
    progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
  }, [isActive, progress]);

  const animatedPillStyle = useAnimatedStyle(() => {
    // Active: pill 24x6, #CBF21D. Inactive: pill 6x6, #333333
    const width = 6 + progress.value * 18;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#333333', '#CBF21D']
    );
    return {
      width,
      backgroundColor,
    };
  });

  const animatedTouchStyle = useAnimatedStyle(() => {
    // Active tap width 34, Inactive tap width 18
    const width = 18 + progress.value * 16;
    return {
      width,
    };
  });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Step ${index + 1} of 3`}
    >
      <Animated.View style={[styles.dotTouchArea, animatedTouchStyle]}>
        <Animated.View style={[styles.dotPill, animatedPillStyle]} />
      </Animated.View>
    </Pressable>
  );
});

export const IntroPagination = React.memo(function IntroPagination({
  activeStep,
  totalSteps = 3,
  onStepPress,
  onNextPress,
}: IntroPaginationProps): React.ReactElement {
  const steps = React.useMemo(
    () => Array.from({ length: totalSteps }, (_, i) => i),
    [totalSteps]
  );

  const isLast = activeStep === totalSteps - 1;
  const nextOpacity = useSharedValue(isLast ? 0 : 1);

  useEffect(() => {
    // Next button: fades out over 150ms when it hides on slide 3
    nextOpacity.value = withTiming(isLast ? 0 : 1, { duration: 150 });
  }, [isLast, nextOpacity]);

  const animatedNextStyle = useAnimatedStyle(() => ({
    opacity: nextOpacity.value,
    pointerEvents: isLast ? 'none' : 'auto',
  }));

  return (
    <View style={styles.controlRow} accessibilityRole="tablist" accessibilityLabel="Intro steps">
      <View style={styles.dotsRow}>
        {steps.map((idx) => (
          <DotItem
            key={idx}
            index={idx}
            isActive={idx === activeStep}
            onPress={() => onStepPress(idx)}
          />
        ))}
      </View>

      <Animated.View style={[styles.nextButtonWrapper, animatedNextStyle]}>
        <Pressable
          onPress={onNextPress}
          accessibilityRole="button"
          accessibilityLabel="Next"
          style={styles.nextButton}
          hitSlop={8}
        >
          <ArrowRight size={18} color="#FAFAFA" strokeWidth={2} />
        </Pressable>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  controlRow: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dotTouchArea: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPill: {
    height: 6,
    borderRadius: 3,
  },
  nextButtonWrapper: {
    width: 44,
    height: 44,
  },
  nextButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
