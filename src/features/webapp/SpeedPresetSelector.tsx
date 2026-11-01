import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export type SpeedPresetKey = 'safe' | 'caution' | 'risky';

export interface SpeedPresetConfig {
  key: SpeedPresetKey;
  label: string;
  rpm: string;
  helpText: string;
}

export const SPEED_PRESETS: SpeedPresetConfig[] = [
  {
    key: 'safe',
    label: 'Safe',
    rpm: '3 rpm',
    helpText: '3 searches a minute. Recommended for daily use.',
  },
  {
    key: 'caution',
    label: 'Caution',
    rpm: '6 rpm',
    helpText: '6 searches a minute. Take a break every 15 min.',
  },
  {
    key: 'risky',
    label: 'Risky',
    rpm: '9 rpm',
    helpText: '9 searches a minute. Short sessions only.',
  },
];

export interface SpeedPresetSelectorProps {
  selectedPreset: SpeedPresetKey;
  onSelectPreset: (key: SpeedPresetKey) => void;
}

export const SpeedPresetSelector = React.memo(function SpeedPresetSelector({
  selectedPreset,
  onSelectPreset,
}: SpeedPresetSelectorProps): React.ReactElement {
  const activePreset =
    SPEED_PRESETS.find((p) => p.key === selectedPreset) ?? SPEED_PRESETS[0];

  return (
    <View style={styles.container}>
      <Text style={styles.fieldLabel}>Speed</Text>
      <View style={styles.presetsRow}>
        {SPEED_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.key;
          const dotColorStyle =
            preset.key === 'safe'
              ? styles.dotLime
              : preset.key === 'caution'
              ? styles.dotAmber
              : styles.dotRed;

          return (
            <Pressable
              key={preset.key}
              onPress={() => onSelectPreset(preset.key)}
              accessibilityRole="button"
              accessibilityLabel={`${preset.label} preset`}
              style={[
                styles.presetButton,
                isSelected ? styles.presetButtonActive : styles.presetButtonInactive,
              ]}
            >
              <View style={styles.presetLabelRow}>
                <View style={[styles.presetDot, dotColorStyle]} />
                <Text
                  style={[
                    styles.presetLabel,
                    isSelected ? styles.presetLabelActive : styles.presetLabelInactive,
                  ]}
                >
                  {preset.label}
                </Text>
              </View>
              <Text style={styles.presetRpm}>{preset.rpm}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.presetHelpText}>{activePreset.helpText}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  fieldLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  presetButton: {
    flex: 1,
    height: 60,
    borderRadius: radii.md,
    padding: spacing.md,
    justifyContent: 'center',
    borderWidth: 1,
  },
  presetButtonActive: {
    backgroundColor: '#1E1E1E',
    borderColor: colors.borderFocus,
  },
  presetButtonInactive: {
    backgroundColor: '#161616',
    borderColor: '#222222',
  },
  presetLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  presetDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
  },
  dotLime: {
    backgroundColor: colors.accent,
  },
  dotAmber: {
    backgroundColor: colors.warning,
  },
  dotRed: {
    backgroundColor: colors.error,
  },
  presetLabel: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.sm,
  },
  presetLabelActive: {
    color: colors.textPrimary,
  },
  presetLabelInactive: {
    color: '#AAAAAA',
  },
  presetRpm: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#777777',
    paddingLeft: 12,
  },
  presetHelpText: {
    marginTop: spacing.md,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#777777',
  },
});
