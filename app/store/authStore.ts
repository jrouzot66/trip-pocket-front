import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import apiClient from '../config/apiClient';

interface User {
  _id?: number;
  _username?: string;
  _access?: string[];
  _email?: string;
  _firstname?: string;
  _lastname?: string;
  _birthday?: string;
  _language?: string;
  _city?: string;
  _createdAt?: string;
  _updatedAt?: string;
  _thumbnail?: string;
  _rgpd?: boolean;
  _dateRgpd?: string;
  _passwordResetDate?: string | null;
  _passwordResetTry?: number;
  _passwordResetCode?: string | null;
  _status?: string;
  _visibility?: string;
  _country?: {
    _id: number;
    _code: string;
  };
  _gender?: {
    _id: number;
    _code: string;
  };
  [key: string]: any;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setToken: (token: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

const STORAGE_KEY = '@trip-pocket:accessToken';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setToken: async (token: string) => {
    try {
      set({ isLoading: true, accessToken: token, isAuthenticated: true });
      await AsyncStorage.setItem(STORAGE_KEY, token);
      
      try {
        const response = await apiClient.get<{ datas: User }>('/api/v1/user');
        
        set({ 
          user: response.data.datas,
          isLoading: false 
        });
        
        if (__DEV__) {
          console.log('✅ Utilisateur récupéré:', response.data.datas);
        }
      } catch (userError) {
        if (__DEV__) {
          console.error('❌ Erreur lors de la récupération de l\'utilisateur:', userError);
        }
        await get().logout();
        throw userError;
      }
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Erreur lors de la sauvegarde du token:', error);
      }
      set({ isLoading: false });
      throw error;
    }
  },

  fetchUser: async () => {
    const { accessToken } = get();
    
    if (!accessToken) {
      if (__DEV__) {
        console.log('⚠️ Pas de token disponible pour récupérer l\'utilisateur');
      }
      return;
    }

    try {
      set({ isLoading: true });
      
      const response = await apiClient.get<{ datas: User }>('/api/v1/user');
      
      set({ user: response.data.datas });
      
      if (__DEV__) {
        console.log('✅ Utilisateur récupéré:', response.data.datas);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
      }
      
      await get().logout();
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
      });
      
      if (__DEV__) {
        console.log('✅ Déconnexion réussie');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Erreur lors de la déconnexion:', error);
      }
    }
  },

  initAuth: async () => {
    try {
      set({ isLoading: true });
      
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (token) {
        set({ accessToken: token, isAuthenticated: true });
        await get().fetchUser();
      }
      
      if (__DEV__) {
        console.log('✅ Authentification initialisée');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Erreur lors de l\'initialisation de l\'authentification:', error);
      }
      
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));

