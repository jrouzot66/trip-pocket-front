import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export const useAuthInit = () => {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return { isLoading };
};

