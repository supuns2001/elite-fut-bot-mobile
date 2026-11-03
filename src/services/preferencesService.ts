import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserPreferences {
  purchaseAlerts: boolean;
  haptics: boolean;
  keepAwake: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  purchaseAlerts: true,
  haptics: true,
  keepAwake: true,
};

const PREFERENCES_STORAGE_KEY = '@elite_fut_bot_preferences';

type PreferencesListener = (prefs: UserPreferences) => void;

let cachedPreferences: UserPreferences = { ...DEFAULT_PREFERENCES };
let isInitialized = false;
const listeners = new Set<PreferencesListener>();

export const preferencesService = {
  /**
   * Returns the current preferences synchronously from in-memory cache.
   * Useful for high-frequency call sites like haptic feedback and bot loops.
   */
  getPreferencesSync(): UserPreferences {
    return { ...cachedPreferences };
  },

  /**
   * Retrieves preferences from AsyncStorage, caching them in memory.
   */
  async getPreferences(): Promise<UserPreferences> {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UserPreferences>;
        cachedPreferences = {
          purchaseAlerts:
            typeof parsed.purchaseAlerts === 'boolean'
              ? parsed.purchaseAlerts
              : DEFAULT_PREFERENCES.purchaseAlerts,
          haptics:
            typeof parsed.haptics === 'boolean'
              ? parsed.haptics
              : DEFAULT_PREFERENCES.haptics,
          keepAwake:
            typeof parsed.keepAwake === 'boolean'
              ? parsed.keepAwake
              : DEFAULT_PREFERENCES.keepAwake,
        };
      } else {
        cachedPreferences = { ...DEFAULT_PREFERENCES };
      }
    } catch (err) {
      console.warn('Failed to load user preferences from AsyncStorage:', err);
      cachedPreferences = { ...DEFAULT_PREFERENCES };
    }
    isInitialized = true;
    return { ...cachedPreferences };
  },

  /**
   * Saves partial or full preferences to AsyncStorage and updates cache.
   */
  async setPreferences(
    partial: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    const updated: UserPreferences = {
      ...cachedPreferences,
      ...partial,
    };
    cachedPreferences = updated;

    try {
      await AsyncStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (err) {
      console.warn('Failed to save user preferences to AsyncStorage:', err);
    }

    listeners.forEach((listener) => {
      try {
        listener(updated);
      } catch (e) {
        console.error('Error notifying preference listener:', e);
      }
    });

    return { ...updated };
  },

  /**
   * Subscribe to preference changes across the app.
   */
  subscribe(listener: PreferencesListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /**
   * Preload preferences into memory.
   */
  async init(): Promise<void> {
    if (!isInitialized) {
      await this.getPreferences();
    }
  },
};

// Eagerly initialize cache
void preferencesService.init();

