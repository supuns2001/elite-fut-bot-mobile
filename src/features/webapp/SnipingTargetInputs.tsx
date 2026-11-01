import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Toggle } from '@/src/components/Toggle';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface PlayerInfo {
  name: string;
  rating?: number;
  maskedDefId?: number | null;
}

export interface SnipingTargetInputsProps {
  playerInfo?: PlayerInfo | null;
  maxPrice: string;
  onMaxPriceChange: (text: string) => void;
  needPrice: boolean;
  autoList: boolean;
  onAutoListChange: (value: boolean) => void;
  isRunning: boolean;
  loops: number;
  statusText?: string;
  futbinPrice?: number | null;
  isLoadingPrice?: boolean;
  player?: string;
  onPlayerChange?: (text: string) => void;
}

export const SnipingTargetInputs = React.memo(function SnipingTargetInputs({
  playerInfo,
  maxPrice,
  onMaxPriceChange,
  needPrice,
  autoList,
  onAutoListChange,
  isRunning,
  loops,
  statusText,
  futbinPrice,
  isLoadingPrice,
  player,
  onPlayerChange,
}: SnipingTargetInputsProps): React.ReactElement {
  const priceBoxStyle = [styles.priceContainer, needPrice ? styles.priceError : null];
  const statusDotStyle = [styles.statusDot, isRunning ? styles.dotLime : styles.dotGray];

  const activePlayer = playerInfo || (player ? { name: player } : null);

  const autoListSubtitle = isLoadingPrice
    ? 'Checking FUTBIN lowest BIN…'
    : futbinPrice
    ? `FUTBIN: ${futbinPrice.toLocaleString()} coins (Lists at ~${Math.round(futbinPrice * 1.05 + 250).toLocaleString()})`
    : 'At FUTBIN + 5%';

  return (
    <>
      {/* Target Player Card */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.fieldLabel}>Target player</Text>
          {activePlayer?.name ? (
            <Text style={styles.liveBadge}>✓ Transfer Market</Text>
          ) : null}
        </View>

        {activePlayer?.name ? (
          <View style={styles.playerCardActive}>
            <View style={styles.playerRatingBadge}>
              <Text style={styles.playerRatingText}>{activePlayer.rating || '★'}</Text>
            </View>
            <View style={styles.playerMeta}>
              <Text style={styles.playerNameText}>{activePlayer.name}</Text>
              <Text style={styles.playerHintText}>Captured from Transfer Market search</Text>
            </View>
          </View>
        ) : (
          <View style={styles.playerCardEmpty}>
            <Text style={styles.playerEmptyTitle}>No player selected</Text>
            <Text style={styles.playerEmptySubtext}>
              Search a player in the EA Transfer Market, then press Start.
            </Text>
          </View>
        )}
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
          <Text style={styles.toggleSubtitle}>{autoListSubtitle}</Text>
        </View>
        <Toggle value={autoList} onValueChange={onAutoListChange} />
      </View>

      {/* Status Row */}
      <View style={styles.statusRow}>
        <View style={statusDotStyle} />
        <Text style={styles.statusText}>
          {isRunning
            ? statusText || `Searching market · loop ${loops}`
            : statusText || 'Idle'}
        </Text>
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: spacing.xxl,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  fieldLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  liveBadge: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.accent,
  },
  playerCardActive: {
    backgroundColor: '#161616',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 153, 0.35)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playerRatingBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerRatingText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
  playerMeta: {
    flex: 1,
    gap: 2,
  },
  playerNameText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  playerHintText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  playerCardEmpty: {
    backgroundColor: '#141414',
    borderRadius: radii.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2C2C2C',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  playerEmptyTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: '#D4D4D4',
  },
  playerEmptySubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 18,
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
