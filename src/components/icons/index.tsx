import React from 'react';
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';
import { colors } from '@/src/theme/tokens';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const ArrowRight = React.memo(function ArrowRight({
  size = 18,
  color = colors.textPrimary,
  strokeWidth = 2.2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h13M13 6l6 6-6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const ArrowUpRight = React.memo(function ArrowUpRight({
  size = 18,
  color = colors.accent,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 17L17 7M9 7h8v8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const ChevronLeft = React.memo(function ChevronLeft({
  size = 18,
  color = colors.textPrimary,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 5l-7 7 7 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const ChevronRight = React.memo(function ChevronRight({
  size = 18,
  color = colors.textPrimary,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5l7 7-7 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const Eye = React.memo(function Eye({
  size = 20,
  color = colors.textSecondary,
  strokeWidth = 1.8,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
        <Circle cx="12" cy="12" r="3" />
      </G>
    </Svg>
  );
});

export const EyeOff = React.memo(function EyeOff({
  size = 20,
  color = colors.textSecondary,
  strokeWidth = 1.8,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <Path d="M1 1l22 22" />
      </G>
    </Svg>
  );
});

export const Check = React.memo(function Check({
  size = 14,
  color = colors.accent,
  strokeWidth = 2.4,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const Close = React.memo(function Close({
  size = 14,
  color = colors.textPrimary,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 6l12 12M18 6L6 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
});

export const HomeIcon = React.memo(function HomeIcon({
  size = 22,
  color = colors.textSubtle,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 10.5L12 4l8 6.5V20h-5v-5.5H9V20H4z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const WebAppIcon = React.memo(function WebAppIcon({
  size = 22,
  color = colors.textSubtle,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Rect x="5" y="7.5" width="14" height="11.5" rx="3" />
        <Path d="M12 3.5v4M9.5 12.5v1M14.5 12.5v1" />
      </G>
    </Svg>
  );
});

export const SupportIcon = React.memo(function SupportIcon({
  size = 22,
  color = colors.textSubtle,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Circle cx="12" cy="12" r="8.5" />
        <Path d="M9.6 9.5a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.4M12 16.8v.1" />
      </G>
    </Svg>
  );
});

export const ProfileIcon = React.memo(function ProfileIcon({
  size = 22,
  color = colors.textSubtle,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Circle cx="12" cy="8.5" r="3.75" />
        <Path d="M5 20c.9-3.6 3.6-5.5 7-5.5s6.1 1.9 7 5.5" />
      </G>
    </Svg>
  );
});

export const Shield = React.memo(function Shield({
  size = 14,
  color = colors.textAccentDark,
  strokeWidth = 2.2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5L4.5 5.8v5.7c0 4.7 3.2 8.2 7.5 10 4.3-1.8 7.5-5.3 7.5-10V5.8z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const ShieldCheck = React.memo(function ShieldCheck({
  size = 24,
  color = colors.textInverse,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5L4.5 5.8v5.7c0 4.7 3.2 8.2 7.5 10 4.3-1.8 7.5-5.3 7.5-10V5.8z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M8.8 12l2.3 2.3 4.2-4.3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const Mail = React.memo(function Mail({
  size = 22,
  color = colors.textInverse,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Rect x="3" y="5" width="18" height="14" rx="3" />
        <Path d="M4 7l8 6 8-6" />
      </G>
    </Svg>
  );
});

export const Smartphone = React.memo(function Smartphone({
  size = 22,
  color = colors.textInverse,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Rect x="6.5" y="2.5" width="11" height="19" rx="3" />
        <Path d="M11 18.5h2" />
      </G>
    </Svg>
  );
});

export const Tag = React.memo(function Tag({
  size = 22,
  color = colors.accent,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
        <Circle cx="7.5" cy="7.5" r="1.5" />
      </G>
    </Svg>
  );
});

export const SyncIcon = React.memo(function SyncIcon({
  size = 22,
  color = colors.accent,
  strokeWidth = 1.9,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 11a8 8 0 0 0-14.6-4.5L4 8" />
        <Path d="M4 3v5h5" />
        <Path d="M4 13a8 8 0 0 0 14.6 4.5L20 16" />
        <Path d="M20 21v-5h-5" />
      </G>
    </Svg>
  );
});

export const CardsIcon = React.memo(function CardsIcon({
  size = 16,
  color = colors.textPrimary,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
        <Rect x="7" y="3" width="12" height="16" rx="2.5" />
        <Path d="M4.5 6.5v12A2.5 2.5 0 0 0 7 21h9" />
      </G>
    </Svg>
  );
});

export const CoinIcon = React.memo(function CoinIcon({
  size = 16,
  color = colors.textPrimary,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Circle cx="12" cy="12" r="8.5" />
        <Path d="M14.8 9.2A4 4 0 1 0 14.8 14.8" />
      </G>
    </Svg>
  );
});

export const RotateCcw = React.memo(function RotateCcw({
  size = 18,
  color = '#D4D4D4',
  strokeWidth = 1.75,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
        <Path d="M3 3v5h5" />
      </G>
    </Svg>
  );
});

export const Sun = React.memo(function Sun({
  size = 14,
  color = colors.warning,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round">
        <Circle cx="12" cy="12" r="4" />
        <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </G>
    </Svg>
  );
});

