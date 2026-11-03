import { API_BASE_URL } from '@/src/config/api';
import { authService } from '@/src/services/authService';
import {
  ActivityLogItem,
  LogTag,
  TAG_COLORS,
} from '@/src/services/botService';

export interface RawLogPayload {
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  detail?: any;
  time?: Date | string;
}

type ActivityLogListener = (logs: ActivityLogItem[]) => void;

let inMemoryLogs: ActivityLogItem[] = [];
let hasFetchedHistory = false;
const listeners = new Set<ActivityLogListener>();

function notifyListeners(): void {
  const current = [...inMemoryLogs];
  listeners.forEach((listener) => {
    try {
      listener(current);
    } catch (err) {
      console.error('Error in activity log listener:', err);
    }
  });
}

function resolveTag(message: string, level: string, detail?: any): LogTag {
  const msg = message.toLowerCase();
  if (detail?.kind === 'search' || msg.includes('search') || msg.includes('criteria')) {
    return 'SEARCH';
  }
  if (
    detail?.kind === 'snipe' ||
    detail?.kind === 'buy' ||
    msg.includes('bought') ||
    level === 'success'
  ) {
    return 'BOUGHT';
  }
  if (detail?.kind === 'list' || msg.includes('list')) {
    return 'LISTED';
  }
  if (
    msg.includes('pause') ||
    msg.includes('sleep') ||
    level === 'warning' ||
    level === 'error'
  ) {
    return 'PAUSE';
  }
  return 'INFO';
}

export const activityLogService = {
  getLogs(): ActivityLogItem[] {
    return [...inMemoryLogs];
  },

  addLog(raw: RawLogPayload): ActivityLogItem {
    const timeStr =
      raw.time instanceof Date
        ? raw.time.toTimeString().split(' ')[0]
        : typeof raw.time === 'string'
        ? raw.time
        : new Date().toTimeString().split(' ')[0];

    const tag = resolveTag(raw.message, raw.level, raw.detail);
    const color = TAG_COLORS[tag] || TAG_COLORS.INFO;

    const item: ActivityLogItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: timeStr,
      tag,
      msg: raw.message,
      color,
    };

    inMemoryLogs.push(item);
    if (inMemoryLogs.length > 200) {
      inMemoryLogs.shift();
    }

    notifyListeners();
    return item;
  },

  clearLogs(): void {
    inMemoryLogs = [];
    notifyListeners();
  },

  subscribe(listener: ActivityLogListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Fetches historical purchases from MongoDB if in-memory logs are empty.
   */
  async fetchHistoricalPurchases(): Promise<ActivityLogItem[]> {
    if (inMemoryLogs.length > 0 || hasFetchedHistory) {
      return [...inMemoryLogs];
    }

    const session = authService.getCurrentSession();
    if (!session?.token) return [...inMemoryLogs];

    try {
      const response = await fetch(`${API_BASE_URL}/users/recent-purchases`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      if (!response.ok) return [...inMemoryLogs];
      const data = await response.json();

      if (data.success && Array.isArray(data.recentPurchases) && data.recentPurchases.length > 0) {
        hasFetchedHistory = true;
        const historicalItems: ActivityLogItem[] = data.recentPurchases.map(
          (purchase: any, index: number) => {
            const timeStr = purchase.purchasedAt
              ? new Date(purchase.purchasedAt).toTimeString().split(' ')[0]
              : '—';
            const price = Number(purchase.price || 0).toLocaleString();
            return {
              id: `hist-${index}-${purchase.tradeId || index}`,
              time: timeStr,
              tag: 'BOUGHT' as LogTag,
              msg: `${purchase.name || 'Card'} bought for ${price}`,
              color: TAG_COLORS.BOUGHT,
            };
          }
        );

        // Prepend or set if in-memory logs are still empty
        if (inMemoryLogs.length === 0) {
          inMemoryLogs = historicalItems;
          notifyListeners();
        }
      }
    } catch (err) {
      console.warn('Failed to fetch historical purchases:', err);
    }

    return [...inMemoryLogs];
  },
};

