# Configuration de l'authentification - Trip Pocket

## ✅ Modifications effectuées

### 1. **Dépendances installées**
- `zustand` : Gestion d'état global
- `@react-native-async-storage/async-storage` : Stockage persistant du token

### 2. **Nouveau store d'authentification** (`app/store/authStore.ts`)

Le store gère :
- 🔑 Stockage persistant du token d'accès
- 👤 Récupération automatique des infos utilisateur via `/api/v1/user`
- 🔄 Restauration de session au démarrage
- 🚪 Déconnexion

**Actions disponibles :**
```typescript
setToken(token: string)   // Définir le token + récupérer les infos user
fetchUser()               // Récupérer les données utilisateur
logout()                  // Déconnexion complète
initAuth()               // Initialisation au démarrage
```

### 3. **apiClient modifié** (`app/config/apiClient.ts`)

L'intercepteur Axios ajoute **automatiquement** le Bearer token à toutes les requêtes :
```typescript
Authorization: Bearer <token>
```

### 4. **Hooks mis à jour**

#### `useLogin` (`app/hooks/useLogin.ts`)
- Appelle automatiquement `setToken()` après connexion réussie
- Récupère les infos utilisateur via `/api/v1/user`

#### `useRegister` (`app/hooks/useRegister.ts`)
- Appelle automatiquement `setToken()` après inscription réussie
- Récupère les infos utilisateur via `/api/v1/user`

#### `useAuthInit` (`app/hooks/useAuthInit.ts`) - NOUVEAU
- Hook pour initialiser l'authentification au démarrage
- Restaure la session si un token est présent

### 5. **Layout principal** (`app/_layout.tsx`)

Initialise l'authentification au démarrage de l'application avec un loader.

### 6. **Page de profil** (`app/profile.tsx`) - NOUVEAU

Page affichant les informations de l'utilisateur connecté :
- Affiche toutes les données utilisateur (prénom, nom, email, etc.)
- Bouton de déconnexion
- Redirection automatique vers `/` si non authentifié

### 7. **Navigation automatique**

- Après connexion → Redirection vers `/profile`
- Après inscription → Redirection vers `/profile`
- Si déjà connecté et accès à `/` ou `/register` → Redirection vers `/profile`
- Après déconnexion → Redirection vers `/`

## 🚀 Utilisation

### Vérifier l'état de connexion

```typescript
import { useAuthStore } from './app/store/authStore';

const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const user = useAuthStore((state) => state.user);
const accessToken = useAuthStore((state) => state.accessToken);
```

### Accéder aux données utilisateur

```typescript
const user = useAuthStore((state) => state.user);

console.log(user?.email);
console.log(user?.username);
console.log(user?.firstname);
console.log(user?.lastname);
```

### Afficher le profil utilisateur

La page de profil est accessible à `/profile` et affiche automatiquement toutes les informations :

```typescript
import { router } from 'expo-router';

// Navigation manuelle vers le profil
router.push('/profile');

// Note: La redirection est automatique après login/register
```

### Se déconnecter

```typescript
const logout = useAuthStore((state) => state.logout);

await logout();
// Rediriger vers /login
```

### Faire une requête authentifiée

Le token est automatiquement ajouté :

```typescript
import apiClient from './app/config/apiClient';

// Pas besoin d'ajouter manuellement le Bearer token !
const response = await apiClient.get('/api/v1/trips');
const userData = await apiClient.get('/api/v1/user');
```

## 📋 Flow d'authentification

```
1. Login/Register
   ↓
2. setToken(accessToken)
   ↓
3. Sauvegarde dans AsyncStorage
   ↓
4. Appel API GET /api/v1/user avec Bearer token
   ↓
5. Store les données user dans le store
   ↓
6. Redirection automatique vers /profile
   ↓
7. Toutes les requêtes suivantes incluent automatiquement le Bearer token
```

## 🔄 Restauration de session

Au démarrage de l'app :
```
1. useAuthInit() dans _layout.tsx
   ↓
2. Lecture du token depuis AsyncStorage
   ↓
3. Si token présent → appel GET /api/v1/user
   ↓
4. Si succès → utilisateur connecté
   Si échec → déconnexion automatique
```

## 📝 Exemple complet

Voir `app/components/UserProfile.example.tsx` pour un exemple d'utilisation complète.

## 🗺️ Routes disponibles

| Route | Description | Protection |
|-------|-------------|-----------|
| `/` | Page de connexion | Redirection vers `/profile` si connecté |
| `/register` | Page d'inscription | Redirection vers `/profile` si connecté |
| `/profile` | Page de profil utilisateur | Redirection vers `/` si non connecté |

## 📚 Documentation

Documentation détaillée disponible dans `app/store/README.md`

## ⚠️ Points importants

1. Le token est stocké de manière persistante avec AsyncStorage
2. En cas d'erreur 401 lors de la récupération de l'utilisateur, la déconnexion est automatique
3. Tous les appels API via `apiClient` incluent automatiquement le Bearer token
4. L'initialisation de l'auth se fait au démarrage via `useAuthInit()` dans `_layout.tsx`

