import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bell, Sun, Vibrate } from '@/src/components/icons';
import { Toggle } from '@/src/components/Toggle';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export const ProfilePreferencesGroup = React.memo(function ProfilePreferencesGroup(): React.ReactElement {
  const [purchaseAlerts, setPurchaseAlerts] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [keepAwake, setKeepAwake] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Preferences</Text>

      <View style={styles.groupCard}>
        {/* Row 1: Purchase alerts */}
        <View style={styles.row}>
          <View style={styles.iconTile}>
            <Bell size={20} color={colors.accent} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.title}>Purchase alerts</Text>
            <Text style={styles.subtext}>Notify me when a card is bought</Text>
          </View>
          <Toggle
            value={purchaseAlerts}
            onValueChange={setPurchaseAlerts}
            accessibilityLabel="Purchase alerts"
          />
        </View>

        <View style={styles.divider} />

        {/* Row 2: Haptics */}
        <View style={styles.row}>
          <View style={styles.iconTile}>
            <Vibrate size={20} color={colors.accent} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.title}>Haptics</Text>
            <Text style={styles.subtext}>Vibrate on rare snipes</Text>
          </View>
          <Toggle
            value={haptics}
            onValueChange={setHaptics}
            accessibilityLabel="Haptics"
          />
        </View>

        <View style={styles.divider} />

        {/* Row 3: Keep screen awake */}
        <View style={styles.row}>
          <View style={styles.iconTile}>
            <Sun size={20} color={colors.accent} />
          </View>
          <View style={styles.labelCol}>
            <Text style={styles.title}>Keep screen awake</Text>
            <Text style={styles.subtext}>While the bot is sniping</Text>
          </View>
          <Toggle
            value={keepAwake}
            onValueChange={setKeepAwake}
            accessibilityLabel="Keep screen awake"
          />
        </View>
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
    minHeight: 64,
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
  labelCol: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  subtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginLeft: 56, // Inset past icon tile
  },
});
