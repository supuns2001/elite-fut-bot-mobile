/**
 * EliteFutBot Design Tokens
 * Source of truth: /design/README.md and design files
 * Single source of truth for colors, typography, radii, and spacing.
 */

export const colors = {
  // Backgrounds & Surfaces
  background: '#0A0A0A',
  surfacePrimary: '#141414',
  surfaceSecondary: '#161616',
  surfaceTertiary: '#1A1A1A',
  surfaceElevated: '#1E1E1E',
  surfaceCard: '#141414',
  surfaceInput: '#1E1E1E',
  surfacePill: '#222222',
  surfaceIconTile: '#222222',
  surfaceTrack: '#2A2A2A',
  surfaceAccentSubtle: 'rgba(203, 242, 29, 0.1)',
  surfaceAccentSubtleAlt: 'rgba(10, 10, 10, 0.1)',

  // Discord Brand
  discordCard: '#1A1C33',
  discordTile: '#5865F2',
  discordButton: '#4F5BD5',
  discordSubtext: '#B8BBDD',

  // Borders
  border: '#262626',
  borderSubtle: '#1F1F1F',
  borderMuted: '#242424',
  borderInput: '#262626',
  borderFocus: '#CBF21D',
  borderError: '#FF8A80',
  borderSuccess: '#CBF21D',

  // Text
  textPrimary: '#FAFAFA',
  textSecondary: '#A1A1A1',
  textMuted: '#808080',
  textSubtle: '#8A8A8A',
  textPlaceholder: '#5E5E5E',
  textInverse: '#0A0A0A',
  textAccentDark: '#1F2606',
  textAccentDarker: '#2F3A08',

  // Brand / Accents & Status
  accent: '#CBF21D',
  accentPressed: '#B4D914',
  warning: '#F5B841',
  warningBg: 'rgba(245, 184, 65, 0.12)',
  error: '#FF8A80',
  errorBg: 'rgba(255, 138, 128, 0.12)',
  danger: '#FF8A80',
  success: '#CBF21D',
  successBg: 'rgba(203, 242, 29, 0.12)',

  // Overlay & Modals
  overlay: 'rgba(0, 0, 0, 0.75)',
  sheetHandle: '#404040',
  sheetBackground: '#141414',
} as const;

export const fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semiBold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  monoRegular: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
  monoBold: 'GeistMono_700Bold',
} as const;

export const fontSizes = {
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  body: 16,
  titleSm: 18,
  titleMd: 20,
  titleLg: 24,
  displaySm: 30,
  displayMd: 34,
  displayLg: 36,
  displayXl: 40,
} as const;

export const lineHeights = {
  xs: 16,
  sm: 18,
  base: 20,
  md: 22,
  body: 24,
  titleSm: 24,
  titleMd: 26,
  titleLg: 30,
  displaySm: 34,
  displayMd: 38,
  displayLg: 40,
  displayXl: 44,
} as const;

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  iconTile: 14,
  input: 18,
  innerRow: 20,
  cardSm: 20,
  card: 22,
  cardLg: 24,
  listGroup: 24,
  pillButton: 26,
  cardXl: 28,
  pill: 28,
  tabBar: 30,
  sheet: 32,
  avatar: 22,
  full: 9999,
} as const;

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 14,
  gap: 16,
  inset: 18,
  xxxl: 20,
  section: 22,
  screenPadding: 24,
  jumbo: 32,
} as const;

export const layout = {
  designWidth: 390,
  designHeight: 844,
  buttonHeight: 56,
  inputHeight: 64,
  tabBarHeight: 60,
  tabBarNavHeight: 84,
  headerHeight: 44,
} as const;

export type Colors = typeof colors;
export type Fonts = typeof fonts;
export type FontSizes = typeof fontSizes;
export type LineHeights = typeof lineHeights;
export type Radii = typeof radii;
export type Spacing = typeof spacing;
export type Layout = typeof layout;
