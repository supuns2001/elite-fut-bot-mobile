import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/src/theme/tokens';

export interface ToggleProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const KNOB_SIZE = 24;
const TRACK_PADDING = 3;
const TRAVEL_DISTANCE = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2; // 20px

export const Toggle = React.memo(function Toggle({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel = 'Toggle switch',
}: ToggleProps): React.ReactElement {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: 150,
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
      [colors.surfaceTrack, colors.accent]
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
      [colors.textMuted, colors.background]
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
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={[styles.track, animatedTrackStyle]}>
        <Animated.View style={[styles.knob, animatedKnobStyle]} />
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressable: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: 15,
    padding: TRACK_PADDING,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});
