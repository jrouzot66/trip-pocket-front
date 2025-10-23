# Documentation Trip Pocket

Bienvenue dans la documentation de Trip Pocket ! 📚

## 📖 Guide de la documentation

### 🔐 [Authentification](./AUTHENTICATION_SETUP.md)
Documentation complète du système d'authentification :
- Configuration du store avec Zustand
- Stockage persistant du token avec AsyncStorage
- Récupération automatique des informations utilisateur
- Ajout automatique du Bearer token aux requêtes API
- Gestion de la session au démarrage

**À lire en premier** si vous travaillez sur l'authentification ou les requêtes API.

### 🗺️ [Navigation](./NAVIGATION_UPDATE.md)
Guide du système de navigation et des routes protégées :
- Page de profil utilisateur
- Redirections automatiques après login/register
- Protection des routes selon l'état de connexion
- Flow utilisateur complet

**À lire** pour comprendre comment fonctionne la navigation dans l'application.

### 🏪 [Store d'authentification](./STORE.md)
Documentation technique du store Zustand :
- Structure du store
- Actions disponibles (`setToken`, `fetchUser`, `logout`, `initAuth`)
- Exemples d'utilisation
- Intégration avec les composants React

**Référence technique** pour utiliser le store dans vos composants.

### 🎨 [Système de Design](./DESIGN_SYSTEM_GUIDE.md)
Guide complet du système de design et des composants :
- Composants réutilisables (Button, Input, Card, Avatar, Badge)
- Système de couleurs harmonisé
- Typographie et espacement cohérents
- Bonnes pratiques d'utilisation
- Exemples d'intégration

**À lire** pour utiliser les composants du système de design dans vos écrans.

### 📚 [Storybook](./STORYBOOK.md)
Documentation de Storybook pour les composants :
- Configuration et lancement de Storybook
- Navigation dans les stories
- Test des composants isolément
- Développement de nouveaux composants

**À lire** pour développer et tester les composants du système de design.

### 🔧 [Variables d'environnement](./ENVIRONMENT_VARIABLES.md)
Configuration des variables d'environnement :
- Variables API (URL, timeout, clés de stockage)
- Configuration Storybook
- Exemples pour développement et production
- Migration depuis la configuration hardcodée

**À lire** pour configurer l'application selon l'environnement.

## 🚀 Démarrage rapide

### 1. Premier lancement

L'authentification s'initialise automatiquement au démarrage de l'app grâce à `useAuthInit()` dans `app/_layout.tsx`.

### 2. Se connecter

```typescript
import { useLogin } from './app/hooks/useLogin';

const { login, isLoading, error } = useLogin();

await login({ 
  identifier: 'user@example.com', 
  password: 'password' 
});

// Redirection automatique vers /profile
```

### 3. Accéder aux données utilisateur

```typescript
import { useAuthStore } from './app/store/authStore';

const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
```

### 4. Se déconnecter

```typescript
import { useAuthStore } from './app/store/authStore';
import { router } from 'expo-router';

const logout = useAuthStore((state) => state.logout);

await logout();
router.replace('/'); // Retour à la page de connexion
```

## 📁 Structure du projet

```
app/
├── _layout.tsx              # Layout principal avec initialisation auth
├── index.tsx                # Page de connexion
├── register.tsx             # Page d'inscription
├── profile.tsx              # Page de profil utilisateur
├── config/
│   └── apiClient.ts         # Client Axios avec Bearer token automatique
├── hooks/
│   ├── useLogin.ts          # Hook de connexion
│   ├── useRegister.ts       # Hook d'inscription
│   └── useAuthInit.ts       # Hook d'initialisation de l'auth
├── store/
│   └── authStore.ts         # Store Zustand d'authentification
└── components/
    └── UserProfile.example.tsx  # Exemple de composant
```

## 🔗 Routes disponibles

| Route | Description | Protection |
|-------|-------------|-----------|
| `/` | Page de connexion | Redirection vers `/profile` si connecté |
| `/register` | Page d'inscription | Redirection vers `/profile` si connecté |
| `/profile` | Page de profil utilisateur | Redirection vers `/` si non connecté |

## 🛠️ Technologies utilisées

- **Zustand** - Gestion d'état global
- **AsyncStorage** - Stockage persistant
- **Axios** - Client HTTP avec intercepteurs
- **Expo Router** - Navigation
- **React Native** - Framework mobile
- **Storybook** - Documentation et test des composants
- **Système de Design** - Composants harmonisés et réutilisables

## 📞 Endpoints API

- `POST /auth/login` - Connexion
- `POST /auth/register` - Inscription
- `GET /api/v1/user` - Récupération des infos utilisateur (Bearer token requis)

## ⚡ Points clés à retenir

1. Le token est **automatiquement ajouté** à toutes les requêtes API
2. La session est **restaurée automatiquement** au démarrage
3. Les **redirections sont automatiques** après login/register
4. La déconnexion est **complète** (token supprimé + state réinitialisé)

---

**Besoin d'aide ?** Consultez les documents détaillés ci-dessus ou examinez les exemples de code dans `app/components/UserProfile.example.tsx`.

