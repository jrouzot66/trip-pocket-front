import axios from 'axios';
import { useState } from 'react';
import apiClient from '../../app/config/apiClient';
import { useAuthStore } from '../store/authStore';

interface LoginCredentials {
  identifier: string;
  password: string;
}

interface LoginResponse {
  datas: {
    accessToken: string | null;
    verifyAccount: boolean;
  };
  statusCode: number;
  message: string;
}

interface UseLoginReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  needsVerification: boolean;
  reset: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    setNeedsVerification(false);

    if (__DEV__) {
      console.log('🔧 Login attempt with credentials:', credentials);
      console.log('🔧 apiClient.defaults.baseURL:', apiClient.defaults.baseURL);
    }

    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      
      const { datas, statusCode, message } = response.data;
      if (statusCode === 200) {
        // Vérifier si le compte est vérifié
        if (datas.verifyAccount && datas.accessToken && typeof datas.accessToken === 'string') {
          await setToken(datas.accessToken);
          setIsSuccess(true);
        } else {
          // Compte non vérifié - signaler qu'une vérification est nécessaire
          setNeedsVerification(true);
          setError(message);
        }
      } else {
        setError(message);
      }
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
    setNeedsVerification(false);
  };

  return {
    login,
    isLoading,
    error,
    isSuccess,
    needsVerification,
    reset,
  };
};
