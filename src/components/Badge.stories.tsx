import React from 'react';
import { View } from 'react-native';
import { Badge } from './Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
};

export const Default = {
  args: {
    text: 'Badge',
  },
};

export const AllVariants = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      <Badge text="Primary" variant="primary" />
      <Badge text="Secondary" variant="secondary" />
      <Badge text="Success" variant="success" />
      <Badge text="Warning" variant="warning" />
      <Badge text="Danger" variant="danger" />
    </View>
  ),
};

export const AllSizes = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Badge text="Small" size="small" />
      <Badge text="Medium" size="medium" />
      <Badge text="Large" size="large" />
    </View>
  ),
};

export const Numbers = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Badge text="1" variant="primary" />
      <Badge text="5" variant="success" />
      <Badge text="12" variant="warning" />
      <Badge text="99+" variant="danger" />
    </View>
  ),
};

export const LongText = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      <Badge text="Nouveau" variant="success" />
      <Badge text="En cours" variant="warning" />
      <Badge text="Terminé" variant="primary" />
      <Badge text="Erreur" variant="danger" />
    </View>
  ),
};
