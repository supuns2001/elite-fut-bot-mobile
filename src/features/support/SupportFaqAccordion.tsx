import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Plus } from '@/src/components/icons';
import { colors, fonts, fontSizes, radii, spacing } from '@/src/theme/tokens';

interface FaqItemData {
  id: number;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemData[] = [
  {
    id: 0,
    question: 'Can I turn off my screen while sniping?',
    answer:
      'No. Due to mobile operating system limitations on background web tasks, keeping your screen awake ensures the bot communicates continuously with EA servers without freezing.',
  },
  {
    id: 1,
    question: 'Do you need my EA password?',
    answer:
      "Never. The bot connects directly through EA's official web portal inside an isolated webview. Your login credentials are submitted directly to EA and never touch our servers.",
  },
  {
    id: 2,
    question: 'How do I avoid soft-bans?',
    answer:
      'Use natural browsing delays, take brief pauses between long sniping sessions, and avoid continuous 24/7 runs. Elite FUT Bot incorporates built-in humanized cooldown pauses to protect your account.',
  },
];

interface FaqCardProps {
  item: FaqItemData;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqCard = React.memo(function FaqCard({
  item,
  isOpen,
  onToggle,
}: FaqCardProps): React.ReactElement {
  const openProgress = useSharedValue(isOpen ? 1 : 0);

  React.useEffect(() => {
    openProgress.value = withTiming(isOpen ? 1 : 0, { duration: 200 });
  }, [isOpen, openProgress]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      openProgress.value,
      [0, 1],
      [colors.surfacePill, colors.accent]
    );
    return { backgroundColor };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(openProgress.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <View style={styles.faqCard}>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={item.question}
        style={styles.questionRow}
      >
        <Text style={styles.questionText}>{item.question}</Text>
        <Animated.View style={[styles.circleButton, animatedCircleStyle]}>
          <Animated.View style={animatedIconStyle}>
            <Plus
              size={16}
              color={isOpen ? colors.background : colors.textPrimary}
              strokeWidth={2.4}
            />
          </Animated.View>
        </Animated.View>
      </Pressable>

      {isOpen ? (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{item.answer}</Text>
        </View>
      ) : null}
    </View>
  );
});

export const SupportFaqAccordion = React.memo(function SupportFaqAccordion(): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Common questions</Text>
      <View style={styles.list}>
        {FAQ_ITEMS.map((item) => (
          <FaqCard
            key={item.id}
            item={item}
            isOpen={openIndex === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.titleSm,
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  list: {
    gap: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  questionRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  questionText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  circleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  answerContainer: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.xs,
  },
  answerText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
