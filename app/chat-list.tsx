import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { useChatStore } from '../src/store/chatStore';
import { useFriendsStore } from '../src/store/friendsStore';

export default function ChatListScreen() {
  const { chats, getUnreadCount, loadConversations, isLoading, openChatWithFriend } = useChatStore();
  const { friends, loadFriends, isLoading: isLoadingFriends } = useFriendsStore();
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    // Charger les conversations et les amis depuis l'API au montage du composant
    loadConversations();
    loadFriends();
  }, [loadConversations, loadFriends]);

  const handleStartChatWithFriend = useCallback(async (friendId: string) => {
    // Ouvrir la conversation avec l'ami (cherche dans les conversations existantes)
    const chat = await openChatWithFriend(friendId);
    
    if (chat) {
      // Naviguer vers le chat
      router.push({
        pathname: '/chat',
        params: { chatId: chat.id }
      });
    } else {
      // Si la conversation n'existe pas, afficher un message d'erreur
      if (__DEV__) {
        console.error('❌ Conversation non trouvée avec cet ami');
      }
    }
  }, [openChatWithFriend]);
  
  const handleOpenChat = useCallback((chatId: string) => {
    router.push({
      pathname: '/chat',
      params: { chatId }
    });
  }, []);

  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 24 * 60 * 60 * 1000) { // Moins de 24h
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  }, []);

  const renderChatItem = useCallback(({ item }: { item: any }) => {
    const isGroup = item.isGroup;
    let displayName = '';
    let displayAvatar = '';
    
    if (isGroup) {
      displayName = item.groupName || 'Groupe';
      displayAvatar = item.groupAvatar || '👥';
    } else {
      const otherUser = item.participants?.find((p: any) => 
        p.id !== currentUser?._id?.toString() && 
        p.id !== currentUser?._id
      );
      displayName = otherUser?.username || 'Utilisateur';
      
      // Gérer avatar qui peut être un string ou un objet { uri: string }
      if (typeof otherUser?.avatar === 'string') {
        displayAvatar = otherUser.avatar || '👤';
      } else if (otherUser?.avatar?.uri) {
        displayAvatar = '👤'; // Pour l'instant, on utilise l'emoji par défaut
      } else {
        displayAvatar = '👤';
      }
    }
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleOpenChat(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{displayAvatar}</Text>
        </View>
        
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.username}>{displayName}</Text>
            {isGroup && (
              <Text style={styles.groupInfo}>
                {item.participants.length} membre(s)
              </Text>
            )}
            {item.lastMessage && (
              <Text style={styles.timestamp}>
                {formatTime(item.lastMessage.timestamp)}
              </Text>
            )}
          </View>
          
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.content || 'Aucun message'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [currentUser, handleOpenChat, formatTime]);

  const renderFriendItem = useCallback(({ item }: { item: any }) => {
    // Gérer avatar qui peut être un string ou un objet { uri: string }
    let avatarDisplay = '👤';
    if (typeof item.avatar === 'string') {
      avatarDisplay = item.avatar;
    } else if (item.avatar?.uri) {
      avatarDisplay = '👤'; // Pour l'instant, on utilise l'emoji par défaut
    }
    
    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleStartChatWithFriend(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{avatarDisplay}</Text>
        </View>
        <Text style={styles.username}>{item.username}</Text>
      </TouchableOpacity>
    );
  }, [handleStartChatWithFriend]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerRight}>
          {getUnreadCount() > 0 && (
            <Text style={styles.subtitle}>
              {getUnreadCount()} message(s) non lu(s)
            </Text>
          )}
          <TouchableOpacity onPress={() => router.push('/friends')}>
            <Text style={styles.friendsLink}>Amis</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Chargement des conversations...</Text>
        </View>
      ) : chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadConversations}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Aucune conversation</Text>
          <Text style={styles.emptySubtitle}>
            Commencez une conversation avec quelqu'un
          </Text>
        </View>
      )}

      {friends.length > 0 && (
        <View style={styles.newChatSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes amis</Text>
          </View>
          {isLoadingFriends ? (
            <ActivityIndicator size="small" color="#3498db" style={{ paddingVertical: 10 }} />
          ) : (
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.userList}
            />
          )}
        </View>
      )}
      
      {friends.length === 0 && !isLoadingFriends && (
        <View style={styles.newChatSection}>
          <View style={styles.emptyFriendsContainer}>
            <Text style={styles.emptyFriendsText}>Aucun ami</Text>
            <Text style={styles.emptyFriendsSubtext}>
              Vous devez ajouter des amis pour démarrer une conversation
            </Text>
            <TouchableOpacity
              style={styles.addFriendsButton}
              onPress={() => router.push('/friends')}
            >
              <Text style={styles.addFriendsButtonText}>+ Ajouter des amis</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  friendsLink: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1e8ed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    fontSize: 24,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  newChatSection: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  createGroupButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createGroupButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  groupInfo: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  userList: {
    flexGrow: 0,
  },
  userItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  emptyFriendsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyFriendsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyFriendsSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  addFriendsButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  addFriendsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
