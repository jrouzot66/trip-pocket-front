import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { useFriendsStore } from '../src/store/friendsStore';
import { useChatStore } from '../src/store/chatStore';

export default function FriendsScreen() {
  const { user } = useAuthStore();
  const { friends, loadFriends, isLoading: isLoadingFriends } = useFriendsStore();
  const { openChatWithFriend } = useChatStore();
  
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'sent'>('friends');
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFriendId, setNewFriendId] = useState('');

  useEffect(() => {
    loadFriends();
    loadFriendRequests();
    loadSentRequests();
  }, [loadFriends]);

  const loadFriendRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const apiClient = (await import('../app/config/apiClient')).default;
      const response = await apiClient.post('/api/v1/friend-requests', {
        type: 'receiver',
        status: 'waiting',
      });
      setFriendRequests(response.data.datas || []);
    } catch (error: any) {
      if (__DEV__) {
        console.error('❌ Erreur lors du chargement des demandes:', error);
      }
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadSentRequests = async () => {
    try {
      const apiClient = (await import('../app/config/apiClient')).default;
      const response = await apiClient.post('/api/v1/friend-requests', {
        type: 'sender',
        status: 'waiting',
      });
      setSentRequests(response.data.datas || []);
    } catch (error: any) {
      if (__DEV__) {
        console.error('❌ Erreur lors du chargement des demandes envoyées:', error);
      }
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const apiClient = (await import('../app/config/apiClient')).default;
      await apiClient.patch('/api/v1/friend-request/manage', {
        friendRequestId: requestId,
        status: true,
      });
      
      Alert.alert('Succès', 'Demande d\'ami acceptée');
      loadFriends();
      loadFriendRequests();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible d\'accepter la demande');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const apiClient = (await import('../app/config/apiClient')).default;
      await apiClient.patch('/api/v1/friend-request/manage', {
        friendRequestId: requestId,
        status: false,
      });
      
      Alert.alert('Succès', 'Demande d\'ami refusée');
      loadFriendRequests();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible de refuser la demande');
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    try {
      const apiClient = (await import('../app/config/apiClient')).default;
      await apiClient.delete(`/api/v1/friend-request/${requestId}`);
      
      Alert.alert('Succès', 'Demande d\'ami annulée');
      loadSentRequests();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible d\'annuler la demande');
    }
  };

  const handleSendRequest = async () => {
    try {
      const apiClient = (await import('../app/config/apiClient')).default;
      await apiClient.post('/api/v1/friend-request/create', {
        friendId: parseInt(newFriendId),
      });
      
      Alert.alert('Succès', 'Demande d\'ami envoyée');
      setShowAddModal(false);
      setNewFriendId('');
      loadSentRequests();
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.message || 'Impossible d\'envoyer la demande');
    }
  };

  const handleOpenChat = useCallback(async (friendId: string) => {
    const chat = await openChatWithFriend(friendId);
    if (chat) {
      router.push({
        pathname: '/chat',
        params: { chatId: chat.id }
      });
    }
  }, [openChatWithFriend]);

  const renderFriendItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => handleOpenChat(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>
          {typeof item.avatar === 'string' ? item.avatar : '👤'}
        </Text>
      </View>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username}</Text>
        <Text style={styles.friendEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item }: { item: any }) => {
    const otherUser = item.sender || item._sender;
    return (
      <View style={styles.requestItem}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {otherUser?.thumbnail ? '👤' : '👤'}
          </Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>
            {otherUser?.username || otherUser?._username || 'Utilisateur'}
          </Text>
          {item.message && (
            <Text style={styles.requestMessage}>{item.message}</Text>
          )}
        </View>
        <View style={styles.requestActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAcceptRequest(item.id || item._id)}
          >
            <Text style={styles.actionButtonText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleRejectRequest(item.id || item._id)}
          >
            <Text style={styles.actionButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSentRequestItem = ({ item }: { item: any }) => {
    const otherUser = item.receiver || item._receiver;
    return (
      <View style={styles.requestItem}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {otherUser?.thumbnail ? '👤' : '👤'}
          </Text>
        </View>
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>
            {otherUser?.username || otherUser?._username || 'Utilisateur'}
          </Text>
          {item.message && (
            <Text style={styles.requestMessage}>{item.message}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => handleCancelRequest(item.id || item._id)}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Amis</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <Text style={styles.addButton}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Amis ({friends.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            En attente ({friendRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>
            Envoyées ({sentRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'friends' && (
        <View style={styles.content}>
          {isLoadingFriends ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
            </View>
          ) : friends.length > 0 ? (
            <FlatList
              data={friends}
              keyExtractor={(item) => item.id}
              renderItem={renderFriendItem}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun ami</Text>
              <Text style={styles.emptySubtext}>
                Appuyez sur "+ Ajouter" pour inviter quelqu'un
              </Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'pending' && (
        <View style={styles.content}>
          {isLoadingRequests ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
            </View>
          ) : friendRequests.length > 0 ? (
            <FlatList
              data={friendRequests}
              keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
              renderItem={renderRequestItem}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune demande en attente</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'sent' && (
        <View style={styles.content}>
          {sentRequests.length > 0 ? (
            <FlatList
              data={sentRequests}
              keyExtractor={(item, index) => item.id?.toString() || item._id?.toString() || index.toString()}
              renderItem={renderSentRequestItem}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune demande envoyée</Text>
            </View>
          )}
        </View>
      )}

      {/* Add Friend Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter un ami</Text>
            <Text style={styles.modalSubtitle}>Entrez l'ID de l'utilisateur</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="ID utilisateur"
              value={newFriendId}
              onChangeText={setNewFriendId}
              keyboardType="numeric"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSend]}
                onPress={handleSendRequest}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonSendText]}>
                  Envoyer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  requestItem: {
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
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  friendEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  requestMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#27ae60',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#e1e8ed',
  },
  modalButtonSend: {
    backgroundColor: '#3498db',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalButtonSendText: {
    color: 'white',
  },
});

