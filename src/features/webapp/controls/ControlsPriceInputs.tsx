import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Toggle } from '@/src/components/Toggle';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface ControlsPriceInputsProps {
  minPrice: string;
  onMinPriceChange: (val: string) => void;
  maxPrice: string;
  onMaxPriceChange: (val: string) => void;
  cardRating: string;
  onCardRatingChange: (val: string) => void;
  exactRating: boolean;
  onExactRatingChange: (val: boolean) => void;
  needPrice: boolean;
  rpmText?: string;
}

export const ControlsPriceInputs = React.memo(function ControlsPriceInputs({
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  cardRating,
  onCardRatingChange,
  exactRating,
  onExactRatingChange,
  needPrice,
  rpmText,
}: ControlsPriceInputsProps): React.ReactElement {
  return (
    <View style={styles.container}>
      {/* BUY NOW PRICE - MIN & MAX */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>BUY NOW PRICE</Text>
        <View style={styles.row}>
          {/* Min Price */}
          <View style={styles.halfCol}>
            <View style={styles.inputBox}>
              <Text style={styles.coinSymbol}>©</Text>
              <TextInput
                value={minPrice}
                onChangeText={(t) => onMinPriceChange(t.replace(/[^0-9]/g, ''))}
                placeholder="1"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="numeric"
                style={styles.numericInput}
              />
              <Text style={styles.inputUnit}>MIN</Text>
            </View>
          </View>

          {/* Max Price */}
          <View style={styles.halfCol}>
            <View style={[styles.inputBox, needPrice ? styles.inputBoxError : null]}>
              <Text style={styles.coinSymbol}>©</Text>
              <TextInput
                value={maxPrice}
                onChangeText={(t) => onMaxPriceChange(t.replace(/[^0-9]/g, ''))}
                placeholder="8000"
                placeholderTextColor={colors.textPlaceholder}
                keyboardType="numeric"
                style={styles.numericInput}
              />
              <Text style={styles.inputUnit}>MAX</Text>
            </View>
          </View>
        </View>
        {needPrice ? (
          <Text style={styles.errorText}>Enter a max price to continue.</Text>
        ) : null}
      </View>

      {/* RATING FILTER */}
      <View style={styles.section}>
        <View style={styles.ratingHeaderRow}>
          <Text style={styles.sectionHeader}>RATING FILTER</Text>
          <View style={styles.exactRatingGroup}>
            <Text style={styles.exactRatingLabel}>Exact Rating</Text>
            <Toggle value={exactRating} onValueChange={onExactRatingChange} />
          </View>
        </View>

        <View style={styles.inputBox}>
          <Text style={styles.starSymbol}>★</Text>
          <TextInput
            value={cardRating}
            onChangeText={(t) => onCardRatingChange(t.replace(/[^0-9]/g, ''))}
            placeholder="Card Rating"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="numeric"
            maxLength={2}
            style={styles.numericInput}
          />
          <Text style={styles.inputUnit}>OVR</Text>
        </View>

        {rpmText ? (
          <View style={styles.rpmRow}>
            <Text style={styles.rpmCheck}>✔</Text>
            <Text style={styles.rpmText}>{rpmText}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeader: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: '#888888',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfCol: {
    flex: 1,
  },
  inputBox: {
    height: 48,
    borderRadius: radii.md,
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#262626',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  inputBoxError: {
    borderColor: colors.error,
  },
  coinSymbol: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.base,
    color: colors.accent,
  },
  starSymbol: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.base,
    color: '#FFD700',
  },
  numericInput: {
    flex: 1,
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    padding: spacing.none,
  },
  inputUnit: {
    fontFamily: fonts.monoRegular,
    fontSize: 10,
    color: '#666666',
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: colors.error,
    marginTop: 2,
  },
  ratingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  exactRatingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exactRatingLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#A0A0A0',
  },
  rpmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  rpmCheck: {
    color: colors.accent,
    fontSize: 12,
  },
  rpmText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: '#CCCCCC',
  },
});
