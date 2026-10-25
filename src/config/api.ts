import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Resolves the backend API base URL dynamically.
 * In Expo development, hostUri provides the computer's local IP address,
 * allowing seamless connectivity from physical Android/iOS devices and emulators.
 */
const resolveApiBaseUrl = (): string => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://192.168.123.28:5000/api';
};

export const API_BASE_URL = resolveApiBaseUrl();
