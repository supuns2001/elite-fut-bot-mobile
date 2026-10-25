import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { fonts } from '@/src/theme/tokens';

export const IntroHeader = React.memo(function IntroHeader(): React.ReactElement {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <Image
          source={require('@/assets/logo.png')}
          style={styles.logo}
          contentFit="contain"
          priority="high"
        />
        <Text style={styles.brandTitle}>EliteFutBot</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 24,
    height: 24,
  },
  brandTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FAFAFA',
    letterSpacing: -0.16, // -0.01em
  },
});
