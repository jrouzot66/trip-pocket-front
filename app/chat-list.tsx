import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from './store/authStore';
import { getDemoUsers, useChatStore, User } from './store/chatStore';

export default function ChatListScreen() {
  const { chats, createChat, createGroupChat, getUnreadCount } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const [demoUsers] = useState<User[]>(getDemoUsers());

  const handleStartChat = useCallback((user: User) => {
    if (!currentUser) return;
    
    // Créer un utilisateur compatible avec le store de chat
    const currentUserForChat: User = {
      id: currentUser._id || 'current',
      username: currentUser._username || 'Utilisateur',
      email: currentUser._email || '',
      avatar: '👤'
    };
    
    // Créer un chat avec l'utilisateur sélectionné
    const chatId = createChat([currentUserForChat, user]);
    
    // Naviguer vers le chat
    router.push({
      pathname: '/chat',
      params: { chatId }
    });
  }, [currentUser, createChat]);

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
      const otherUser = item.participants.find((p: User) => p.id !== currentUser?._id?.toString());
      displayName = otherUser?.username || 'Utilisateur';
      displayAvatar = otherUser?.avatar || '👤';
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

  const renderUserItem = useCallback(({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleStartChat(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
      </View>
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  ), [handleStartChat]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>
          {getUnreadCount() > 0 && `${getUnreadCount()} message(s) non lu(s)`}
        </Text>
      </View>

      {chats.length > 0 ? (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Aucune conversation</Text>
          <Text style={styles.emptySubtitle}>
            Commencez une conversation avec quelqu'un
          </Text>
        </View>
      )}

      <View style={styles.newChatSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nouvelle conversation</Text>
          <TouchableOpacity
            style={styles.createGroupButton}
            onPress={() => router.push('/create-group' as any)}
          >
            <Text style={styles.createGroupButtonText}>👥 Groupe</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={demoUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.userList}
        />
      </View>
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
});
