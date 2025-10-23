import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from './store/authStore';
import alert from './utils/alert';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => {
        router.replace('/');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  const handleLogout = () => {
    alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user._firstname?.[0]?.toUpperCase() || user._username?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.welcomeText}>Bienvenue !</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          {user._firstname && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Prénom</Text>
              <Text style={styles.infoValue}>{user._firstname}</Text>
            </View>
          )}

          {user._lastname && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{user._lastname}</Text>
            </View>
          )}

          {user._username && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom d'utilisateur</Text>
              <Text style={styles.infoValue}>{user._username}</Text>
            </View>
          )}

          {user._email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user._email}</Text>
            </View>
          )}

          {user._birthday && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date de naissance</Text>
              <Text style={styles.infoValue}>
                {new Date(user._birthday).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}

          {user._city && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ville</Text>
              <Text style={styles.infoValue}>{user._city}</Text>
            </View>
          )}

          {user._country?._code && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pays</Text>
              <Text style={styles.infoValue}>{user._country._code.toUpperCase()}</Text>
            </View>
          )}

          {user._language && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Langue</Text>
              <Text style={styles.infoValue}>{user._language}</Text>
            </View>
          )}

          {user._gender?._code && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Genre</Text>
              <Text style={styles.infoValue}>
                {user._gender._code === 'man' ? 'Homme' : user._gender._code === 'woman' ? 'Femme' : user._gender._code}
              </Text>
            </View>
          )}
          
          {!user._firstname && !user._lastname && !user._username && !user._email && (
            <Text style={styles.noDataText}>
              Aucune information personnelle disponible
            </Text>
          )}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => router.push('/chat-list' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.chatButtonText}>💬 Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7f8c8d',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  noDataText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  actionsSection: {
    gap: 16,
  },
  chatButton: {
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
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

