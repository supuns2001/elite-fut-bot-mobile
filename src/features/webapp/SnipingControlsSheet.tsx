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
import { SnipingTargetInputs } from '@/src/features/webapp/SnipingTargetInputs';

export interface SnipingControlsSheetProps {
  isRunning: boolean;
  loops: number;
  onToggleRun: () => void;
  onOpenActivityLog: () => void;
  onClose: () => void;
}

export const SnipingControlsSheet = forwardRef<BottomSheetModal, SnipingControlsSheetProps>(
  function SnipingControlsSheet(
    { isRunning, loops, onToggleRun, onOpenActivityLog, onClose },
    ref
  ): React.ReactElement {
    const [player, setPlayer] = useState('Mbappé');
    const [maxPrice, setMaxPrice] = useState('15000');
    const [needPrice, setNeedPrice] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<SpeedPresetKey>('safe');
    const [autoList, setAutoList] = useState(true);

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
    }, []);

    const handleRunPress = useCallback(() => {
      if (!isRunning && !maxPrice.trim()) {
        setNeedPrice(true);
        return;
      }
      onToggleRun();
    }, [isRunning, maxPrice, onToggleRun]);

    const loopText = isRunning ? `Loop ${loops}` : 'Idle';
    const loopChipStyle = [styles.loopChipText, isRunning ? styles.loopLime : styles.loopGray];

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['75%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        onDismiss={onClose}
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
          <SnipingTargetInputs
            player={player}
            onPlayerChange={setPlayer}
            maxPrice={maxPrice}
            onMaxPriceChange={handleMaxPriceChange}
            needPrice={needPrice}
            autoList={autoList}
            onAutoListChange={setAutoList}
            isRunning={isRunning}
            loops={loops}
          />

          <SpeedPresetSelector
            selectedPreset={selectedPreset}
            onSelectPreset={setSelectedPreset}
          />
        </BottomSheetScrollView>

        <View style={styles.footerActions}>
          <SnipingStopwatchButton
            isRunning={isRunning}
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
    borderWidth: 1,
  },
  loopLime: {
    color: colors.accent,
    backgroundColor: 'rgba(212, 255, 0, 0.08)',
    borderColor: 'rgba(212, 255, 0, 0.25)',
  },
  loopGray: {
    color: '#888888',
    backgroundColor: '#1C1C1C',
    borderColor: '#2A2A2A',
  },
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyScroll: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  footerActions: {
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: '#222222',
    backgroundColor: '#111111',
    gap: spacing.sm,
  },
  activityLogButton: {
    height: 44,
    borderRadius: radii.md,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLogText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: '#CCCCCC',
  },
});
