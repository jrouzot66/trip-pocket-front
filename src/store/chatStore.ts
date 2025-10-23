import { create } from 'zustand';

export interface User {
  id: string | number;
  username: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  adminId?: string | number;
}

interface ChatState {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  currentChatId: string | null;
  
  // Actions
  createChat: (participants: User[]) => string;
  createGroupChat: (participants: User[], groupName: string, adminId: string | number) => string;
  sendMessage: (chatId: string, content: string, senderId: string) => void;
  markAsRead: (chatId: string) => void;
  setCurrentChat: (chatId: string | null) => void;
  getChatById: (chatId: string) => Chat | undefined;
  getMessagesByChatId: (chatId: string) => Message[];
  getUnreadCount: () => number;
  addParticipantToGroup: (chatId: string, user: User) => void;
  removeParticipantFromGroup: (chatId: string, userId: string | number) => void;
  updateGroupInfo: (chatId: string, groupName: string, groupAvatar?: string) => void;
}

// Utilisateurs fictifs pour la démo
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'Alice',
    email: 'alice@example.com',
    avatar: '👩'
  },
  {
    id: '2',
    username: 'Bob',
    email: 'bob@example.com',
    avatar: '👨'
  },
  {
    id: '3',
    username: 'Charlie',
    email: 'charlie@example.com',
    avatar: '🧑'
  },
  {
    id: '4',
    username: 'Diana',
    email: 'diana@example.com',
    avatar: '👩‍💼'
  }
];

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: {},
  currentChatId: null,

  createChat: (participants: User[]) => {
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newChat: Chat = {
      id: chatId,
      participants,
      unreadCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isGroup: false
    };

    set(state => ({
      chats: [...state.chats, newChat],
      messages: { ...state.messages, [chatId]: [] }
    }));

    return chatId;
  },

  createGroupChat: (participants: User[], groupName: string, adminId: string | number) => {
    const chatId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newChat: Chat = {
      id: chatId,
      participants,
      unreadCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isGroup: true,
      groupName,
      groupAvatar: '👥',
      adminId
    };

    set(state => ({
      chats: [...state.chats, newChat],
      messages: { ...state.messages, [chatId]: [] }
    }));

    return chatId;
  },

  sendMessage: (chatId: string, content: string, senderId: string) => {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      senderId,
      content,
      timestamp: Date.now(),
      isRead: false
    };

    set(state => {
      const currentMessages = state.messages[chatId] || [];
      const newMessages = {
        ...state.messages,
        [chatId]: [...currentMessages, message]
      };

      // Mettre à jour le chat avec le dernier message
      const updatedChats = state.chats.map(chat => {
        if (chat.id === chatId) {
          const isOtherParticipant = chat.participants.some(p => p.id !== senderId);
          return { 
            ...chat, 
            lastMessage: message, 
            updatedAt: Date.now(),
            unreadCount: isOtherParticipant ? chat.unreadCount + 1 : chat.unreadCount
          };
        }
        return chat;
      });

      return {
        chats: updatedChats,
        messages: newMessages
      };
    });
  },

  markAsRead: (chatId: string) => {
    set(state => ({
      chats: state.chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 }
          : chat
      ),
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map(msg => ({ ...msg, isRead: true }))
      }
    }));
  },

  setCurrentChat: (chatId: string | null) => {
    set({ currentChatId: chatId });
  },

  getChatById: (chatId: string) => {
    return get().chats.find(chat => chat.id === chatId);
  },

  getMessagesByChatId: (chatId: string) => {
    return get().messages[chatId] || [];
  },

  getUnreadCount: () => {
    return get().chats.reduce((total, chat) => total + chat.unreadCount, 0);
  },

  addParticipantToGroup: (chatId: string, user: User) => {
    set(state => ({
      chats: state.chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              participants: [...chat.participants, user],
              updatedAt: Date.now()
            }
          : chat
      )
    }));
  },

  removeParticipantFromGroup: (chatId: string, userId: string | number) => {
    set(state => ({
      chats: state.chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              participants: chat.participants.filter(p => p.id !== userId),
              updatedAt: Date.now()
            }
          : chat
      )
    }));
  },

  updateGroupInfo: (chatId: string, groupName: string, groupAvatar?: string) => {
    set(state => ({
      chats: state.chats.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              groupName,
              groupAvatar,
              updatedAt: Date.now()
            }
          : chat
      )
    }));
  }
}));

// Fonction utilitaire pour obtenir les utilisateurs de démo
export const getDemoUsers = () => DEMO_USERS;
