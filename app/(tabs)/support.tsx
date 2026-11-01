import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, fontSizes, spacing } from '@/src/theme/tokens';
import { SupportConnectionCard } from '@/src/features/support/SupportConnectionCard';
import { SupportDiscordCard } from '@/src/features/support/SupportDiscordCard';
import { SupportFaqAccordion } from '@/src/features/support/SupportFaqAccordion';

export default function SupportTabRoute(): React.ReactElement {
  const insets = useSafeAreaInsets();

  const containerInset = useMemo(
    () => ({
      paddingTop: Math.max(insets.top, spacing.md),
      paddingBottom: Math.max(insets.bottom, spacing.md) + 80,
    }),
    [insets.top, insets.bottom]
  );

  return (
    <View style={[styles.container, containerInset]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: Title 34 Bold with letterSpacing -1.2, Subtitle 15 Medium */}
        <View style={styles.header}>
          <Text style={styles.title}>Help</Text>
          <Text style={styles.subtitle}>
            Check your connection or talk to our team.
          </Text>
        </View>

        {/* 1. Connection Test Card */}
        <SupportConnectionCard />

        {/* 2. Discord Contact Card */}
        <SupportDiscordCard />

        {/* 3. Common Questions Accordion */}
        <SupportFaqAccordion />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.gap,
    gap: spacing.xxl, // 14px gap between sections
    paddingTop: spacing.xs,
  },
  header: {
    gap: spacing.xxs,
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.displayMd,
    letterSpacing: -1.2,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
