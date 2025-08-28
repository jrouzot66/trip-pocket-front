import axios from 'axios';

// Configuration directe de l'API
const API_BASE_URL = 'http://localhost:3000';
const API_TIMEOUT = 10000;

// Debug
if (__DEV__) {
  console.log('🔧 Creating API client with baseURL:', API_BASE_URL);
}

// Configuration de base d'axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug: Vérifier la configuration
if (__DEV__) {
  console.log('🔧 apiClient.defaults.baseURL:', apiClient.defaults.baseURL);
}

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
      console.log('🚀 Full URL:', config.baseURL + config.url);
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

// Intercepteur pour les réponses
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
    
    // Gestion des erreurs communes
    if (error.response?.status === 401) {
      if (__DEV__) {
        console.log('🔐 Token expiré, redirection vers la connexion');
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
