import { create } from 'zustand';

export interface Friend {
  id: string;
  username: string;
  email: string;
  avatar?: string | { uri: string };
}

interface FriendsState {
  friends: Friend[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadFriends: () => Promise<void>;
  getFriendById: (id: string) => Friend | undefined;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
  friends: [],
  isLoading: false,
  error: null,

  loadFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Import dynamique pour éviter les problèmes de circular dependency
      const apiClient = (await import('../../app/config/apiClient')).default;
      const authStore = (await import('./authStore')).useAuthStore.getState();
      
      const response = await apiClient.get('/api/v1/friendships');
      const currentUserId = authStore.user?._id?.toString();
      
      // Transformer les friendships en liste d'amis
      const friendsMap = new Map<string, Friend>();
      
      response.data.datas.forEach((friendship: any) => {
        // Extraire user et friend de la friendship
        const user = friendship.user || friendship._user;
        const friend = friendship.friend || friendship._friend;
        
        // Déterminer lequel est l'autre utilisateur (pas l'utilisateur actuel)
        let otherUser;
        const userId = (user?.id || user?._id)?.toString();
        if (userId === currentUserId) {
          otherUser = friend;
        } else {
          otherUser = user;
        }
        
        if (otherUser) {
          const friendId = (otherUser.id || otherUser._id)?.toString();
          if (friendId && !friendsMap.has(friendId)) {
            friendsMap.set(friendId, {
              id: friendId,
              username: otherUser.username || otherUser._username || 'Utilisateur',
              email: otherUser.email || otherUser._email || '',
              avatar: otherUser.thumbnail || otherUser._thumbnail ? { uri: otherUser.thumbnail || otherUser._thumbnail } : '👤',
            });
          }
        }
      });
      
      const friends = Array.from(friendsMap.values());
      set({ friends, isLoading: false });
      
      if (__DEV__) {
        console.log('✅ Amis chargés:', friends.length);
      }
    } catch (error: any) {
      if (__DEV__) {
        console.error('❌ Erreur lors du chargement des amis:', error);
      }
      set({ error: error.message || 'Erreur de chargement', isLoading: false });
    }
  },

  getFriendById: (id: string) => {
    return get().friends.find(friend => friend.id === id);
  },
}));

