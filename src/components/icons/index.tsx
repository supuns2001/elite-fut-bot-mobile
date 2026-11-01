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

export const DiscordIcon = React.memo(function DiscordIcon({
  size = 28,
  color = '#FFFFFF',
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </Svg>
  );
});

export const Plus = React.memo(function Plus({
  size = 18,
  color = colors.textPrimary,
  strokeWidth = 2.2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
});

export const Bell = React.memo(function Bell({
  size = 20,
  color = colors.accent,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </G>
    </Svg>
  );
});

export const Vibrate = React.memo(function Vibrate({
  size = 20,
  color = colors.accent,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M2 8v8M22 8v8M5 5v14M19 5v14" />
        <Rect x="8" y="4" width="8" height="16" rx="2" />
      </G>
    </Svg>
  );
});

export const Activity = React.memo(function Activity({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 12h-4l-3 9L9 3l-3 9H2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
});

export const Trash = React.memo(function Trash({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <Path d="M10 11v6M14 11v6" />
      </G>
    </Svg>
  );
});

export const Globe = React.memo(function Globe({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </G>
    </Svg>
  );
});

export const FileText = React.memo(function FileText({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </G>
    </Svg>
  );
});

export const Lock = React.memo(function Lock({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Rect x="3" y="11" width="18" height="11" rx="2" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </G>
    </Svg>
  );
});

export const LogOut = React.memo(function LogOut({
  size = 20,
  color = colors.danger,
  strokeWidth = 2,
}: IconProps): React.ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </G>
    </Svg>
  );
});

