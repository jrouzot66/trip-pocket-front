# Storybook - Système de Design

Ce projet utilise Storybook pour documenter et tester les composants du système de design.

## 🚀 Démarrage rapide

### Lancer Storybook
```bash
npm run storybook
```

**Note :** Storybook s'ouvrira dans l'application Expo. Vous verrez l'interface Storybook au lieu de l'application normale.

### Lancer l'application normale
```bash
npm start
```

## 📚 Composants disponibles

### Button
- **Variants** : primary, secondary, danger, success
- **Sizes** : small, medium, large
- **States** : disabled, loading

### Input
- **Types** : text, email, password, phone, multiline
- **States** : normal, error, disabled
- **Features** : label, placeholder, validation

### Card
- **Variants** : with/without shadow
- **Customization** : padding, margin
- **Usage** : containers, content blocks

### Avatar
- **Sizes** : small, medium, large, xlarge
- **Customization** : colors, initials
- **Usage** : user profiles, chat

### Badge
- **Variants** : primary, secondary, success, warning, danger
- **Sizes** : small, medium, large
- **Usage** : notifications, status, counts

## 🎨 Système de Design

### Couleurs
- **Primary** : #3498db (Bleu)
- **Secondary** : #95a5a6 (Gris)
- **Success** : #27ae60 (Vert)
- **Warning** : #f39c12 (Orange)
- **Danger** : #e74c3c (Rouge)

### Typographie
- **Titres** : 24px, 20px, 18px, 16px
- **Corps** : 16px, 14px, 12px
- **Poids** : bold (600), normal (400)

### Espacement
- **Padding** : 4px, 8px, 12px, 16px, 20px, 24px
- **Margins** : 4px, 8px, 12px, 16px, 20px, 24px
- **Gaps** : 4px, 8px, 12px, 16px

## 🔧 Utilisation des composants

### Import
```typescript
import { Button, Input, Card, Avatar, Badge } from './components';
```

### Exemple d'utilisation
```typescript
import React from 'react';
import { View } from 'react-native';
import { Button, Input, Card } from './components';

export const MyComponent = () => {
  return (
    <Card>
      <Input
        label="Email"
        placeholder="votre@email.com"
        value={email}
        onChangeText={setEmail}
      />
      <Button
        title="Envoyer"
        onPress={handleSubmit}
        variant="primary"
        size="medium"
      />
    </Card>
  );
};
```

## 📱 Navigation Storybook

1. **Composants individuels** : Testez chaque composant isolément
2. **Variantes** : Explorez toutes les variantes disponibles
3. **États** : Testez les différents états (disabled, loading, error)
4. **Démo complète** : Voir tous les composants ensemble

## 🛠️ Développement

### Ajouter un nouveau composant
1. Créer le composant dans `app/components/`
2. Créer le fichier `.stories.tsx`
3. Ajouter l'export dans `app/components/index.ts`
4. Importer la story dans `app/stories/index.ts`

### Structure des stories
```typescript
export default {
  title: 'Components/MyComponent',
  component: MyComponent,
  argTypes: {
    // Configuration des contrôles
  },
};

export const Default = {
  args: {
    // Props par défaut
  },
};
```

## 🎯 Bonnes pratiques

1. **Cohérence** : Utilisez toujours les composants du système de design
2. **Accessibilité** : Respectez les standards d'accessibilité
3. **Performance** : Optimisez les re-renders avec useCallback/useMemo
4. **Documentation** : Documentez les props et les cas d'usage
5. **Tests** : Testez tous les états et variantes

## 🔍 Débogage

### Problèmes courants
- **Import errors** : Vérifiez les chemins d'import
- **Style conflicts** : Utilisez les styles du système de design
- **Performance** : Évitez les re-renders inutiles

### Outils de développement
- **Storybook** : Interface de test des composants
- **React DevTools** : Inspection des composants
- **Flipper** : Debugging avancé (si configuré)

## 📖 Ressources

- [Documentation Storybook](https://storybook.js.org/docs/react-native/get-started/introduction)
- [React Native Design Systems](https://reactnative.design/)
- [Expo Documentation](https://docs.expo.dev/)
