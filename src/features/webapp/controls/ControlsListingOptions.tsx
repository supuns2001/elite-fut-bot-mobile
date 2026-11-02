import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Toggle } from '@/src/components/Toggle';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export type ListingStrategy = 'fixed' | 'target_profit' | 'futbin_console' | 'futbin_pc';

export interface ControlsListingOptionsProps {
  actLikeHuman: boolean;
  onActLikeHumanChange: (val: boolean) => void;
  humanPlus: boolean;
  onHumanPlusChange: (val: boolean) => void;
  listAutomatically: boolean;
  onListAutomaticallyChange: (val: boolean) => void;
  strategy: ListingStrategy;
  onStrategyChange: (strategy: ListingStrategy) => void;
  fixedPrice: string;
  onFixedPriceChange: (price: string) => void;
  targetProfit: string;
  onTargetProfitChange: (profit: string) => void;
}

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

const CustomCheckbox = React.memo(function CustomCheckbox({
  checked,
  onPress,
}: CustomCheckboxProps): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
      style={[styles.checkboxBase, checked ? styles.checkboxChecked : styles.checkboxUnchecked]}
    >
      {checked ? <View style={styles.checkboxInner} /> : null}
    </Pressable>
  );
});

export const ControlsListingOptions = React.memo(function ControlsListingOptions({
  actLikeHuman,
  onActLikeHumanChange,
  humanPlus,
  onHumanPlusChange,
  listAutomatically,
  onListAutomaticallyChange,
  strategy,
  onStrategyChange,
  fixedPrice,
  onFixedPriceChange,
  targetProfit,
  onTargetProfitChange,
}: ControlsListingOptionsProps): React.ReactElement {
  // EA 5% Tax Calculation Preview
  const fixedTaxPreview = useMemo(() => {
    const numeric = parseInt(fixedPrice, 10);
    if (isNaN(numeric) || numeric <= 0) return null;

    const net = Math.floor(numeric * 0.95);
    const start = numeric > 1000 ? numeric - 100 : Math.max(150, numeric - 50);

    return {
      start: start.toLocaleString(),
      buyNow: numeric.toLocaleString(),
      net: net.toLocaleString(),
    };
  }, [fixedPrice]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>LISTING OPTIONS</Text>

      {/* Act like a Human Row */}
      <View style={styles.optionRow}>
        <Pressable
          onPress={() => onActLikeHumanChange(!actLikeHuman)}
          style={styles.labelGroup}
        >
          <CustomCheckbox
            checked={actLikeHuman}
            onPress={() => onActLikeHumanChange(!actLikeHuman)}
          />
          <Text style={[styles.optionLabel, actLikeHuman ? styles.labelActive : null]}>
            Act like a Human (beta)
          </Text>
        </Pressable>

        <View style={styles.humanPlusGroup}>
          <Text style={[styles.humanPlusLabel, !actLikeHuman ? styles.disabledText : null]}>
            Human++
          </Text>
          <Toggle
            value={humanPlus}
            onValueChange={onHumanPlusChange}
            disabled={!actLikeHuman}
          />
        </View>
      </View>

      {/* List Automatically Master Option */}
      <View style={styles.optionRow}>
        <Pressable
          onPress={() => onListAutomaticallyChange(!listAutomatically)}
          style={styles.labelGroup}
        >
          <CustomCheckbox
            checked={listAutomatically}
            onPress={() => onListAutomaticallyChange(!listAutomatically)}
          />
          <Text style={[styles.optionLabel, listAutomatically ? styles.labelActive : null]}>
            List automatically
          </Text>
        </Pressable>
      </View>

      {/* Sub-options when List Automatically is enabled */}
      {listAutomatically ? (
        <View style={styles.subOptionsContainer}>
          {/* 1. List for Fixed Price */}
          <View style={styles.subOptionBlock}>
            <View style={styles.subOptionRow}>
              <Pressable
                onPress={() => onStrategyChange('fixed')}
                style={styles.labelGroup}
              >
                <CustomCheckbox
                  checked={strategy === 'fixed'}
                  onPress={() => onStrategyChange('fixed')}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    strategy === 'fixed' ? styles.labelActive : null,
                  ]}
                >
                  List for fixed price
                </Text>
              </Pressable>

              {strategy === 'fixed' ? (
                <View style={styles.inlineInputBox}>
                  <Text style={styles.coinSymbol}>©</Text>
                  <TextInput
                    value={fixedPrice}
                    onChangeText={(t) => onFixedPriceChange(t.replace(/[^0-9]/g, ''))}
                    placeholder="1000"
                    placeholderTextColor={colors.textPlaceholder}
                    keyboardType="numeric"
                    style={styles.inlineInput}
                  />
                  <Text style={styles.infoIcon}>ⓘ</Text>
                </View>
              ) : (
                <Text style={styles.infoIcon}>ⓘ</Text>
              )}
            </View>

            {strategy === 'fixed' && fixedTaxPreview ? (
              <Text style={styles.taxHelperText}>
                Every card: Start {fixedTaxPreview.start} / Buy Now {fixedTaxPreview.buyNow} ({fixedTaxPreview.net} after 5% EA tax)
              </Text>
            ) : null}
          </View>

          {/* 2. List for Target Profit */}
          <View style={styles.subOptionBlock}>
            <View style={styles.subOptionRow}>
              <Pressable
                onPress={() => onStrategyChange('target_profit')}
                style={styles.labelGroup}
              >
                <CustomCheckbox
                  checked={strategy === 'target_profit'}
                  onPress={() => onStrategyChange('target_profit')}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    strategy === 'target_profit' ? styles.labelActive : null,
                  ]}
                >
                  List for target profit
                </Text>
              </Pressable>

              {strategy === 'target_profit' ? (
                <View style={styles.inlineInputBox}>
                  <Text style={styles.coinSymbol}>©</Text>
                  <TextInput
                    value={targetProfit}
                    onChangeText={(t) => onTargetProfitChange(t.replace(/[^0-9]/g, ''))}
                    placeholder="250"
                    placeholderTextColor={colors.textPlaceholder}
                    keyboardType="numeric"
                    style={styles.inlineInput}
                  />
                  <Text style={styles.infoIcon}>ⓘ</Text>
                </View>
              ) : (
                <Text style={styles.infoIcon}>ⓘ</Text>
              )}
            </View>

            {strategy === 'target_profit' ? (
              <Text style={styles.taxHelperText}>
                Adds target profit + 5% EA tax buffer on top of snipe purchase price.
              </Text>
            ) : null}
          </View>

          {/* 3. List FUTBIN Price (PS/Xbox) */}
          <View style={styles.subOptionBlock}>
            <View style={styles.subOptionRow}>
              <Pressable
                onPress={() => onStrategyChange('futbin_console')}
                style={styles.labelGroup}
              >
                <CustomCheckbox
                  checked={strategy === 'futbin_console'}
                  onPress={() => onStrategyChange('futbin_console')}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    strategy === 'futbin_console' ? styles.labelActive : null,
                  ]}
                >
                  List FUTBIN Price (PS/Xbox)
                </Text>
              </Pressable>
              <Text style={styles.infoIcon}>ⓘ</Text>
            </View>
          </View>

          {/* 4. List FUTBIN Price (PC) */}
          <View style={styles.subOptionBlock}>
            <View style={styles.subOptionRow}>
              <Pressable
                onPress={() => onStrategyChange('futbin_pc')}
                style={styles.labelGroup}
              >
                <CustomCheckbox
                  checked={strategy === 'futbin_pc'}
                  onPress={() => onStrategyChange('futbin_pc')}
                />
                <Text
                  style={[
                    styles.optionLabel,
                    strategy === 'futbin_pc' ? styles.labelActive : null,
                  ]}
                >
                  List FUTBIN Price (PC)
                </Text>
              </Pressable>
              <Text style={styles.infoIcon}>ⓘ</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.xs,
    color: '#888888',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  humanPlusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  humanPlusLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: '#888888',
  },
  disabledText: {
    color: '#444444',
  },
  checkboxBase: {
    width: 20,
    height: 20,
    borderRadius: radii.xs,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxUnchecked: {
    borderColor: '#444444',
    backgroundColor: '#161616',
  },
  checkboxChecked: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  checkboxInner: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#000000',
  },
  optionLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: '#CCCCCC',
  },
  labelActive: {
    color: colors.accent,
    fontFamily: fonts.semiBold,
  },
  subOptionsContainer: {
    marginTop: spacing.xs,
    paddingLeft: spacing.lg,
    borderLeftWidth: 2,
    borderLeftColor: '#262626',
    gap: spacing.sm,
  },
  subOptionBlock: {
    paddingVertical: spacing.xs,
  },
  subOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inlineInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    height: 32,
    gap: spacing.xs,
  },
  coinSymbol: {
    fontFamily: fonts.monoBold,
    fontSize: fontSizes.xs,
    color: colors.accent,
  },
  inlineInput: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.sm,
    color: '#FFFFFF',
    minWidth: 50,
    paddingVertical: 0,
    paddingHorizontal: 2,
  },
  infoIcon: {
    fontSize: 14,
    color: '#666666',
    marginLeft: spacing.xs,
  },
  taxHelperText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs - 1,
    color: '#777777',
    marginTop: 4,
    marginLeft: 32,
    lineHeight: 16,
  },
});

