import React, { useCallback } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Activity,
  ArrowUpRight,
  ChevronRight,
  FileText,
  Globe,
  Lock,
  Trash,
} from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ProfileMoreGroupProps {
  onOpenActivityLog: () => void;
  onOpenClearCache: () => void;
}

export const ProfileMoreGroup = React.memo(function ProfileMoreGroup({
  onOpenActivityLog,
  onOpenClearCache,
}: ProfileMoreGroupProps): React.ReactElement {
  const handleOpenWebsite = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com');
  }, []);

  const handleOpenTerms = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com/terms');
  }, []);

  const handleOpenPrivacy = useCallback(() => {
    void Linking.openURL('https://www.elitefutbot.com/privacy');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>More</Text>

      <View style={styles.groupCard}>
        {/* Row 1: Activity log */}
        <Pressable
          onPress={onOpenActivityLog}
          accessibilityRole="button"
          accessibilityLabel="Activity log"
          style={styles.row}
        >
          <View style={styles.iconTile}>
            <Activity size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Activity log</Text>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.divider} />

        {/* Row 2: Clear cache and session */}
        <Pressable
          onPress={onOpenClearCache}
          accessibilityRole="button"
          accessibilityLabel="Clear cache and session"
          style={styles.row}
        >
          <View style={styles.iconTile}>
            <Trash size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Clear cache and session</Text>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.divider} />

        {/* Row 3: EliteFutBot website */}
        <Pressable
          onPress={handleOpenWebsite}
          accessibilityRole="link"
          accessibilityLabel="EliteFutBot website"
          style={styles.row}
        >
          <View style={styles.iconTile}>
            <Globe size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>EliteFutBot website</Text>
          <ArrowUpRight size={18} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.divider} />

        {/* Row 4: Terms of Service */}
        <Pressable
          onPress={handleOpenTerms}
          accessibilityRole="link"
          accessibilityLabel="Terms of Service"
          style={styles.row}
        >
          <View style={styles.iconTile}>
            <FileText size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Terms of Service</Text>
          <ArrowUpRight size={18} color={colors.textSecondary} />
        </Pressable>

        <View style={styles.divider} />

        {/* Row 5: Privacy Policy */}
        <Pressable
          onPress={handleOpenPrivacy}
          accessibilityRole="link"
          accessibilityLabel="Privacy Policy"
          style={styles.row}
        >
          <View style={styles.iconTile}>
            <Lock size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Privacy Policy</Text>
          <ArrowUpRight size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  groupCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.listGroup,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gap,
    paddingVertical: spacing.sm,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radii.iconTile,
    backgroundColor: colors.surfaceIconTile,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginLeft: 56,
  },
});
