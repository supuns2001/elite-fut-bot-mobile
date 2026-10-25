import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowRight } from '@/src/components/icons';
import {
  colors,
  fonts,
  fontSizes,
  radii,
  spacing,
} from '@/src/theme/tokens';

export interface SplashProgressProps {
  onContinue: () => void;
  onReady?: () => void;
}

const BAR_WIDTH = 120;

export const SplashProgress = React.memo(function SplashProgress({
  onContinue,
  onReady,
}: SplashProgressProps): React.ReactElement {
  const [stage, setStage] = useState('Checking license…');
  const [isReady, setIsReady] = useState(false);

  const progressPercent = useSharedValue(0);
  const readyOpacity = useSharedValue(0);

  useEffect(() => {
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct = Math.min(100, currentPct + 4);
      progressPercent.value = withTiming(currentPct, { duration: 90 });

      if (currentPct < 40) {
        setStage('Checking license…');
      } else if (currentPct < 80) {
        setStage('Syncing settings…');
      } else {
        setStage('Almost ready…');
      }

      if (currentPct >= 100) {
        clearInterval(interval);
        setIsReady(true);
        readyOpacity.value = withTiming(1, { duration: 400 });
        if (onReady) {
          onReady();
        }
      }
    }, 90);

    return () => {
      clearInterval(interval);
    };
  }, [onReady, progressPercent, readyOpacity]);

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: (progressPercent.value / 100) * BAR_WIDTH,
  }));

  const animatedReadyStyle = useAnimatedStyle(() => ({
    opacity: readyOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {!isReady ? (
        <View style={styles.loadingGroup}>
          <View style={styles.track}>
            <Animated.View style={[styles.fill, animatedFillStyle]} />
          </View>
          <Text style={styles.stageText}>{stage}</Text>
        </View>
      ) : (
        <Animated.View style={[styles.readyWrapper, animatedReadyStyle]}>
          <Pressable
            onPress={onContinue}
            accessibilityRole="button"
            accessibilityLabel="Tap to continue"
            style={styles.continuePill}
          >
            <Text style={styles.continueText}>Tap to continue</Text>
            <ArrowRight size={16} color={colors.accent} strokeWidth={2} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing.screenPadding,
  },
  loadingGroup: {
    alignItems: 'center',
    gap: spacing.xxl,
  },
  track: {
    width: BAR_WIDTH,
    height: 4,
    borderRadius: radii.xs / 2,
    backgroundColor: '#1F1F1F',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.xs / 2,
    backgroundColor: colors.accent,
  },
  stageText: {
    fontFamily: fonts.monoRegular,
    fontSize: fontSizes.xs - 1,
    color: colors.textMuted,
  },
  readyWrapper: {
    alignItems: 'center',
  },
  continuePill: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xxxl,
    borderRadius: radii.avatar,
    backgroundColor: colors.surfaceSecondary,
  },
  continueText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
});
