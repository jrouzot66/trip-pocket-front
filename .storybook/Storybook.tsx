import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Badge, Button, Card, DesignSystemDemo, Input } from '../app/components';

// Import stories
require('../app/stories');

// Storybook UI with interactive demo
const StorybookUIRoot = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (showDemo) {
    return (
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setShowDemo(false)}
        >
          <Text style={styles.backButtonText}>← Retour à Storybook</Text>
        </TouchableOpacity>
        <DesignSystemDemo />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Storybook - Système de Design</Text>
      <Text style={styles.subtitle}>Composants disponibles :</Text>
      
      <ScrollView style={styles.scrollView}>
        {/* Interactive Demo Section */}
        <Card style={styles.demoCard}>
          <Text style={styles.sectionTitle}>🚀 Démonstration Interactive</Text>
          <Text style={styles.description}>
            Testez tous les composants du système de design en action
          </Text>
          <Button
            title="Voir la démonstration complète"
            onPress={() => setShowDemo(true)}
            variant="primary"
            size="medium"
          />
        </Card>

        {/* Components Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Button</Text>
          <Text style={styles.description}>Boutons avec variantes (primary, secondary, danger, success)</Text>
          <View style={styles.componentDemo}>
            <Button title="Primary" onPress={() => {}} variant="primary" size="small" />
            <Button title="Secondary" onPress={() => {}} variant="secondary" size="small" />
            <Button title="Danger" onPress={() => {}} variant="danger" size="small" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input</Text>
          <Text style={styles.description}>Champs de saisie avec validation et états d'erreur</Text>
          <View style={styles.componentDemo}>
            <Input
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avatar</Text>
          <Text style={styles.description}>Représentation d'utilisateurs avec initiales</Text>
          <View style={styles.componentDemo}>
            <Avatar name="John Doe" size="small" />
            <Avatar name="Jane Smith" size="medium" />
            <Avatar name="Bob Johnson" size="large" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badge</Text>
          <Text style={styles.description}>Indicateurs de statut et quantités</Text>
          <View style={styles.componentDemo}>
            <Badge text="Nouveau" variant="success" />
            <Badge text="En cours" variant="warning" />
            <Badge text="Terminé" variant="primary" />
            <Badge text="Erreur" variant="danger" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card</Text>
          <Text style={styles.description}>Conteneurs avec ombres et espacement</Text>
          <Card style={styles.componentDemo}>
            <Text style={styles.cardText}>Exemple de carte avec contenu</Text>
          </Card>
        </View>
      </ScrollView>
      
      <Text style={styles.footer}>
        Storybook - Système de Design Trip Pocket
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoCard: {
    backgroundColor: '#e8f5e8',
    borderColor: '#27ae60',
    borderWidth: 2,
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  componentDemo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  footer: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default StorybookUIRoot;