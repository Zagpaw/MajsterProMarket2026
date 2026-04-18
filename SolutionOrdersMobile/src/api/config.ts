import { Platform } from 'react-native';

const DEV_API_HOST = 'localhost';

const getBaseUrl = (): string => {
  if (__DEV__) {
    // adb reverse mapuje port 5000 emulatora na API dzialajace na komputerze.
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return `http://${DEV_API_HOST}:5000/api`;
    }
  }

  return 'https://your-production-api.com/api';
};

export const API_BASE_URL = getBaseUrl();

console.log('API_BASE_URL:', API_BASE_URL);
