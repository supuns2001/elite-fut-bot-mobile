import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, fontSizes, radii } from '@/src/theme/tokens';

export interface SnipingStopwatchButtonProps {
  isRunning: boolean;
  elapsedSeconds?: number;
  onToggle: () => void;
}

export const SnipingStopwatchButton = React.memo(function SnipingStopwatchButton({
  isRunning,
  elapsedSeconds,
  onToggle,
}: SnipingStopwatchButtonProps): React.ReactElement {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && elapsedSeconds === undefined) {
      setSeconds(0);
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning) {
      setSeconds(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, elapsedSeconds]);

  const displaySecs = elapsedSeconds !== undefined ? elapsedSeconds : seconds;
  const mm = String(Math.floor(displaySecs / 60)).padStart(2, '0');
  const ss = String(displaySecs % 60).padStart(2, '0');
  const buttonText = isRunning ? `Stop · ${mm}:${ss}` : 'Start sniping';

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={buttonText}
      style={[styles.button, isRunning ? styles.runningButton : styles.idleButton]}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleButton: {
    backgroundColor: colors.accent,
  },
  runningButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: colors.textInverse,
    fontVariant: ['tabular-nums'],
  },
});
