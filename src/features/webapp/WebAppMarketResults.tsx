import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { INITIAL_MARKET_CARDS, type MarketCard } from '@/src/services/botService';
import { fonts, fontSizes, spacing } from '@/src/theme/tokens';
import { MarketCardItem } from '@/src/features/webapp/MarketCardItem';

export interface WebAppMarketResultsProps {
  topPadding: number;
  bottomPadding: number;
  isReloading: boolean;
}

export const WebAppMarketResults = React.memo(function WebAppMarketResults({
  topPadding,
  bottomPadding,
  isReloading,
}: WebAppMarketResultsProps): React.ReactElement {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(isReloading ? 0.3 : 1, {
      duration: isReloading ? 150 : 300,
    });
  }, [isReloading, opacity]);

  const renderItem: ListRenderItem<MarketCard> = useCallback(
    ({ item }) => <MarketCardItem card={item} />,
    []
  );

  const keyExtractor = useCallback((item: MarketCard) => item.id, []);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentPaddingStyle = React.useMemo(
    () => ({
      paddingTop: topPadding + 60,
      paddingBottom: bottomPadding + 80,
    }),
    [topPadding, bottomPadding]
  );

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <View style={contentPaddingStyle}>
        <View style={styles.breadcrumbHeader}>
          <Text style={styles.breadcrumbText}>
            Transfers / Search the Transfer Market
          </Text>
          <View style={styles.resultsTitleRow}>
            <Text style={styles.resultsTitle}>Search Results</Text>
            <Text style={styles.pageText}>Page 1</Text>
          </View>
        </View>

        <FlashList
          data={INITIAL_MARKET_CARDS}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.gap,
  },
  breadcrumbHeader: {
    gap: spacing.lg,
    paddingBottom: spacing.sm,
  },
  breadcrumbText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#8B97A6',
  },
  resultsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.titleSm,
    color: '#DCE3EC',
  },
  pageText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#8B97A6',
  },
});
