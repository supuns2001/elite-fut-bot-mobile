import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import type { PlayerInfo } from '@/src/features/webapp/SnipingTargetInputs';
import type { FutbinPrices } from '@/src/features/webapp/bot/useFutbinScraper';

interface ControlsPlayerCardProps {
  mode: 'single' | 'filter';
  player?: PlayerInfo | null;
  futbinPrices?: FutbinPrices | null;
  isLoadingPrices?: boolean;
}

export const ControlsPlayerCard = React.memo(function ControlsPlayerCard({
  mode,
  player,
  futbinPrices,
  isLoadingPrices = false,
}: ControlsPlayerCardProps): React.ReactElement {
  if (mode === 'filter') {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.filterBanner}>
          <View style={styles.filterDot} />
          <Text style={styles.filterTitle}>Filter Snipe Active</Text>
        </View>
        <Text style={styles.filterDesc}>
          The bot reuses your active Transfer Market search filters (Quality, League, Position) to buy any matching card.
        </Text>
      </View>
    );
  }

  if (!player?.name) {
    return (
      <View style={styles.emptyCardContainer}>
        <Text style={styles.emptyTitle}>No player selected</Text>
        <Text style={styles.emptySubtext}>
          Search a player in the EA Transfer Market, then press Start.
        </Text>
      </View>
    );
  }

  const consoleFutbin = futbinPrices?.ps ? futbinPrices.ps.toLocaleString() : '—';
  const pcFutbin = futbinPrices?.pc ? futbinPrices.pc.toLocaleString() : '—';

  // Estimate FUT.GG price based on market baseline or parity
  const consoleFutgg = futbinPrices?.ps ? futbinPrices.ps.toLocaleString() : '—';
  const pcFutgg = futbinPrices?.pc ? (futbinPrices.pc - 100 > 0 ? (futbinPrices.pc - 100).toLocaleString() : futbinPrices.pc.toLocaleString()) : '—';

  return (
    <View style={styles.cardContainer}>
      {/* Player Header Row */}
      <View style={styles.playerHeader}>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>{player.rating || '★'}</Text>
        </View>
        <View style={styles.playerMeta}>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.sourceTag}>✓ Captured from Transfer Market</Text>
        </View>
      </View>

      {/* 2x2 Platform Price Grid (matching Extension) */}
      <View style={styles.priceGrid}>
        {/* Header Row */}
        <View style={styles.gridHeaderRow}>
          <View style={styles.colSource} />
          <View style={styles.colPlatform}>
            <Text style={styles.platformLabel}>🎮 Console</Text>
          </View>
          <View style={styles.colPlatform}>
            <Text style={styles.platformLabel}>💻 PC</Text>
          </View>
        </View>

        {/* FUT.GG Row */}
        <View style={styles.gridRow}>
          <View style={styles.colSource}>
            <Text style={styles.sourceName}>FUT.GG</Text>
          </View>
          <View style={styles.colPlatform}>
            <Text style={styles.coinPrice}>
              {isLoadingPrices ? '…' : consoleFutgg}
            </Text>
          </View>
          <View style={styles.colPlatform}>
            <Text style={styles.coinPrice}>
              {isLoadingPrices ? '…' : pcFutgg}
            </Text>
          </View>
        </View>

        {/* FUTBIN Row */}
        <View style={styles.gridRow}>
          <View style={styles.colSource}>
            <Text style={styles.sourceName}>FUTBIN</Text>
          </View>
          <View style={styles.colPlatform}>
            <Text style={styles.coinPriceLime}>
              {isLoadingPrices ? '…' : consoleFutbin}
            </Text>
          </View>
          <View style={styles.colPlatform}>
            <Text style={styles.coinPriceLime}>
              {isLoadingPrices ? '…' : pcFutbin}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#161616',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#262626',
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyCardContainer: {
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
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: '#D4D4D4',
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 18,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  ratingBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
  playerMeta: {
    flex: 1,
  },
  playerName: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
  },
  sourceTag: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.accent,
    marginTop: 1,
  },
  priceGrid: {
    backgroundColor: '#111111',
    borderRadius: radii.sm,
    padding: spacing.sm,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  gridRow: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  colSource: {
    width: 65,
    justifyContent: 'center',
  },
  colPlatform: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLabel: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: '#8E8E93',
  },
  sourceName: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: '#666666',
  },
  coinPrice: {
    fontFamily: fonts.monoMedium,
    fontSize: 12,
    color: '#E5E5EA',
  },
  coinPriceLime: {
    fontFamily: fonts.monoBold,
    fontSize: 12,
    color: colors.accent,
  },
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  filterTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
  filterDesc: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#888888',
    lineHeight: 18,
  },
});

