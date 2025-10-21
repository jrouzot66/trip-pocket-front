import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.98:3000';
const API_TIMEOUT = 10000;
const STORAGE_KEY = '@trip-pocket:accessToken';

if (__DEV__) {
  console.log('🔧 Creating API client with baseURL:', API_BASE_URL);
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (__DEV__) {
  console.log('🔧 apiClient.defaults.baseURL:', apiClient.defaults.baseURL);
}

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEY);
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (__DEV__) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
      console.log('🚀 Full URL:', `${config.baseURL ?? ''}${config.url ?? ''}`);
      if (token) {
        console.log('🔑 Bearer token ajouté');
      }
    }
    return config;
  },
  (error) => {
    if (__DEV__) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error('❌ API Response Error:', error.response?.status, error.config?.url);
    }
    
    if (error.response?.status === 401) {
      if (__DEV__) {
        console.log('🔐 Token expiré, redirection vers la connexion');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
