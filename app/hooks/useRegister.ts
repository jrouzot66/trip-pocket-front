import axios from 'axios';
import { useState } from 'react';
import apiClient from '../config/apiClient';

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  birthday: string;
  countryCode: string;
  language: string;
  genderCode: string;
  city: string;
  thumbnail?: string;
  rgpd: boolean;
  visibility: string;
}

interface RegisterResponse {
  email: string;
  username: string;
  accessToken: string;
}

interface UseRegisterReturn {
  register: (credentials: RegisterCredentials) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', credentials);
      
      // Stockage du token d'accès (vous pouvez adapter selon vos besoins)
      const { accessToken, email, username } = response.data;
      
      // Ici vous pouvez stocker le token dans AsyncStorage, SecureStore, ou un contexte global
      // Exemple avec AsyncStorage (nécessite l'installation de @react-native-async-storage/async-storage)
      // await AsyncStorage.setItem('accessToken', accessToken);
      // await AsyncStorage.setItem('userEmail', email);
      // await AsyncStorage.setItem('username', username);
      
      setIsSuccess(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 400) {
          setError('Données d\'inscription invalides');
        } else if (status === 409) {
          setError('Un compte avec cet email ou nom d\'utilisateur existe déjà');
        } else if (status && status >= 500) {
          setError('Erreur serveur, veuillez réessayer plus tard');
        } else {
          setError('Erreur lors de l\'inscription');
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
    register,
    isLoading,
    error,
    isSuccess,
    reset,
  };
};
