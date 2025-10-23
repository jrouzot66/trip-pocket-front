import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
};

export const Default = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        label="Email"
        placeholder="Entrez votre email"
        value={value}
        onChangeText={setValue}
        keyboardType="email-address"
      />
    );
  },
};

export const WithError = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        label="Mot de passe"
        placeholder="Entrez votre mot de passe"
        value={value}
        onChangeText={setValue}
        secureTextEntry
        error="Le mot de passe doit contenir au moins 8 caractères"
      />
    );
  },
};

export const Multiline = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Input
        label="Message"
        placeholder="Tapez votre message..."
        value={value}
        onChangeText={setValue}
        multiline
        numberOfLines={4}
      />
    );
  },
};

export const Disabled = {
  render: () => {
    return (
      <Input
        label="Champ désactivé"
        placeholder="Ce champ est désactivé"
        value="Valeur fixe"
        onChangeText={() => {}}
        editable={false}
      />
    );
  },
};

export const AllTypes = {
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    return (
      <View style={{ padding: 20 }}>
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
        <Input
          label="Téléphone"
          placeholder="+33 6 12 34 56 78"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Input
          label="Message"
          placeholder="Votre message..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
        />
      </View>
    );
  },
};
