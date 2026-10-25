import { colors } from '@/src/theme/tokens';

export interface MarketCard {
  id: string;
  rating: string;
  position: string;
  name: string;
  rarity: string;
  timeLeft: string;
  price: string;
}

export type LogTag = 'INFO' | 'SEARCH' | 'BOUGHT' | 'LISTED' | 'PAUSE';

export interface ActivityLogItem {
  id: string;
  time: string;
  tag: LogTag;
  msg: string;
  color: string;
}

export const TAG_COLORS: Record<LogTag, string> = {
  INFO: colors.textMuted,
  SEARCH: '#7CC4FF',
  BOUGHT: colors.accent,
  LISTED: colors.warning,
  PAUSE: colors.error,
};

export const INITIAL_MARKET_CARDS: MarketCard[] = [
  { id: '1', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '58m', price: '16,750' },
  { id: '2', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '57m', price: '17,000' },
  { id: '3', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '44m', price: '17,250' },
  { id: '4', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '31m', price: '17,500' },
  { id: '5', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '12m', price: '17,750' },
  { id: '6', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '6m', price: '18,000' },
  { id: '7', rating: '91', position: 'ST', name: 'Mbappé', rarity: 'Gold Rare', timeLeft: '3m', price: '18,250' },
];

export const INITIAL_LOG_ITEMS: ActivityLogItem[] = [
  { id: '1', time: '09:41:02', tag: 'INFO', msg: 'Web App hook ready', color: TAG_COLORS.INFO },
  { id: '2', time: '09:41:02', tag: 'INFO', msg: 'Screen keep-awake on', color: TAG_COLORS.INFO },
  { id: '3', time: '09:41:03', tag: 'SEARCH', msg: 'Mbappé · max 15,000', color: TAG_COLORS.SEARCH },
  { id: '4', time: '09:41:04', tag: 'INFO', msg: 'No match', color: TAG_COLORS.INFO },
  { id: '5', time: '09:41:19', tag: 'SEARCH', msg: 'Mbappé · max 15,000', color: TAG_COLORS.SEARCH },
  { id: '6', time: '09:41:20', tag: 'INFO', msg: '3 results, cheapest 16,750', color: TAG_COLORS.INFO },
  { id: '7', time: '09:41:34', tag: 'SEARCH', msg: 'Mbappé · max 15,000', color: TAG_COLORS.SEARCH },
  { id: '8', time: '09:41:35', tag: 'BOUGHT', msg: 'Card bought for 14,250', color: TAG_COLORS.BOUGHT },
  { id: '9', time: '09:41:37', tag: 'LISTED', msg: 'Listed at 18,500 (+2,825)', color: TAG_COLORS.LISTED },
  { id: '10', time: '09:41:49', tag: 'SEARCH', msg: 'Mbappé · max 15,000', color: TAG_COLORS.SEARCH },
  { id: '11', time: '09:41:50', tag: 'INFO', msg: 'No match', color: TAG_COLORS.INFO },
  { id: '12', time: '09:42:04', tag: 'PAUSE', msg: 'Human pause · 11s', color: TAG_COLORS.PAUSE },
  { id: '13', time: '09:42:16', tag: 'SEARCH', msg: 'Mbappé · max 15,000', color: TAG_COLORS.SEARCH },
  { id: '14', time: '09:42:17', tag: 'INFO', msg: 'No match', color: TAG_COLORS.INFO },
];
