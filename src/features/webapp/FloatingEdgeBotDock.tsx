import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { preferencesService } from '@/src/services/preferencesService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface FloatingEdgeBotDockProps {
  bottomInset: number;
  isRunning: boolean;
  isListing: boolean;
  onListAll: () => void;
  onOpenControls: () => void;
}

const TAB_WIDTH = 34;
const TAB_HEIGHT = 44;
// When collapsed, the buttons container is hidden off-screen to the right
// and only the edge tab (TAB_WIDTH) peeks out from the right edge.

export const FloatingEdgeBotDock = React.memo(function FloatingEdgeBotDock({
  bottomInset,
  isRunning,
  isListing,
  onListAll,
  onOpenControls,
}: FloatingEdgeBotDockProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  // Reanimated shared values
  const expandProgress = useSharedValue(0); // 0 = collapsed, 1 = expanded
  const pulseOpacity = useSharedValue(1);

  // Pulse animation when bot is running
  useEffect(() => {
    if (isRunning) {
      pulseOpacity.value = withRepeat(
        withTiming(0.3, { duration: 750 }),
        -1,
        true
      );
    } else {
      pulseOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [isRunning, pulseOpacity]);

  const toggleExpand = useCallback(
    (targetState?: boolean) => {
      const next = targetState !== undefined ? targetState : !isExpanded;
      setIsExpanded(next);
      expandProgress.value = withSpring(next ? 1 : 0, {
        damping: 18,
        stiffness: 180,
        mass: 0.8,
      });

      try {
        if (preferencesService.getPreferencesSync().haptics) {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      } catch {
        // Safe fallback if device haptics not available
      }
    },
    [isExpanded, expandProgress]
  );

  // PanResponder to capture swipe left (expand) and swipe right (collapse)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 12 && Math.abs(gestureState.dy) < 30;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -20) {
          // Swiped left -> Expand
          toggleExpand(true);
        } else if (gestureState.dx > 20) {
          // Swiped right -> Collapse
          toggleExpand(false);
        }
      },
    })
  ).current;

  // Animated styles for sliding buttons container
  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: expandProgress.value,
      transform: [
        {
          translateX: (1 - expandProgress.value) * 60,
        },
        {
          scale: 0.85 + expandProgress.value * 0.15,
        },
      ],
    };
  });

  const pulseDotAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  const containerPositionStyle = {
    bottom: Math.max(bottomInset, spacing.md) + 72,
  };

  return (
    <View
      style={[styles.wrapper, containerPositionStyle]}
      pointerEvents="box-none"
      {...panResponder.panHandlers}
    >
      {/* Expanded Action Buttons (Slides in / out) */}
      {isExpanded ? (
        <Animated.View
          style={[styles.buttonsRow, buttonsAnimatedStyle]}
          pointerEvents="auto"
        >
          {/* List All Button */}
          <Pressable
            onPress={onListAll}
            disabled={isListing}
            accessibilityRole="button"
            accessibilityLabel="List all cards"
            style={styles.listAllButton}
          >
            <Text style={styles.listAllText}>
              {isListing ? 'Listing…' : 'List all'}
            </Text>
          </Pressable>

          {/* Controls Button */}
          <Pressable
            onPress={onOpenControls}
            accessibilityRole="button"
            accessibilityLabel="Open sniping controls"
            style={styles.controlsButton}
          >
            <Image
              source={require('@/assets/logo.png')}
              style={styles.controlsLogo}
              contentFit="contain"
            />
            <Text style={styles.controlsText}>Controls</Text>
          </Pressable>
        </Animated.View>
      ) : null}

      {/* Edge Handle / Drawer Tab (Matching the sketch) */}
      <Pressable
        onPress={() => toggleExpand()}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Collapse bot controls' : 'Expand bot controls'}
        hitSlop={{ top: 12, bottom: 12, left: 16, right: 0 }}
        style={[styles.edgeTab, isRunning ? styles.edgeTabRunning : null]}
      >
        {/* Pulsing indicator if bot is active */}
        {isRunning ? (
          <Animated.View style={[styles.runningIndicator, pulseDotAnimatedStyle]} />
        ) : null}

        {/* Chevron Icon (< when collapsed, > when expanded) */}
        <Text style={styles.chevronText}>{isExpanded ? '›' : '‹'}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    elevation: 25,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.xs,
  },
  listAllButton: {
    height: 44,
    paddingHorizontal: spacing.md + 2,
    borderRadius: radii.avatar,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  listAllText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  controlsButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.avatar,
    backgroundColor: colors.accent,
    elevation: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  controlsLogo: {
    width: 22,
    height: 22,
  },
  controlsText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: '#000000',
    letterSpacing: 0.2,
  },
  edgeTab: {
    width: TAB_WIDTH,
    height: TAB_HEIGHT,
    backgroundColor: colors.accent,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 27,
    shadowColor: '#000000',
    shadowOffset: { width: -2, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  edgeTabRunning: {
    backgroundColor: '#CBFF00',
    borderColor: '#052e16',
  },
  runningIndicator: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#004D25',
  },
  chevronText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: '#000000',
    lineHeight: 24,
    marginLeft: -2,
  },
});

