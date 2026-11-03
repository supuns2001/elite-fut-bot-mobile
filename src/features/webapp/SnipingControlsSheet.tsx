import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Close } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import {
  ControlsModeTabs,
  type SnipingMode,
} from '@/src/features/webapp/controls/ControlsModeTabs';
import { ControlsPlayerCard } from '@/src/features/webapp/controls/ControlsPlayerCard';
import { ControlsAdvancedModeRow } from '@/src/features/webapp/controls/ControlsAdvancedModeRow';
import { ControlsPriceInputs } from '@/src/features/webapp/controls/ControlsPriceInputs';
import {
  ControlsListingOptions,
  type ListingStrategy,
} from '@/src/features/webapp/controls/ControlsListingOptions';
import { ControlsStatsStrip } from '@/src/features/webapp/controls/ControlsStatsStrip';
import {
  SpeedPresetSelector,
  type SpeedPresetKey,
} from '@/src/features/webapp/SpeedPresetSelector';
import type { PlayerInfo } from '@/src/features/webapp/SnipingTargetInputs';
import type { FutbinPrices } from '@/src/features/webapp/bot/useFutbinScraper';
import {
  DEFAULT_SNIPER_SETTINGS,
  type SniperSettings,
} from '@/src/features/webapp/bot/useSniperBot';

export interface SnipingControlsSheetProps {
  isRunning: boolean;
  loops: number;
  elapsedSeconds?: number;
  statusText?: string;
  error?: string | null;
  player?: PlayerInfo | null;
  futbinPrices?: FutbinPrices | null;
  futbinPrice?: number | null;
  isLoadingPrice?: boolean;
  cardsBought?: number;
  profitMade?: number;
  onStart?: (settings: SniperSettings) => Promise<string | null>;
  onStop?: () => void;
  onToggleRun?: () => void;
  onOpenActivityLog: () => void;
  onClose: () => void;
}

export const SnipingControlsSheet = forwardRef<BottomSheetModal, SnipingControlsSheetProps>(
  function SnipingControlsSheet(
    {
      isRunning,
      loops,
      elapsedSeconds = 0,
      statusText,
      error,
      player,
      futbinPrices,
      futbinPrice,
      isLoadingPrice,
      cardsBought = 0,
      profitMade = 0,
      onStart,
      onStop,
      onToggleRun,
      onOpenActivityLog,
      onClose,
    },
    ref
  ): React.ReactElement {
    // Mode
    const [mode, setMode] = useState<SnipingMode>('single');

    // Price & Rating Inputs
    const [minPrice, setMinPrice] = useState('1');
    const [maxPrice, setMaxPrice] = useState('15000');
    const [cardRating, setCardRating] = useState('');
    const [minRating, setMinRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [exactRating, setExactRating] = useState(false);
    const [needPrice, setNeedPrice] = useState(false);

    // Speed Preset
    const [selectedPreset, setSelectedPreset] = useState<SpeedPresetKey>('safe');

    // Listing Options
    const [actLikeHuman, setActLikeHuman] = useState(false);
    const [humanPlus, setHumanPlus] = useState(false);
    const [listAutomatically, setListAutomatically] = useState(false);
    const [listingStrategy, setListingStrategy] = useState<ListingStrategy>('target_profit');
    const [fixedPrice, setFixedPrice] = useState('1000');
    const [targetProfit, setTargetProfit] = useState('250');

    // Errors
    const [localError, setLocalError] = useState<string | null>(null);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const handleMaxPriceChange = useCallback((text: string) => {
      setMaxPrice(text);
      setNeedPrice(false);
      setLocalError(null);
    }, []);

    const handleRunPress = useCallback(async () => {
      setLocalError(null);

      if (isRunning) {
        if (onStop) {
          onStop();
        } else if (onToggleRun) {
          onToggleRun();
        }
        return;
      }

      const numericMaxPrice = Number(maxPrice);
      if (!maxPrice.trim() || numericMaxPrice <= 0) {
        setNeedPrice(true);
        return;
      }

      const numericMinPrice = Number(minPrice) || 1;
      if (numericMinPrice > numericMaxPrice) {
        setLocalError('Min price cannot be greater than Max price.');
        return;
      }

      const parsedRating = cardRating.trim() ? parseInt(cardRating, 10) : null;
      const parsedMinRating = minRating.trim() ? parseInt(minRating, 10) : null;
      const parsedMaxRating = maxRating.trim() ? parseInt(maxRating, 10) : null;

      const parsedFixed = fixedPrice.trim() ? parseInt(fixedPrice, 10) : null;
      const parsedProfit = targetProfit.trim() ? parseInt(targetProfit, 10) : null;

      // Select relevant FUTBIN price for platform
      let activeFutbinPrice: number | null = null;
      if (listingStrategy === 'futbin_pc') {
        activeFutbinPrice = futbinPrices?.pc ?? futbinPrice ?? null;
      } else {
        activeFutbinPrice = futbinPrices?.ps ?? futbinPrice ?? null;
      }

      if (onStart) {
        const settings: SniperSettings = {
          ...DEFAULT_SNIPER_SETTINGS,
          minPrice: numericMinPrice,
          maxPrice: numericMaxPrice,
          preset: selectedPreset,
          autoList: listAutomatically,
          listingStrategy,
          listFixedPrice: parsedFixed,
          listTargetProfit: parsedProfit,
          futbinPrice: listAutomatically ? activeFutbinPrice : null,
          filterMode: mode === 'filter',
          cardRating: exactRating ? parsedRating : null,
          minRating: exactRating ? null : parsedMinRating,
          maxRating: exactRating ? null : parsedMaxRating,
          exactRating,
          actLikeHuman,
          humanPlusPlus: humanPlus,
        };
        const startErr = await onStart(settings);
        if (startErr) {
          setLocalError(startErr);
        }
      } else if (onToggleRun) {
        onToggleRun();
      }
    }, [
      isRunning,
      maxPrice,
      minPrice,
      cardRating,
      minRating,
      maxRating,
      exactRating,
      selectedPreset,
      listAutomatically,
      listingStrategy,
      fixedPrice,
      targetProfit,
      futbinPrices,
      futbinPrice,
      mode,
      actLikeHuman,
      humanPlus,
      onStart,
      onStop,
      onToggleRun,
    ]);

    // Speed confirmation tag matching extension
    const rpmText = useMemo(() => {
      if (selectedPreset === 'safe') return '3 rounds per min';
      if (selectedPreset === 'caution') return '6 rounds per min';
      return '9 rounds per min';
    }, [selectedPreset]);

    const formattedTimer = useMemo(() => {
      const mins = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      return `${pad(mins)}:${pad(secs)}`;
    }, [elapsedSeconds]);

    const statusBadgeText = isRunning ? `RUNNING · ${loops}` : 'STOPPED';
    const displayError = localError || error;

    // Use generous snap point for smooth scrolling of comprehensive controls
    const snapPoints = useMemo(() => ['88%'], []);

    return (
      <BottomSheetModal
        ref={ref}
        name="sniping-controls"
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        {/* Modal Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sniping controls</Text>
          <View style={styles.headerRightRow}>
            <View style={[styles.statusBadge, isRunning ? styles.badgeRunning : styles.badgeStopped]}>
              <View style={[styles.statusDot, isRunning ? styles.dotGreen : styles.dotGrey]} />
              <Text style={[styles.statusBadgeText, isRunning ? styles.textGreen : styles.textGrey]}>
                {statusBadgeText}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close controls"
              style={styles.closeCircle}
            >
              <Close size={14} color="#D4D4D4" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Scrollable Controls Body */}
        <BottomSheetScrollView
          contentContainerStyle={styles.bodyScroll}
          showsVerticalScrollIndicator={false}
        >
          {displayError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{displayError}</Text>
            </View>
          ) : null}

          {/* 1. Mode Tabs (Single Player vs Filter Snipe) */}
          <ControlsModeTabs
            mode={mode}
            onSelectMode={setMode}
            isRunning={isRunning}
          />

          {/* 2. Target Player Card & Multi-Platform Price Grid */}
          <ControlsPlayerCard
            mode={mode}
            player={player}
            futbinPrices={futbinPrices}
            isLoadingPrices={isLoadingPrice}
          />

          {/* 3. Advanced Mode Row with Coming Soon Badge */}
          <ControlsAdvancedModeRow />

          {/* 4. Speed Preset Selector (Safe / Caution / Risky) */}
          <SpeedPresetSelector
            selectedPreset={selectedPreset}
            onSelectPreset={setSelectedPreset}
          />

          {/* 5. Buy Now Price (Min/Max) & Rating Filter with RPM confirmation */}
          <ControlsPriceInputs
            minPrice={minPrice}
            onMinPriceChange={setMinPrice}
            maxPrice={maxPrice}
            onMaxPriceChange={handleMaxPriceChange}
            cardRating={cardRating}
            onCardRatingChange={setCardRating}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            maxRating={maxRating}
            onMaxRatingChange={setMaxRating}
            exactRating={exactRating}
            onExactRatingChange={setExactRating}
            needPrice={needPrice}
            rpmText={rpmText}
          />

          {/* 6. Comprehensive Listing Options */}
          <ControlsListingOptions
            actLikeHuman={actLikeHuman}
            onActLikeHumanChange={setActLikeHuman}
            humanPlus={humanPlus}
            onHumanPlusChange={setHumanPlus}
            listAutomatically={listAutomatically}
            onListAutomaticallyChange={setListAutomatically}
            strategy={listingStrategy}
            onStrategyChange={setListingStrategy}
            fixedPrice={fixedPrice}
            onFixedPriceChange={setFixedPrice}
            targetProfit={targetProfit}
            onTargetProfitChange={setTargetProfit}
          />
        </BottomSheetScrollView>

        {/* Sticky Footer: Action Buttons & Live Stats Strip */}
        <View style={styles.footerActions}>
          <View style={styles.actionButtonsRow}>
            {/* Open Console Button */}
            <Pressable
              onPress={onOpenActivityLog}
              accessibilityRole="button"
              accessibilityLabel="Open Activity log Console"
              style={styles.consoleButton}
            >
              <Text style={styles.consoleButtonText}>OPEN CONSOLE</Text>
            </Pressable>

            {/* Start / Stop Button */}
            <Pressable
              onPress={handleRunPress}
              accessibilityRole="button"
              accessibilityLabel={isRunning ? 'Stop Bot' : 'Start Bot'}
              style={[
                styles.startButton,
                isRunning ? styles.stopButton : styles.startLimeButton,
              ]}
            >
              <Text
                style={[
                  styles.startButtonText,
                  isRunning ? styles.stopButtonText : null,
                ]}
              >
                {isRunning ? `STOP (${formattedTimer})` : 'START'}
              </Text>
            </Pressable>
          </View>

          {/* Live Session Stats Strip */}
          <ControlsStatsStrip
            cardsBought={cardsBought}
            elapsedSeconds={elapsedSeconds}
            profitMade={profitMade}
          />
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#111111',
    borderTopLeftRadius: radii.cardSm,
    borderTopRightRadius: radii.cardSm,
  },
  handleIndicator: {
    backgroundColor: '#333333',
    width: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.titleSm,
    color: colors.textPrimary,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  badgeRunning: {
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
  },
  badgeStopped: {
    backgroundColor: '#1E1E1E',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotGreen: {
    backgroundColor: colors.accent,
  },
  dotGrey: {
    backgroundColor: '#888888',
  },
  statusBadgeText: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
  },
  textGreen: {
    color: colors.accent,
  },
  textGrey: {
    color: '#888888',
  },
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.avatar,
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  errorBanner: {
    backgroundColor: 'rgba(255, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.4)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: '#FF6B6B',
    lineHeight: 18,
  },
  footerActions: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    backgroundColor: '#111111',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  consoleButton: {
    flex: 1,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consoleButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.xs,
    letterSpacing: 0.5,
    color: '#D4D4D4',
  },
  startButton: {
    flex: 1.2,
    height: 48,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startLimeButton: {
    backgroundColor: colors.accent,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  startButtonText: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.sm,
    letterSpacing: 0.5,
    color: '#000000',
  },
  stopButtonText: {
    color: '#FFFFFF',
  },
});
