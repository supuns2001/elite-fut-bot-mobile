import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Toggle } from '@/src/components/Toggle';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface SnipingTargetInputsProps {
  player: string;
  onPlayerChange: (text: string) => void;
  maxPrice: string;
  onMaxPriceChange: (text: string) => void;
  needPrice: boolean;
  autoList: boolean;
  onAutoListChange: (value: boolean) => void;
  isRunning: boolean;
  loops: number;
}

export const SnipingTargetInputs = React.memo(function SnipingTargetInputs({
  player,
  onPlayerChange,
  maxPrice,
  onMaxPriceChange,
  needPrice,
  autoList,
  onAutoListChange,
  isRunning,
  loops,
}: SnipingTargetInputsProps): React.ReactElement {
  const priceBoxStyle = [styles.priceContainer, needPrice ? styles.priceError : null];
  const statusDotStyle = [styles.statusDot, isRunning ? styles.dotLime : styles.dotGray];

  return (
    <>
      {/* Player Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.fieldLabel}>Player</Text>
        <TextInput
          value={player}
          onChangeText={onPlayerChange}
          placeholder="Name or quality"
          placeholderTextColor={colors.textPlaceholder}
          style={styles.textInput}
        />
      </View>

      {/* Max buy now input */}
      <View style={styles.inputGroup}>
        <Text style={styles.fieldLabel}>Max buy now</Text>
        <View style={priceBoxStyle}>
          <TextInput
            value={maxPrice}
            onChangeText={onMaxPriceChange}
            placeholder="15000"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="numeric"
            style={styles.numericInput}
          />
          <Text style={styles.unitText}>coins</Text>
        </View>
        {needPrice ? (
          <Text style={styles.priceWarningText}>Enter a max price first.</Text>
        ) : null}
      </View>

      {/* Auto-list row */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleTextGroup}>
          <Text style={styles.toggleTitle}>Auto-list won cards</Text>
          <Text style={styles.toggleSubtitle}>At FUTBIN + 5%</Text>
        </View>
        <Toggle value={autoList} onValueChange={onAutoListChange} />
      </View>

      {/* Status Row */}
      <View style={styles.statusRow}>
        <View style={statusDotStyle} />
        <Text style={styles.statusText}>
          {isRunning ? `Searching market · loop ${loops}` : 'Idle'}
        </Text>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  inputGroup: {
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
  textInput: {
    height: 48,
    borderRadius: radii.md,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222222',
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  priceContainer: {
    height: 48,
    borderRadius: radii.md,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#222222',
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceError: {
    borderColor: colors.error,
  },
  numericInput: {
    flex: 1,
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    padding: spacing.none,
  },
  unitText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: '#666666',
  },
  priceWarningText: {
    marginTop: spacing.xs,
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.error,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.xxl,
  },
  toggleTextGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#777777',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  dotLime: {
    backgroundColor: colors.accent,
  },
  dotGray: {
    backgroundColor: '#555555',
  },
  statusText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: '#888888',
  },
});
