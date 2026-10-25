import React, { forwardRef, useCallback, useState } from 'react';
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
} from '@/src/services/botService';
import { ActivityLogRow } from '@/src/features/webapp/ActivityLogRow';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface ActivityLogSheetProps {
  isLive: boolean;
  onClose: () => void;
}

export const ActivityLogSheet = forwardRef<BottomSheetModal, ActivityLogSheetProps>(
  function ActivityLogSheet({ isLive, onClose }, ref): React.ReactElement {
    const [logs, setLogs] = useState<ActivityLogItem[]>(INITIAL_LOG_ITEMS);
    const [autoScroll, setAutoScroll] = useState(true);

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
      setLogs([]);
    }, []);

    const renderLogItem: ListRenderItem<ActivityLogItem> = useCallback(
      ({ item }) => <ActivityLogRow item={item} />,
      []
    );

    const keyExtractor = useCallback((item: ActivityLogItem) => item.id, []);

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={['80%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        onDismiss={onClose}
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
            {logs.length > 0 ? (
              <FlashList
                data={logs}
                renderItem={renderLogItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No events yet.</Text>
              </View>
            )}
          </View>

          {/* Footer with event count and auto-scroll switch */}
          <View style={styles.footer}>
            <Text style={styles.footerCount}>
              {logs.length} events · Auto-scroll
            </Text>
            <Toggle value={autoScroll} onValueChange={setAutoScroll} />
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
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: radii.full,
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
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.sm,
    backgroundColor: '#1F1F1F',
  },
  clearText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.xs,
    color: '#AAAAAA',
  },
  closeCircle: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: '#666666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#222222',
    backgroundColor: '#111111',
  },
  footerCount: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.xs,
    color: '#888888',
  },
});
