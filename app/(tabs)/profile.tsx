import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LogOut } from '@/src/components/icons';
import { authService, UserSession } from '@/src/services/authService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import { ProfileAccountCard } from '@/src/features/profile/ProfileAccountCard';
import { ProfilePreferencesGroup } from '@/src/features/profile/ProfilePreferencesGroup';
import { ProfileMoreGroup } from '@/src/features/profile/ProfileMoreGroup';
import { ProfileClearCacheSheet } from '@/src/features/profile/ProfileClearCacheSheet';
import { ActivityLogSheet } from '@/src/features/webapp/ActivityLogSheet';

export default function ProfileTabRoute(): React.ReactElement {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [session, setSession] = useState<UserSession | null>(() =>
    authService.getCurrentSession()
  );
  const [showToast, setShowToast] = useState(false);

  const clearCacheSheetRef = useRef<BottomSheetModal>(null);
  const activityLogSheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    void authService.getProfile().then((res) => {
      if (res) setSession(res);
    });
  }, []);

  const handleRefreshSubscription = useCallback(async () => {
    const refreshed = await authService.getProfile();
    if (refreshed) setSession(refreshed);
  }, []);

  const handleOpenActivityLog = useCallback(() => {
    activityLogSheetRef.current?.present();
  }, []);

  const handleOpenClearCache = useCallback(() => {
    clearCacheSheetRef.current?.present();
  }, []);

  const handleConfirmClearCache = useCallback(() => {
    clearCacheSheetRef.current?.dismiss();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2200);
  }, []);

  const handleCancelClearCache = useCallback(() => {
    clearCacheSheetRef.current?.dismiss();
  }, []);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await authService.signOut();
          router.replace('/intro');
        },
      },
    ]);
  }, [router]);

  const containerInset = useMemo(
    () => ({
      paddingTop: Math.max(insets.top, spacing.md),
      paddingBottom: Math.max(insets.bottom, spacing.md) + 80,
    }),
    [insets.top, insets.bottom]
  );

  return (
    <View style={[styles.container, containerInset]}>
      {/* Toast Alert: "✓ Cache and session cleared" */}
      {showToast ? (
        <View style={[styles.toastContainer, { top: insets.top + spacing.xs }]}>
          <Text style={styles.toastText}>✓ Cache and session cleared</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title 34 Bold with letterSpacing -1.2 */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* 1. Account Card */}
        <ProfileAccountCard
          session={session}
          onRefreshSubscription={handleRefreshSubscription}
        />

        {/* 2. Preferences Group */}
        <ProfilePreferencesGroup />

        {/* 3. More Group */}
        <ProfileMoreGroup
          onOpenActivityLog={handleOpenActivityLog}
          onOpenClearCache={handleOpenClearCache}
        />

        {/* 4. Sign Out Pill Button (height 56, transparent, 1px #2E2E2E border) */}
        <Pressable
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.signOutButtonPressed,
          ]}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        {/* 5. Version text: Geist Mono 11, muted, centered */}
        <Text style={styles.versionText}>EliteFutBot v1.0.0 (build 57)</Text>
      </ScrollView>

      {/* Clear Cache Confirmation BottomSheet */}
      <ProfileClearCacheSheet
        ref={clearCacheSheetRef}
        onConfirm={handleConfirmClearCache}
        onCancel={handleCancelClearCache}
      />

      {/* Activity Log Sheet */}
      <ActivityLogSheet
        ref={activityLogSheetRef}
        isLive={false}
        onClose={() => activityLogSheetRef.current?.dismiss()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toastContainer: {
    position: 'absolute',
    left: spacing.gap,
    right: spacing.gap,
    zIndex: 9999,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.accent,
  },
  scrollContent: {
    paddingHorizontal: spacing.gap,
    gap: spacing.xxl, // 14px gap between sections
    paddingTop: spacing.xs,
  },
  header: {
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.displayMd,
    letterSpacing: -1.2,
    color: colors.textPrimary,
  },
  signOutButton: {
    height: 56,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: '#2E2E2E',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  signOutButtonPressed: {
    backgroundColor: 'rgba(255, 138, 128, 0.08)',
  },
  signOutText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: colors.danger,
  },
  versionText: {
    fontFamily: fonts.monoRegular,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxs,
    marginBottom: spacing.md,
  },
});
