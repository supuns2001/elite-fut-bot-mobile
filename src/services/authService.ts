import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/src/config/api';

const SESSION_STORAGE_KEY = '@elite_fut_bot_user_session';

export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  hasMobileAccess: boolean;
  plan: 'mobile' | 'trial';
  token: string;
  mobileAccessExpiresAt: string | null;
  referralCode: string;
  role: string;
}

interface AuthApiResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    trialDays: number;
    isPaid: boolean;
    mobileAccessExpiresAt: string | null;
    referralCode: string;
    botStatus: string;
  };
}

let activeSession: UserSession | null = null;

export const authService = {
  getCurrentSession(): UserSession | null {
    return activeSession;
  },

  async loadPersistedSession(): Promise<UserSession | null> {
    try {
      const json = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (!json) {
        activeSession = null;
        return null;
      }

      const session = JSON.parse(json) as UserSession;
      const isTrialValid = session.mobileAccessExpiresAt
        ? new Date(session.mobileAccessExpiresAt) > new Date()
        : false;

      session.hasMobileAccess = session.plan === 'mobile' || isTrialValid;
      activeSession = session;
      return activeSession;
    } catch {
      activeSession = null;
      return null;
    }
  },

  async register(
    first: string,
    last: string,
    email: string,
    password: string,
    referral?: string
  ): Promise<UserSession> {
    const cleanFirst = first.trim();
    const cleanLast = last.trim();
    const cleanEmail = email.trim().toLowerCase();

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: cleanFirst,
        lastName: cleanLast,
        email: cleanEmail,
        password,
        referralCode: referral?.trim() || undefined,
      }),
    });

    const data = (await response.json()) as AuthApiResponse;

    if (!response.ok || !data.success || !data.user || !data.token) {
      throw new Error(data.message || 'Registration failed. Please try again.');
    }

    const { user, token } = data;
    const isTrialValid = user.mobileAccessExpiresAt
      ? new Date(user.mobileAccessExpiresAt) > new Date()
      : false;

    activeSession = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasMobileAccess: user.isPaid || isTrialValid,
      plan: user.isPaid ? 'mobile' : 'trial',
      token,
      mobileAccessExpiresAt: user.mobileAccessExpiresAt,
      referralCode: user.referralCode,
      role: user.role,
    };

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
    return activeSession;
  },

  async signIn(email: string, password: string): Promise<UserSession> {
    const cleanEmail = email.trim().toLowerCase();

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: cleanEmail,
        password,
      }),
    });

    const data = (await response.json()) as AuthApiResponse;

    if (!response.ok || !data.success || !data.user || !data.token) {
      throw new Error(data.message || 'Invalid email or password.');
    }

    const { user, token } = data;
    const isTrialValid = user.mobileAccessExpiresAt
      ? new Date(user.mobileAccessExpiresAt) > new Date()
      : false;

    activeSession = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasMobileAccess: user.isPaid || isTrialValid,
      plan: user.isPaid ? 'mobile' : 'trial',
      token,
      mobileAccessExpiresAt: user.mobileAccessExpiresAt,
      referralCode: user.referralCode,
      role: user.role,
    };

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
    return activeSession;
  },

  async getProfile(): Promise<UserSession | null> {
    if (!activeSession) {
      await this.loadPersistedSession();
    }
    if (!activeSession?.token) return activeSession;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${activeSession.token}`,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as AuthApiResponse;
        if (data.success && data.user) {
          const u = data.user;
          const isTrialValid = u.mobileAccessExpiresAt
            ? new Date(u.mobileAccessExpiresAt) > new Date()
            : false;

          activeSession = {
            ...activeSession,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            role: u.role,
            hasMobileAccess: u.isPaid || isTrialValid,
            plan: u.isPaid ? 'mobile' : 'trial',
            mobileAccessExpiresAt: u.mobileAccessExpiresAt,
            referralCode: u.referralCode,
          };
          await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(activeSession));
        }
      }
    } catch {
      // Keep existing session on offline / network error
    }
    return activeSession;
  },

  async signOut(): Promise<void> {
    activeSession = null;
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  },
};
