import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Badge, Button, Card, Input } from './index';

export const DesignSystemDemo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Système de Design</Text>
      
      {/* Buttons Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Boutons</Text>
        <View style={styles.buttonRow}>
          <Button title="Primary" onPress={() => {}} variant="primary" size="small" />
          <Button title="Secondary" onPress={() => {}} variant="secondary" size="small" />
          <Button title="Success" onPress={() => {}} variant="success" size="small" />
          <Button title="Danger" onPress={() => {}} variant="danger" size="small" />
        </View>
      </Card>

      {/* Inputs Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Champs de saisie</Text>
        <Input
          label="Email"
          placeholder="votre@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          label="Mot de passe"
          placeholder="Votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Card>

      {/* Avatars Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Avatars</Text>
        <View style={styles.avatarRow}>
          <Avatar name="John Doe" size="small" />
          <Avatar name="Jane Smith" size="medium" />
          <Avatar name="Bob Johnson" size="large" />
          <Avatar name="Alice Brown" size="xlarge" />
        </View>
      </Card>

      {/* Badges Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Badges</Text>
        <View style={styles.badgeRow}>
          <Badge text="Primary" variant="primary" />
          <Badge text="Success" variant="success" />
          <Badge text="Warning" variant="warning" />
          <Badge text="Danger" variant="danger" />
        </View>
      </Card>

      {/* Cards Section */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Cartes</Text>
        <Card style={styles.nestedCard}>
          <Text style={styles.cardTitle}>Carte imbriquée</Text>
          <Text style={styles.cardText}>
            Cette carte est imbriquée dans une autre carte pour démontrer la flexibilité du système.
          </Text>
        </Card>
      </Card>

      {/* Form Example */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Exemple de formulaire</Text>
        <Input
          label="Nom complet"
          placeholder="Votre nom complet"
          value=""
          onChangeText={() => {}}
        />
        <Input
          label="Téléphone"
          placeholder="+33 6 12 34 56 78"
          value=""
          onChangeText={() => {}}
          keyboardType="phone-pad"
        />
        <View style={styles.formActions}>
          <Button title="Annuler" onPress={() => {}} variant="secondary" size="medium" />
          <Button title="Enregistrer" onPress={() => {}} variant="primary" size="medium" />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  nestedCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
