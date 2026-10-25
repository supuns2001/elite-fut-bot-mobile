import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MarketCard } from '@/src/services/botService';
import { fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface MarketCardItemProps {
  card: MarketCard;
}

export const MarketCardItem = React.memo(function MarketCardItem({
  card,
}: MarketCardItemProps): React.ReactElement {
  return (
    <View style={styles.card}>
      <View style={styles.goldBadge}>
        <Text style={styles.ratingText}>{card.rating}</Text>
        <Text style={styles.positionText}>{card.position}</Text>
      </View>

      <View style={styles.infoCol}>
        <Text style={styles.nameText}>{card.name}</Text>
        <Text style={styles.metaText}>
          {card.rarity} · {card.timeLeft} left
        </Text>
      </View>

      <Text style={styles.priceText}>{card.price}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    height: 56,
    borderRadius: radii.md - 2, // 10px
    backgroundColor: '#161C24',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingLeft: spacing.md,
    paddingRight: spacing.xxl,
    marginVertical: spacing.xxs + 1, // 3px
  },
  goldBadge: {
    width: 36,
    height: 42,
    borderRadius: radii.sm - 2, // 6px
    backgroundColor: '#B8973E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.base,
    lineHeight: 14,
    color: '#1A1405',
  },
  positionText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.xs - 3, // 9px
    color: '#1A1405',
  },
  infoCol: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xxs,
  },
  nameText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: '#DCE3EC',
  },
  metaText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#8B97A6',
  },
  priceText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: '#DCE3EC',
  },
});
