import { Platform } from 'react-native';

const DEV_API_HOST = '192.168.1.119';

const getBaseUrl = (): string => {
  if (__DEV__) {
    // Docker/API dziala na komputerze, wiec telefon/emulator potrzebuje adresu IP komputera.
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return `http://${DEV_API_HOST}:5000/api`;
    }
  }

  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

console.log('API_BASE_URL:', API_BASE_URL);
