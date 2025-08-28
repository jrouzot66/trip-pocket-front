import axios from 'axios';
import { useState } from 'react';
import apiClient from '../config/apiClient';

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (__DEV__) {
      console.log('🔧 Login attempt with credentials:', credentials);
      console.log('🔧 apiClient.defaults.baseURL:', apiClient.defaults.baseURL);
    }

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      // Stockage du token d'accès (vous pouvez adapter selon vos besoins)
      const { accessToken } = response.data;
      
      // Ici vous pouvez stocker le token dans AsyncStorage, SecureStore, ou un contexte global
      // Exemple avec AsyncStorage (nécessite l'installation de @react-native-async-storage/async-storage)
      // await AsyncStorage.setItem('accessToken', accessToken);
      
      setIsSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 401) {
          setError('Identifiants incorrects');
        } else if (status === 400) {
          setError('Données de connexion invalides');
        } else if (status && status >= 500) {
          setError('Erreur serveur, veuillez réessayer plus tard');
        } else {
          setError('Erreur de connexion');
        }
      } else {
        setError('Erreur inattendue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setIsSuccess(false);
  };

  return {
    login,
    isLoading,
    error,
    isSuccess,
    reset,
  };
};
