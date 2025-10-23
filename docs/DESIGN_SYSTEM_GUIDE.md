# Guide du Système de Design

Ce guide explique comment utiliser le système de design harmonisé de l'application.

## 🎨 Vue d'ensemble

Le système de design fournit des composants réutilisables, des couleurs cohérentes, une typographie harmonisée et des espacements standardisés pour créer une expérience utilisateur uniforme.

## 🚀 Démarrage rapide

### Installation et configuration
```bash
# Lancer Storybook pour voir tous les composants
npm run storybook

# Lancer l'application normale
npm start
```

### Import des composants
```typescript
import { Button, Input, Card, Avatar, Badge } from './components';
import { colors, typography, spacing } from './design-system';
```

## 🧩 Composants disponibles

### Button
Composant de bouton avec plusieurs variantes et tailles.

```typescript
<Button
  title="Cliquer ici"
  onPress={() => console.log('Clic')}
  variant="primary"
  size="medium"
  disabled={false}
  loading={false}
/>
```

**Props :**
- `title` : Texte du bouton
- `onPress` : Fonction appelée au clic
- `variant` : 'primary' | 'secondary' | 'danger' | 'success'
- `size` : 'small' | 'medium' | 'large'
- `disabled` : État désactivé
- `loading` : État de chargement

### Input
Champ de saisie avec validation et états d'erreur.

```typescript
<Input
  label="Email"
  placeholder="votre@email.com"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
/>
```

**Props :**
- `label` : Label du champ
- `placeholder` : Texte d'aide
- `value` : Valeur contrôlée
- `onChangeText` : Fonction de changement
- `keyboardType` : Type de clavier
- `error` : Message d'erreur
- `secureTextEntry` : Masquer le texte
- `multiline` : Texte sur plusieurs lignes

### Card
Conteneur avec ombre et espacement.

```typescript
<Card padding={16} margin={8} shadow>
  <Text>Contenu de la carte</Text>
</Card>
```

**Props :**
- `padding` : Espacement interne
- `margin` : Espacement externe
- `shadow` : Afficher l'ombre

### Avatar
Représentation visuelle d'un utilisateur.

```typescript
<Avatar
  name="John Doe"
  size="medium"
  backgroundColor="#3498db"
  textColor="white"
/>
```

**Props :**
- `name` : Nom pour générer les initiales
- `size` : 'small' | 'medium' | 'large' | 'xlarge'
- `backgroundColor` : Couleur de fond
- `textColor` : Couleur du texte

### Badge
Indicateur de statut ou de quantité.

```typescript
<Badge
  text="Nouveau"
  variant="success"
  size="medium"
/>
```

**Props :**
- `text` : Texte ou nombre à afficher
- `variant` : 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
- `size` : 'small' | 'medium' | 'large'

## 🎨 Système de couleurs

### Couleurs principales
```typescript
import { colors } from './design-system';

// Couleurs primaires
colors.primary        // #3498db (Bleu principal)
colors.primaryLight   // #5dade2 (Bleu clair)
colors.primaryDark    // #2980b9 (Bleu foncé)

// Couleurs de statut
colors.success        // #27ae60 (Vert)
colors.warning        // #f39c12 (Orange)
colors.danger         // #e74c3c (Rouge)

// Couleurs neutres
colors.gray[50]       // #f8f9fa (Gris très clair)
colors.gray[500]      // #6c757d (Gris moyen)
colors.gray[900]      // #1a1a1a (Gris très foncé)
```

### Utilisation dans les styles
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    borderColor: colors.border.light,
  },
  text: {
    color: colors.text.primary,
  },
});
```

## 📝 Typographie

### Tailles de police
```typescript
import { typography } from './design-system';

// Tailles disponibles
typography.fontSize.xs    // 12px
typography.fontSize.sm    // 14px
typography.fontSize.base  // 16px
typography.fontSize.lg    // 18px
typography.fontSize.xl    // 20px
typography.fontSize['2xl'] // 24px
typography.fontSize['3xl'] // 28px
```

### Poids de police
```typescript
typography.fontWeight.light     // 300
typography.fontWeight.normal    // 400
typography.fontWeight.medium     // 500
typography.fontWeight.semibold  // 600
typography.fontWeight.bold      // 700
```

### Utilisation dans les styles
```typescript
const styles = StyleSheet.create({
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
});
```

## 📏 Espacement

### Échelle d'espacement
```typescript
import { spacing, commonSpacing } from './design-system';

// Espacement de base (4px)
spacing[1]  // 4px
spacing[2]  // 8px
spacing[4]  // 16px
spacing[8]  // 32px
spacing[16] // 64px

// Espacement commun
commonSpacing.xs   // 4px
commonSpacing.sm   // 8px
commonSpacing.md   // 16px
commonSpacing.lg   // 24px
commonSpacing.xl   // 32px
```

### Utilisation dans les styles
```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing[4],      // 16px
    margin: spacing[2],       // 8px
    gap: commonSpacing.md,    // 16px
  },
});
```

## 🎯 Bonnes pratiques

### 1. Utilisez toujours les composants du système
```typescript
// ✅ Bon
import { Button } from './components';
<Button title="Valider" onPress={handleSubmit} />

// ❌ Éviter
<TouchableOpacity onPress={handleSubmit}>
  <Text>Valider</Text>
</TouchableOpacity>
```

### 2. Respectez la hiérarchie des couleurs
```typescript
// ✅ Bon
backgroundColor: colors.primary
color: colors.text.primary

// ❌ Éviter
backgroundColor: '#3498db'
color: '#2c3e50'
```

### 3. Utilisez l'espacement cohérent
```typescript
// ✅ Bon
padding: spacing[4]    // 16px
margin: spacing[2]     // 8px

// ❌ Éviter
padding: 15
margin: 7
```

### 4. Gérez les états des composants
```typescript
// ✅ Bon
<Button
  title="Envoyer"
  onPress={handleSubmit}
  loading={isSubmitting}
  disabled={!isValid}
/>

// ❌ Éviter
<Button
  title="Envoyer"
  onPress={handleSubmit}
  style={{ opacity: isSubmitting ? 0.5 : 1 }}
/>
```

## 🔧 Personnalisation

### Créer un nouveau composant
```typescript
// MyComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../design-system';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.primary,
    padding: spacing[4],
    borderRadius: 12,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
});
```

### Créer une story Storybook
```typescript
// MyComponent.stories.tsx
import React from 'react';
import { MyComponent } from './MyComponent';

export default {
  title: 'Components/MyComponent',
  component: MyComponent,
};

export const Default = {
  args: {
    title: 'Mon composant',
    onPress: () => console.log('Clic'),
  },
};
```

## 📱 Exemples d'utilisation

### Formulaire de connexion
```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Card } from './components';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Input
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Se connecter"
        onPress={handleLogin}
        variant="primary"
      />
    </Card>
  );
};
```

### Liste d'utilisateurs
```typescript
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Avatar, Badge, Card } from './components';

export const UserList = ({ users }) => {
  const renderUser = ({ item }) => (
    <Card>
      <View style={styles.userRow}>
        <Avatar name={item.name} size="medium" />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <Badge text={item.status} variant="success" />
      </View>
    </Card>
  );

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={(item) => item.id}
    />
  );
};
```

## 🐛 Débogage

### Problèmes courants

1. **Import errors**
   ```typescript
   // ✅ Bon
   import { Button } from './components';
   
   // ❌ Erreur
   import { Button } from './components/Button';
   ```

2. **Styles non appliqués**
   ```typescript
   // ✅ Bon
   style={[styles.button, disabled && styles.disabled]}
   
   // ❌ Erreur
   style={styles.button && styles.disabled}
   ```

3. **Performance**
   ```typescript
   // ✅ Bon
   const handlePress = useCallback(() => {
     // logique
   }, [dependencies]);
   
   // ❌ Éviter
   const handlePress = () => {
     // logique
   };
   ```

## 📚 Ressources

- [Documentation Storybook](https://storybook.js.org/docs/react-native/get-started/introduction)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Expo Documentation](https://docs.expo.dev/)
- [Design Systems](https://designsystemsrepo.com/)

## 🤝 Contribution

Pour ajouter un nouveau composant :

1. Créer le composant dans `app/components/`
2. Ajouter les types TypeScript
3. Créer les styles avec le système de design
4. Créer les stories Storybook
5. Ajouter l'export dans `index.ts`
6. Tester tous les états et variantes
7. Documenter l'utilisation
