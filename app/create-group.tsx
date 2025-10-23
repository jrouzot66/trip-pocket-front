import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from './store/authStore';
import { getDemoUsers, useChatStore, User } from './store/chatStore';
import alert from './utils/alert';

export default function CreateGroupScreen() {
  const { createGroupChat } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [demoUsers] = useState<User[]>(getDemoUsers());

  const handleToggleUser = useCallback((user: User) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const handleCreateGroup = useCallback(() => {
    if (!groupName.trim()) {
      alert('Erreur', 'Veuillez entrer un nom pour le groupe');
      return;
    }

    if (selectedUsers.length < 2) {
      alert('Erreur', 'Veuillez sélectionner au moins 2 personnes pour créer un groupe');
      return;
    }

    if (!currentUser) return;

    // Créer un utilisateur compatible avec le store de chat
    const currentUserForChat: User = {
      id: currentUser._id || 'current',
      username: currentUser._username || 'Utilisateur',
      email: currentUser._email || '',
      avatar: '👤'
    };

    // Créer le groupe avec l'utilisateur actuel + les utilisateurs sélectionnés
    const allParticipants = [currentUserForChat, ...selectedUsers];
    const chatId = createGroupChat(
      allParticipants, 
      groupName.trim(), 
      currentUser._id || 'current'
    );

    // Naviguer vers le chat du groupe
    router.push({
      pathname: '/chat',
      params: { chatId }
    });
  }, [groupName, selectedUsers, currentUser, createGroupChat]);

  const renderUserItem = useCallback(({ item }: { item: User }) => {
    const isSelected = selectedUsers.some(u => u.id === item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.userItem,
          isSelected && styles.selectedUserItem
        ]}
        onPress={() => handleToggleUser(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{item.avatar}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [selectedUsers, handleToggleUser]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nouveau groupe</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nom du groupe</Text>
          <TextInput
            style={styles.groupNameInput}
            placeholder="Entrez le nom du groupe"
            value={groupName}
            onChangeText={setGroupName}
            maxLength={50}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participants ({selectedUsers.length + 1})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Vous + {selectedUsers.length} personne(s) sélectionnée(s)
          </Text>
        </View>

        <FlatList
          data={demoUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
          style={styles.usersList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              (!groupName.trim() || selectedUsers.length < 2) && styles.createButtonDisabled
            ]}
            onPress={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length < 2}
          >
            <Text style={styles.createButtonText}>
              Créer le groupe ({selectedUsers.length + 1} membres)
            </Text>
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  groupNameInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    fontSize: 16,
    color: '#2c3e50',
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  selectedUserItem: {
    borderColor: '#3498db',
    backgroundColor: '#f8f9ff',
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
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: 20,
  },
  createButton: {
    backgroundColor: '#3498db',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
