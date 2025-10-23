import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';
import { Card } from './Card';

export default {
  title: 'Components/Card',
  component: Card,
};

export const Default = {
  render: () => (
    <Card>
      <Text>Contenu de la carte par défaut</Text>
    </Card>
  ),
};

export const WithShadow = {
  render: () => (
    <Card shadow>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Carte avec ombre
      </Text>
      <Text style={{ color: '#7f8c8d' }}>
        Cette carte a une ombre pour donner de la profondeur
      </Text>
    </Card>
  ),
};

export const WithoutShadow = {
  render: () => (
    <Card shadow={false}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Carte sans ombre
      </Text>
      <Text style={{ color: '#7f8c8d' }}>
        Cette carte n'a pas d'ombre
      </Text>
    </Card>
  ),
};

export const WithCustomPadding = {
  render: () => (
    <Card padding={24}>
      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Carte avec padding personnalisé
      </Text>
      <Text style={{ color: '#7f8c8d', marginBottom: 16 }}>
        Cette carte a un padding de 24px au lieu de 16px par défaut
      </Text>
      <Button title="Action" onPress={() => {}} size="small" />
    </Card>
  ),
};

export const MultipleCards = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Première carte
        </Text>
        <Text style={{ color: '#7f8c8d' }}>
          Contenu de la première carte
        </Text>
      </Card>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Deuxième carte
        </Text>
        <Text style={{ color: '#7f8c8d' }}>
          Contenu de la deuxième carte
        </Text>
      </Card>
      <Card>
        <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
          Troisième carte
        </Text>
        <Text style={{ color: '#7f8c8d' }}>
          Contenu de la troisième carte
        </Text>
      </Card>
    </View>
  ),
};
