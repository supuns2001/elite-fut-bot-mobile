import React, { forwardRef, useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { Close } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';
import { SnipingStopwatchButton } from '@/src/features/webapp/SnipingStopwatchButton';
import {
  SpeedPresetSelector,
  type SpeedPresetKey,
} from '@/src/features/webapp/SpeedPresetSelector';
import { SnipingTargetInputs, type PlayerInfo } from '@/src/features/webapp/SnipingTargetInputs';
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
  futbinPrice?: number | null;
  isLoadingPrice?: boolean;
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
      elapsedSeconds,
      statusText,
      error,
      player,
      futbinPrice,
      isLoadingPrice,
      onStart,
      onStop,
      onToggleRun,
      onOpenActivityLog,
      onClose,
    },
    ref
  ): React.ReactElement {
    const [maxPrice, setMaxPrice] = useState('15000');
    const [needPrice, setNeedPrice] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<SpeedPresetKey>('safe');
    const [autoList, setAutoList] = useState(false);
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
      const numeric = text.replace(/[^0-9]/g, '');
      setMaxPrice(numeric);
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

      if (onStart) {
        const settings: SniperSettings = {
          ...DEFAULT_SNIPER_SETTINGS,
          maxPrice: numericMaxPrice,
          preset: selectedPreset,
          autoList,
          futbinPrice: autoList ? (futbinPrice ?? null) : null,
        };
        const startErr = await onStart(settings);
        if (startErr) {
          setLocalError(startErr);
        }
      } else if (onToggleRun) {
        onToggleRun();
      }
    }, [isRunning, maxPrice, onStart, onStop, onToggleRun, selectedPreset, autoList, futbinPrice]);

    const loopText = isRunning ? `Loop ${loops}` : 'Idle';
    const loopChipStyle = [styles.loopChipText, isRunning ? styles.loopLime : styles.loopGray];
    const displayError = localError || error;

    const snapPoints = React.useMemo(() => ['78%'], []);

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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sniping controls</Text>
          <View style={styles.headerRightRow}>
            <Text style={loopChipStyle}>{loopText}</Text>
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

        <BottomSheetScrollView
          contentContainerStyle={styles.bodyScroll}
          showsVerticalScrollIndicator={false}
        >
          {displayError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{displayError}</Text>
            </View>
          ) : null}

          <SnipingTargetInputs
            playerInfo={player}
            maxPrice={maxPrice}
            onMaxPriceChange={handleMaxPriceChange}
            needPrice={needPrice}
            autoList={autoList}
            onAutoListChange={setAutoList}
            isRunning={isRunning}
            loops={loops}
            statusText={statusText}
            futbinPrice={futbinPrice}
            isLoadingPrice={isLoadingPrice}
          />

          <SpeedPresetSelector
            selectedPreset={selectedPreset}
            onSelectPreset={setSelectedPreset}
          />
        </BottomSheetScrollView>

        <View style={styles.footerActions}>
          <SnipingStopwatchButton
            isRunning={isRunning}
            elapsedSeconds={elapsedSeconds}
            onToggle={handleRunPress}
          />

          <Pressable
            onPress={onOpenActivityLog}
            accessibilityRole="button"
            accessibilityLabel="Open Activity log"
            style={styles.activityLogButton}
          >
            <Text style={styles.activityLogText}>Activity log</Text>
          </Pressable>
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
    borderBottomColor: '#222222',
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
  loopChipText: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSizes.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  loopLime: {
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    color: colors.accent,
  },
  loopGray: {
    backgroundColor: '#222222',
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
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
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#222222',
    backgroundColor: '#111111',
  },
  activityLogButton: {
    height: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activityLogText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: '#D4D4D4',
  },
});
