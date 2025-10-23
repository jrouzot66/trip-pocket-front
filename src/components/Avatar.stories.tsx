import React from 'react';
import { View } from 'react-native';
import { Avatar } from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
};

export const Default = {
  args: {
    name: 'John Doe',
  },
};

export const AllSizes = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Avatar name="John Doe" size="small" />
      <Avatar name="John Doe" size="medium" />
      <Avatar name="John Doe" size="large" />
      <Avatar name="John Doe" size="xlarge" />
    </View>
  ),
};

export const DifferentNames = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Avatar name="John Doe" />
      <Avatar name="Jane Smith" />
      <Avatar name="Bob Johnson" />
      <Avatar name="Alice Brown" />
    </View>
  ),
};

export const CustomColors = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Avatar name="John Doe" backgroundColor="#e74c3c" />
      <Avatar name="Jane Smith" backgroundColor="#27ae60" />
      <Avatar name="Bob Johnson" backgroundColor="#f39c12" />
      <Avatar name="Alice Brown" backgroundColor="#9b59b6" />
    </View>
  ),
};

export const LongNames = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Avatar name="Jean-Pierre Dupont" />
      <Avatar name="Marie-Claire Martin" />
      <Avatar name="Antoine de la Fontaine" />
    </View>
  ),
};

export const SingleInitial = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Avatar name="John" />
      <Avatar name="Jane" />
      <Avatar name="Bob" />
    </View>
  ),
};
