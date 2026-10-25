import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { type ActivityLogItem } from '@/src/services/botService';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

export interface ActivityLogRowProps {
  item: ActivityLogItem;
}

export const ActivityLogRow = React.memo(function ActivityLogRow({
  item,
}: ActivityLogRowProps): React.ReactElement {
  const tagStyle = [
    styles.tagText,
    item.tag === 'SEARCH'
      ? styles.tagSearch
      : item.tag === 'BOUGHT'
      ? styles.tagBought
      : item.tag === 'LISTED'
      ? styles.tagListed
      : item.tag === 'PAUSE'
      ? styles.tagPause
      : styles.tagInfo,
  ];

  return (
    <View style={styles.logRow}>
      <Text style={styles.timeText}>{item.time}</Text>
      <Text style={tagStyle}>{item.tag}</Text>
      <Text style={styles.msgText}>{item.msg}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    gap: spacing.md,
  },
  timeText: {
    fontFamily: fonts.monoRegular,
    fontSize: fontSizes.xs,
    color: '#666666',
    width: 60,
  },
  tagText: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
    overflow: 'hidden',
    textAlign: 'center',
    minWidth: 54,
  },
  tagSearch: {
    backgroundColor: '#1E232A',
    color: '#60A5FA',
  },
  tagBought: {
    backgroundColor: 'rgba(212, 255, 0, 0.1)',
    color: colors.accent,
  },
  tagListed: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    color: '#4ADE80',
  },
  tagPause: {
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    color: colors.warning,
  },
  tagInfo: {
    backgroundColor: '#222222',
    color: '#999999',
  },
  msgText: {
    flex: 1,
    fontFamily: fonts.monoRegular,
    fontSize: fontSizes.xs,
    color: '#DDDDDD',
  },
});
