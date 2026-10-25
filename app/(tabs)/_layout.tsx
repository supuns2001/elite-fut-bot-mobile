import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { TabBar, type TabKey } from '@/src/components/TabBar';
import { colors } from '@/src/theme/tokens';

const TAB_ORDER: Record<TabKey, number> = {
  home: 0,
  webapp: 1,
  support: 2,
  profile: 3,
};

export default function TabsLayout(): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const [animation, setAnimation] = useState<'slide_from_right' | 'slide_from_left'>('slide_from_right');

  const activeTab = useMemo<TabKey>(() => {
    if (pathname.includes('/webapp')) return 'webapp';
    if (pathname.includes('/support')) return 'support';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  }, [pathname]);

  const handleTabPress = useCallback(
    (tab: TabKey) => {
      if (tab === activeTab) return;
      const currentIndex = TAB_ORDER[activeTab];
      const targetIndex = TAB_ORDER[tab];

      setAnimation(targetIndex > currentIndex ? 'slide_from_right' : 'slide_from_left');

      if (tab === 'home') {
        router.navigate('/(tabs)/home');
      } else if (tab === 'webapp') {
        router.navigate('/(tabs)/webapp');
      } else if (tab === 'support') {
        router.navigate('/(tabs)/support');
      } else if (tab === 'profile') {
        router.navigate('/(tabs)/profile');
      }
    },
    [activeTab, router]
  );

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screenContent,
          animation,
          animationDuration: 240,
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="webapp" />
        <Stack.Screen name="support" />
        <Stack.Screen name="profile" />
      </Stack>

      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    backgroundColor: colors.background,
  },
});
