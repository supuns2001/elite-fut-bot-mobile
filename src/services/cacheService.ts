import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/src/config/api';
import { authService } from '@/src/services/authService';
import { activityLogService } from '@/src/services/activityLogService';

type CacheClearListener = (epoch: number) => void;

let currentSessionEpoch = 1;
const listeners = new Set<CacheClearListener>();

export const INJECTED_CLEAR_STORAGE_SCRIPT = `
  (function() {
    try {
      if (window.localStorage) window.localStorage.clear();
      if (window.sessionStorage) window.sessionStorage.clear();
    } catch(e) {}
  })();
  true;
`;

export const cacheService = {
  /**
   * Current session epoch. When incremented, forces WebView to remount and wipe caches.
   */
  getSessionEpoch(): number {
    return currentSessionEpoch;
  },

  /**
   * Subscribe to session clear events.
   */
  subscribe(listener: CacheClearListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Performs a comprehensive cache and session clear:
   * 1. Resets server-side bot state in MongoDB (/api/users/clear-session).
   * 2. Clears in-memory activity logs.
   * 3. Increments sessionEpoch so WebAppScreen completely remounts its WebView.
   * 4. Cleans any transient AsyncStorage keys.
   */
  async clearCacheAndSession(): Promise<void> {
    // 1. Invalidate server-side active bot state
    const session = authService.getCurrentSession();
    if (session?.token) {
      try {
        await fetch(`${API_BASE_URL}/users/clear-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.token}`,
          },
        });
      } catch (err) {
        console.warn('Backend clear-session request failed:', err);
      }
    }

    // 2. Clear activity logs
    activityLogService.clearLogs();

    // 3. Clear transient storage keys from AsyncStorage
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const transientKeys = allKeys.filter(
        (key) =>
          key.startsWith('@elite_price_') ||
          key.startsWith('@elite_cache_') ||
          key.startsWith('@elite_transient_')
      );
      if (transientKeys.length > 0) {
        await AsyncStorage.multiRemove(transientKeys);
      }
    } catch (err) {
      console.warn('Failed to clear transient AsyncStorage keys:', err);
    }

    // 4. Increment epoch & notify listeners
    currentSessionEpoch += 1;
    listeners.forEach((listener) => {
      try {
        listener(currentSessionEpoch);
      } catch (e) {
        console.error('Error notifying cache clear listener:', e);
      }
    });
  },
};

