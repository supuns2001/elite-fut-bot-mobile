import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

const PING_SAMPLES = [34, 42, 28, 86, 38, 114, 31] as const;

export const SupportConnectionCard = React.memo(function SupportConnectionCard(): React.ReactElement {
  const [ping, setPing] = useState(34);
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestedText, setLastTestedText] = useState('Just now');
  const [sampleIdx, setSampleIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleRunTest = useCallback(() => {
    if (isTesting) return;
    setIsTesting(true);
    setLastTestedText('Testing…');

    timerRef.current = setTimeout(() => {
      const nextPing = PING_SAMPLES[sampleIdx % PING_SAMPLES.length];
      setPing(nextPing);
      setSampleIdx((prev) => prev + 1);
      setIsTesting(false);
      setLastTestedText('Just now');
    }, 1200);
  }, [isTesting, sampleIdx]);

  let statusLabel = 'Excellent for sniping';
  let statusColor: string = colors.accent;
  let filledBars = 4;

  if (isTesting) {
    statusLabel = 'Measuring…';
    statusColor = colors.textSecondary;
    filledBars = 0;
  } else if (ping < 40) {
    statusLabel = 'Excellent for sniping';
    statusColor = colors.accent;
    filledBars = 4;
  } else if (ping <= 90) {
    statusLabel = 'Stable';
    statusColor = colors.warning;
    filledBars = 3;
  } else {
    statusLabel = 'High latency';
    statusColor = colors.danger;
    filledBars = 1;
  }

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Connection test</Text>
        <Text style={styles.lastTime}>{lastTestedText}</Text>
      </View>

      {/* Metric & Signal Bars Row */}
      <View style={styles.metricRow}>
        <View style={styles.metricLeft}>
          <View style={styles.pingRow}>
            <Text style={styles.pingNumber}>
              {isTesting ? '…' : ping}
            </Text>
            <Text style={styles.pingUnit}> ms</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
        </View>

        {/* 4 Signal Bars: 8px wide, heights 12/22/32/44, radius 3, gap 5 */}
        <View style={styles.barsContainer}>
          {[12, 22, 32, 44].map((h, i) => {
            const isFilled = i < filledBars;
            const barBg = isFilled ? statusColor : colors.surfaceTrack;
            return (
              <View
                key={h}
                style={[
                  styles.bar,
                  {
                    height: h,
                    backgroundColor: barBg,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>

      {/* Full-width accent pill button (height 52) */}
      <Pressable
        onPress={handleRunTest}
        disabled={isTesting}
        accessibilityRole="button"
        accessibilityLabel="Run connection test"
        style={({ pressed }) => [
          styles.runButton,
          isTesting && styles.buttonDisabled,
          pressed && !isTesting && styles.buttonPressed,
        ]}
      >
        <Text style={styles.runButtonText}>
          {isTesting ? 'Testing…' : 'Run test'}
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.cardXl,
    padding: spacing.xxxl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  lastTime: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  metricLeft: {
    gap: spacing.xs,
  },
  pingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  pingNumber: {
    fontFamily: fonts.bold,
    fontSize: 48,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
    color: colors.textPrimary,
    lineHeight: 52,
  },
  pingUnit: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.body,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.sm,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 44,
  },
  bar: {
    width: 8,
    borderRadius: 3,
  },
  runButton: {
    height: 52,
    borderRadius: radii.pillButton,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  buttonPressed: {
    backgroundColor: colors.accentPressed,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  runButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: fontSizes.body,
    color: colors.textInverse,
  },
});
