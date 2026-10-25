import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, radii } from '@/src/theme/tokens';

export interface ToggleProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 26;
const KNOB_SIZE = 20;
const TRACK_PADDING = 3;
const TRAVEL_DISTANCE = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2;

export const Toggle = React.memo(function Toggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel = 'Toggle switch',
}: ToggleProps): React.ReactElement {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 18,
      stiffness: 250,
    });
  }, [value, progress]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      onValueChange(!value);
    }
  }, [disabled, onValueChange, value]);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#2A2A2A', colors.accent]
    );
    return {
      backgroundColor,
    };
  });

  const animatedKnobStyle = useAnimatedStyle(() => {
    const translateX = progress.value * TRAVEL_DISTANCE;
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.textMuted, colors.textInverse]
    );
    return {
      transform: [{ translateX }],
      backgroundColor,
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.pressable, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track, animatedTrackStyle]}>
        <Animated.View style={[styles.knob, animatedKnobStyle]} />
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: {
    width: 52,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radii.md + 1,
    padding: TRACK_PADDING,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: radii.sm + 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
