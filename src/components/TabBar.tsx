import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HomeIcon,
  ProfileIcon,
  SupportIcon,
  WebAppIcon,
} from '@/src/components/icons';
import {
  colors,
  fonts,
  fontSizes,
  layout,
  radii,
  spacing,
} from '@/src/theme/tokens';

export type TabKey = 'home' | 'webapp' | 'support' | 'profile';

export interface TabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

interface TabItemConfig {
  key: TabKey;
  label: string;
  icon: (color: string) => React.ReactElement;
}

const TABS: TabItemConfig[] = [
  {
    key: 'home',
    label: 'Home',
    icon: (color: string) => <HomeIcon size={22} color={color} />,
  },
  {
    key: 'webapp',
    label: 'Web App',
    icon: (color: string) => <WebAppIcon size={22} color={color} />,
  },
  {
    key: 'support',
    label: 'Help',
    icon: (color: string) => <SupportIcon size={22} color={color} />,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (color: string) => <ProfileIcon size={22} color={color} />,
  },
];

export const TabBar = React.memo(function TabBar({
  activeTab,
  onTabPress,
}: TabBarProps): React.ReactElement {
  const insets = useSafeAreaInsets();

  const renderTab = useCallback(
    (tab: TabItemConfig) => {
      const isActive = activeTab === tab.key;
      const iconColor = isActive ? colors.textInverse : colors.textSubtle;

      const tabStyle = [
        styles.tabButton,
        isActive ? styles.activeTabButton : styles.inactiveTabButton,
      ];

      return (
        <Pressable
          key={tab.key}
          onPress={() => onTabPress(tab.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={tab.label}
          style={tabStyle}
        >
          {tab.icon(iconColor)}
          {isActive ? (
            <Text style={styles.activeLabel}>{tab.label}</Text>
          ) : null}
        </Pressable>
      );
    },
    [activeTab, onTabPress]
  );

  const containerBottomStyle = React.useMemo(
    () => ({ paddingBottom: Math.max(insets.bottom, spacing.md) }),
    [insets.bottom]
  );

  return (
    <View style={[styles.outerContainer, containerBottomStyle]}>
      <View style={styles.bar}>
        {TABS.map(renderTab)}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: spacing.gap,
    right: spacing.gap,
    bottom: spacing.none,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 100,
    elevation: 10,
  },
  bar: {
    width: '100%',
    maxWidth: layout.designWidth - spacing.screenPadding * 2,
    height: layout.tabBarHeight,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    borderRadius: radii.tabBar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  tabButton: {
    height: 48,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.inset,
    gap: spacing.md,
  },
  inactiveTabButton: {
    width: 48,
    backgroundColor: 'transparent',
  },
  activeLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.textInverse,
  },
});
