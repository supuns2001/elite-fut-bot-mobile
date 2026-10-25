import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

const PING_SAMPLES = [44, 31, 67, 36, 112, 38] as const;

export const HomeServerPingCard = React.memo(function HomeServerPingCard(): React.ReactElement {
  const [ping, setPing] = useState(38);
  const [isTesting, setIsTesting] = useState(false);
  const [seqIndex, setSeqIndex] = useState(0);
  const retestTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (retestTimeoutRef.current) {
        clearTimeout(retestTimeoutRef.current);
      }
    };
  }, []);

  const handleRetest = useCallback(() => {
    if (isTesting) return;
    setIsTesting(true);
    retestTimeoutRef.current = setTimeout(() => {
      setIsTesting(false);
      setPing(PING_SAMPLES[seqIndex % PING_SAMPLES.length]);
      setSeqIndex((prev) => prev + 1);
    }, 900);
  }, [isTesting, seqIndex]);

  let litBars = 4;
  let statusLabel = 'Great for sniping';
  let quality: 'lime' | 'amber' | 'red' | 'gray' = 'lime';

  if (isTesting) {
    statusLabel = 'Testing…';
    quality = 'gray';
    litBars = 0;
  } else if (ping < 40) {
    statusLabel = 'Great for sniping';
    quality = 'lime';
    litBars = 4;
  } else if (ping <= 90) {
    statusLabel = 'Stable';
    quality = 'amber';
    litBars = 3;
  } else {
    statusLabel = 'Slow connection';
    quality = 'red';
    litBars = 1;
  }

  const getBarStyle = (barIndex: number): ViewStyle => {
    const isLit = barIndex <= litBars;
    if (!isLit) return styles.barOff;
    if (quality === 'lime') return styles.barLime;
    if (quality === 'amber') return styles.barAmber;
    if (quality === 'red') return styles.barRed;
    return styles.barOff;
  };

  const getLabelStyle = (): TextStyle => {
    if (quality === 'lime') return styles.labelLime;
    if (quality === 'amber') return styles.labelAmber;
    if (quality === 'red') return styles.labelRed;
    return styles.labelGray;
  };

  const pingText = isTesting ? '… ms' : `${ping} ms`;

  return (
    <View style={styles.card}>
      <View style={styles.barsContainer}>
        <View style={[styles.bar, styles.bar1, getBarStyle(1)]} />
        <View style={[styles.bar, styles.bar2, getBarStyle(2)]} />
        <View style={[styles.bar, styles.bar3, getBarStyle(3)]} />
        <View style={[styles.bar, styles.bar4, getBarStyle(4)]} />
      </View>

      <View style={styles.textGroup}>
        <Text style={styles.titleText}>EA server · {pingText}</Text>
        <Text style={[styles.statusText, getLabelStyle()]}>
          {statusLabel}
        </Text>
      </View>

      <Pressable
        onPress={handleRetest}
        disabled={isTesting}
        accessibilityRole="button"
        accessibilityLabel="Test server ping"
        style={styles.testButton}
      >
        <Text style={styles.testButtonText}>{isTesting ? 'Testing…' : 'Test'}</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    borderRadius: radii.cardLg,
    backgroundColor: colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxl,
    paddingLeft: spacing.gap,
    paddingRight: spacing.md,
  },
  barsContainer: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs - 1, // 3px
    flexShrink: 0,
  },
  bar: {
    width: 4,
    borderRadius: radii.xs / 2,
  },
  bar1: { height: 6 },
  bar2: { height: 11 },
  bar3: { height: 16 },
  bar4: { height: 20 },
  barOff: {
    backgroundColor: '#333333',
  },
  barLime: {
    backgroundColor: colors.accent,
  },
  barAmber: {
    backgroundColor: colors.warning,
  },
  barRed: {
    backgroundColor: colors.error,
  },
  textGroup: {
    flex: 1,
    gap: spacing.xxs,
  },
  titleText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  statusText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
  },
  labelLime: {
    color: colors.accent,
  },
  labelAmber: {
    color: colors.warning,
  },
  labelRed: {
    color: colors.error,
  },
  labelGray: {
    color: colors.textSecondary,
  },
  testButton: {
    height: 44,
    paddingHorizontal: spacing.inset,
    borderRadius: radii.avatar,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
  },
});
