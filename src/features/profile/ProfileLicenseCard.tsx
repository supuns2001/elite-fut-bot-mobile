import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ProfileLicenseCardProps {
  statusText: string;
  role: string;
}

export const ProfileLicenseCard = React.memo(function ProfileLicenseCard({
  statusText,
  role,
}: ProfileLicenseCardProps): React.ReactElement {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>License & Access</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoKey}>License Status</Text>
        <View style={styles.statusPill}>
          <ShieldCheck size={14} color={colors.accent} />
          <Text style={styles.statusPillText}>{statusText}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoKey}>Account Role</Text>
        <Text style={styles.infoVal}>{role.toUpperCase()}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.card,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    gap: spacing.xxs,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.body,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoKey: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  infoVal: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusPillText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
});
