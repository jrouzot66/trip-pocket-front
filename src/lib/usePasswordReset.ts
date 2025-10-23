import axios from 'axios';
import { useState } from 'react';
import apiClient from '../../app/config/apiClient';

interface PasswordResetRequest {
  email: string;
}

interface PasswordUpdateRequest {
  email: string;
  code: string;
  password: string;
}

interface PasswordResetResponse {
  statusCode: number;
  message: string;
  datas: {};
}

interface UsePasswordResetReturn {
  requestReset: (data: PasswordResetRequest) => Promise<void>;
  updatePassword: (data: PasswordUpdateRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export const usePasswordReset = (): UsePasswordResetReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const requestReset = async (data: PasswordResetRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await apiClient.post<PasswordResetResponse>('/api/v1/password/reset', data);
      
      const { statusCode, message } = response.data;
      if (statusCode === 200) {
        setIsSuccess(true);
      } else {
        setError(message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 400) {
          setError(err.response?.data?.message || 'Email invalide');
        } else if (status === 404) {
          setError('Aucun compte trouvé avec cet email');
        } else if (status && status >= 500) {
          setError('Erreur serveur, veuillez réessayer plus tard');
        } else {
          setError('Erreur lors de la demande de réinitialisation');
        }
      } else {
        setError('Erreur inattendue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (data: PasswordUpdateRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await apiClient.post<PasswordResetResponse>('/api/v1/password/update', data);
      
      const { statusCode, message } = response.data;
      if (statusCode === 200) {
        setIsSuccess(true);
      } else {
        setError(message);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 400) {
          setError('Données invalides');
        } else if (status === 404) {
          setError('Code de réinitialisation invalide ou expiré');
        } else if (status && status >= 500) {
          setError('Erreur serveur, veuillez réessayer plus tard');
        } else {
          setError('Erreur lors de la mise à jour du mot de passe');
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
    requestReset,
    updatePassword,
    isLoading,
    error,
    isSuccess,
    reset,
  };
};
