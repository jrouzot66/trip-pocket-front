import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket, io } from 'socket.io-client';
import { create } from 'zustand';

const CHAT_SERVER_URL = process.env.EXPO_PUBLIC_CHAT_SERVER_URL || 'http://localhost:3001';
const STORAGE_KEY = '@trip-pocket:accessToken';

interface ChatWebSocketState {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  joinConversation: (conversationToken: string) => void;
  leaveConversation: (conversationToken: string) => void;
  sendMessage: (conversationToken: string, content: string) => void;
}

export const useChatWebSocketStore = create<ChatWebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  error: null,

  connect: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!token) {
        if (__DEV__) {
          console.error('❌ Pas de token pour se connecter au chat');
        }
        set({ error: 'Token introuvable' });
        return;
      }

      if (get().socket?.connected) {
        if (__DEV__) {
          console.log('✅ Déjà connecté au chat');
        }
        return;
      }

      if (__DEV__) {
        console.log('🔄 Connexion au serveur chat...', CHAT_SERVER_URL);
      }

      const newSocket = io(CHAT_SERVER_URL, {
        auth: {
          token: token
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      newSocket.on('connect', () => {
        if (__DEV__) {
          console.log('✅ Connecté au serveur chat');
        }
        set({ isConnected: true, error: null });
      });

      newSocket.on('disconnect', (reason: string) => {
        if (__DEV__) {
          console.log('❌ Déconnecté du serveur chat:', reason);
        }
        set({ isConnected: false });
      });

      newSocket.on('error', (error: any) => {
        if (__DEV__) {
          console.error('❌ Erreur chat:', error);
        }
        set({ error: error.message || 'Erreur de connexion' });
      });

      newSocket.on('joined_conversation', (data: any) => {
        if (__DEV__) {
          console.log('✅ Rejoint la conversation:', data.conversationToken);
        }
      });

      newSocket.on('connect_error', (error: any) => {
        if (__DEV__) {
          console.error('❌ Erreur de connexion au chat:', error.message);
        }
        set({ error: error.message, isConnected: false });
      });

      set({ socket: newSocket });
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Erreur lors de la connexion au chat:', error);
      }
      set({ error: 'Erreur de connexion' });
    }
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      if (__DEV__) {
        console.log('🔄 Déconnexion du serveur chat...');
      }
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinConversation: (conversationToken: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      if (__DEV__) {
        console.log('🔄 Rejoindre la conversation:', conversationToken);
      }
      socket.emit('join_conversation', { conversationToken });
    } else {
      if (__DEV__) {
        console.warn('⚠️ Socket non connecté, impossible de rejoindre la conversation');
      }
    }
  },

  leaveConversation: (conversationToken: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      if (__DEV__) {
        console.log('🔄 Quitter la conversation:', conversationToken);
      }
      socket.emit('leave_conversation', { conversationToken });
    }
  },

  sendMessage: (conversationToken: string, content: string) => {
    const { socket, isConnected } = get();
    if (socket && isConnected) {
      if (__DEV__) {
        console.log('📤 Envoyer un message à:', conversationToken, content);
      }
      socket.emit('send_message', { conversationToken, content });
    } else {
      if (__DEV__) {
        console.warn('⚠️ Socket non connecté, impossible d\'envoyer le message');
      }
    }
  },
}));

