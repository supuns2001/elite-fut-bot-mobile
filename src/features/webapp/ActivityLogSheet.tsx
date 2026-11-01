import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { Close } from '@/src/components/icons';
import { Toggle } from '@/src/components/Toggle';
import {
  ActivityLogItem,
  INITIAL_LOG_ITEMS,
  LogTag,
  TAG_COLORS,
} from '@/src/services/botService';
import type { SniperLogEntry } from '@/src/features/webapp/bot/useSniperBot';
import { ActivityLogRow } from '@/src/features/webapp/ActivityLogRow';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface ActivityLogSheetProps {
  isLive: boolean;
  logs?: SniperLogEntry[];
  onClear?: () => void;
  onClose: () => void;
}

export const ActivityLogSheet = forwardRef<BottomSheetModal, ActivityLogSheetProps>(
  function ActivityLogSheet({ isLive, logs: propLogs, onClear, onClose }, ref): React.ReactElement {
    const [localLogs, setLocalLogs] = useState<ActivityLogItem[]>(INITIAL_LOG_ITEMS);
    const [autoScroll, setAutoScroll] = useState(true);

    const displayLogs = useMemo<ActivityLogItem[]>(() => {
      if (!propLogs) return localLogs;
      return propLogs.map((entry) => {
        const timeStr =
          entry.time instanceof Date
            ? entry.time.toTimeString().split(' ')[0]
            : String(entry.time);

        let tag: LogTag = 'INFO';
        const msg = entry.message.toLowerCase();
        if (
          entry.detail?.kind === 'search' ||
          msg.includes('search') ||
          msg.includes('criteria')
        ) {
          tag = 'SEARCH';
        } else if (
          entry.detail?.kind === 'snipe' ||
          entry.detail?.kind === 'buy' ||
          msg.includes('bought') ||
          entry.level === 'success'
        ) {
          tag = 'BOUGHT';
        } else if (msg.includes('list')) {
          tag = 'LISTED';
        } else if (
          msg.includes('pause') ||
          msg.includes('sleep') ||
          entry.level === 'warning' ||
          entry.level === 'error'
        ) {
          tag = 'PAUSE';
        }

        return {
          id: entry.id,
          time: timeStr,
          tag,
          msg: entry.message,
          color: TAG_COLORS[tag] || TAG_COLORS.INFO,
        };
      });
    }, [propLogs, localLogs]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
        />
      ),
      []
    );

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
      } else {
        setLocalLogs([]);
      }
    }, [onClear]);

    const renderLogItem: ListRenderItem<ActivityLogItem> = useCallback(
      ({ item }) => <ActivityLogRow item={item} />,
      []
    );

    const keyExtractor = useCallback((item: ActivityLogItem) => item.id, []);

    const snapPoints = useMemo(() => ['80%'], []);

    return (
      <BottomSheetModal
        ref={ref}
        name="activity-log"
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <Text style={styles.headerTitle}>Activity log</Text>
              {isLive ? (
                <View style={styles.liveGroup}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.headerActions}>
              <Pressable
                onPress={handleClear}
                accessibilityRole="button"
                accessibilityLabel="Clear activity log"
                style={styles.clearButton}
              >
                <Text style={styles.clearText}>Clear</Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close activity log"
                style={styles.closeCircle}
              >
                <Close size={14} color="#D4D4D4" strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          {/* FlashList of Logs */}
          <View style={styles.listContainer}>
            {displayLogs.length > 0 ? (
              <FlashList
                data={displayLogs}
                renderItem={renderLogItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No activity recorded yet.</Text>
                <Text style={styles.emptySubtext}>
                  Logs will appear here once the bot searches or buys cards.
                </Text>
              </View>
            )}
          </View>

          {/* Footer Controls */}
          <View style={styles.footer}>
            <View style={styles.autoScrollGroup}>
              <Text style={styles.footerLabel}>Auto-scroll</Text>
              <Toggle value={autoScroll} onValueChange={setAutoScroll} />
            </View>
            <Text style={styles.entriesCount}>{displayLogs.length} entries</Text>
          </View>
        </BottomSheetView>
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
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerTitle: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.titleSm,
    color: colors.textPrimary,
  },
  liveGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(0, 229, 153, 0.12)',
    borderRadius: radii.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  liveText: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    color: colors.accent,
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  clearButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  clearText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
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
  listContainer: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.base,
    color: '#D4D4D4',
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#777777',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  autoScrollGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  footerLabel: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: '#888888',
  },
  entriesCount: {
    fontFamily: fonts.monoRegular,
    fontSize: fontSizes.xs,
    color: '#555555',
  },
});
