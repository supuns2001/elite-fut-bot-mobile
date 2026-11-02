import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export type SnipingMode = 'single' | 'filter';

interface ControlsModeTabsProps {
  mode: SnipingMode;
  onSelectMode: (mode: SnipingMode) => void;
  isRunning?: boolean;
}

export const ControlsModeTabs = React.memo(function ControlsModeTabs({
  mode,
  onSelectMode,
  isRunning = false,
}: ControlsModeTabsProps): React.ReactElement {
  return (
    <View style={styles.container}>
      {/* Single Player Tab */}
      <Pressable
        onPress={() => !isRunning && onSelectMode('single')}
        disabled={isRunning}
        accessibilityRole="tab"
        accessibilityState={{ selected: mode === 'single' }}
        style={[
          styles.tab,
          mode === 'single' ? styles.tabActive : styles.tabInactive,
        ]}
      >
        <Text
          style={[
            styles.tabTitle,
            mode === 'single' ? styles.tabTitleActive : styles.tabTitleInactive,
          ]}
        >
          SINGLE PLAYER
        </Text>
        <Text
          style={[
            styles.tabSub,
            mode === 'single' ? styles.tabSubActive : styles.tabSubInactive,
          ]}
          numberOfLines={1}
        >
          Snipe one chosen card
        </Text>
      </Pressable>

      {/* Filter Snipe Tab */}
      <Pressable
        onPress={() => !isRunning && onSelectMode('filter')}
        disabled={isRunning}
        accessibilityRole="tab"
        accessibilityState={{ selected: mode === 'filter' }}
        style={[
          styles.tab,
          mode === 'filter' ? styles.tabActive : styles.tabInactive,
        ]}
      >
        <Text
          style={[
            styles.tabTitle,
            mode === 'filter' ? styles.tabTitleActive : styles.tabTitleInactive,
          ]}
        >
          FILTER SNIPE
        </Text>
        <Text
          style={[
            styles.tabSub,
            mode === 'filter' ? styles.tabSubActive : styles.tabSubInactive,
          ]}
          numberOfLines={1}
        >
          Any card in EA filters
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  tabInactive: {
    backgroundColor: '#161616',
    borderColor: '#262626',
  },
  tabTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tabTitleActive: {
    color: '#0A0A0A',
  },
  tabTitleInactive: {
    color: '#8E8E93',
  },
  tabSub: {
    fontFamily: fonts.regular,
    fontSize: 10,
  },
  tabSubActive: {
    color: '#1C1C1E',
  },
  tabSubInactive: {
    color: '#555555',
  },
});

