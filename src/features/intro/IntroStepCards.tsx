import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from '@/src/components/icons';
import { fonts } from '@/src/theme/tokens';

export const StepSessionCard = React.memo(function StepSessionCard(): React.ReactElement {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRow}>
        <Text style={styles.sessionTitle}>Example session</Text>
        <View style={styles.liveTag}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <View style={styles.coinsSection}>
        <Text style={styles.coinsLabel}>Coins earned</Text>
        <Text style={styles.coinsValue}>+24,650</Text>
      </View>

      <View style={styles.barChart}>
        <View style={[styles.bar, styles.barH28, styles.barInactive]} />
        <View style={[styles.bar, styles.barH42, styles.barInactive]} />
        <View style={[styles.bar, styles.barH36, styles.barInactive]} />
        <View style={[styles.bar, styles.barH58, styles.barInactive]} />
        <View style={[styles.bar, styles.barH52, styles.barInactive]} />
        <View style={[styles.bar, styles.barH74, styles.barInactive]} />
        <View style={[styles.bar, styles.barH100, styles.barActive]} />
      </View>
    </View>
  );
});

export const StepProfitCard = React.memo(function StepProfitCard(): React.ReactElement {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.playerHeader}>
        <View style={styles.ratingTile}>
          <Text style={styles.ratingText}>86</Text>
        </View>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>Dybala</Text>
          <Text style={styles.playerSubtitle}>Won · just now</Text>
        </View>
      </View>

      <View style={styles.bottomRows}>
        <View style={styles.darkStatRow}>
          <Text style={styles.darkStatLabel}>Bought</Text>
          <Text style={styles.darkStatValue}>9,500</Text>
        </View>
        <View style={styles.darkStatRow}>
          <Text style={styles.darkStatLabel}>Listed at FUTBIN</Text>
          <Text style={styles.darkStatValue}>12,400</Text>
        </View>
        <View style={styles.accentStatRow}>
          <Text style={styles.accentStatLabel}>Profit after tax</Text>
          <Text style={styles.accentStatValue}>+2,280</Text>
        </View>
      </View>
    </View>
  );
});

export const StepProtectionCard = React.memo(function StepProtectionCard(): React.ReactElement {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.shieldTile}>
        <ShieldCheck size={24} color="#0A0A0A" strokeWidth={2} />
      </View>

      <View style={styles.bottomRows}>
        <View style={styles.protectionRow}>
          <Text style={styles.protectionLabel}>Safe speed</Text>
          <View style={styles.toggleTrack}>
            <View style={styles.toggleKnob} />
          </View>
        </View>
        <View style={styles.protectionRow}>
          <Text style={styles.protectionLabel}>Sleep breaks</Text>
          <View style={styles.toggleTrack}>
            <View style={styles.toggleKnob} />
          </View>
        </View>
        <View style={styles.protectionRow}>
          <Text style={styles.protectionLabel}>Human-like pauses</Text>
          <View style={styles.toggleTrack}>
            <View style={styles.toggleKnob} />
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#A1A1A1',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBF21D',
  },
  liveText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: '#CBF21D',
  },
  coinsSection: {
    marginTop: 18,
  },
  coinsLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#A1A1A1',
  },
  coinsValue: {
    fontFamily: fonts.bold,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -1.76, // -0.04em
    color: '#CBF21D',
    fontVariant: ['tabular-nums'],
  },
  barChart: {
    height: 96,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bar: {
    flex: 1,
    borderRadius: 6,
  },
  barH28: { height: '28%' },
  barH42: { height: '42%' },
  barH36: { height: '36%' },
  barH58: { height: '58%' },
  barH52: { height: '52%' },
  barH74: { height: '74%' },
  barH100: { height: '100%' },
  barInactive: {
    backgroundColor: '#2A2A2A',
  },
  barActive: {
    backgroundColor: '#CBF21D',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingTile: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#CBF21D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#0A0A0A',
    fontVariant: ['tabular-nums'],
  },
  playerInfo: {
    gap: 2,
  },
  playerName: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FAFAFA',
  },
  playerSubtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#A1A1A1',
  },
  bottomRows: {
    gap: 8,
  },
  darkStatRow: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#222222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  darkStatLabel: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#A1A1A1',
  },
  darkStatValue: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FAFAFA',
    fontVariant: ['tabular-nums'],
  },
  accentStatRow: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#CBF21D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accentStatLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#0A0A0A',
  },
  accentStatValue: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#0A0A0A',
    fontVariant: ['tabular-nums'],
  },
  shieldTile: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#CBF21D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  protectionRow: {
    height: 48,
    paddingLeft: 14,
    paddingRight: 8,
    borderRadius: 14,
    backgroundColor: '#222222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protectionLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#FAFAFA',
  },
  toggleTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#CBF21D',
    padding: 3,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0A0A0A',
  },
});
