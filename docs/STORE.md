# Store d'authentification

## Vue d'ensemble

Le store d'authentification gère l'état global de l'utilisateur connecté, le stockage persistant du token d'accès et la récupération automatique des informations utilisateur.

## Fonctionnalités

- ✅ Stockage persistant du token avec AsyncStorage
- ✅ Récupération automatique des infos utilisateur après login
- ✅ Ajout automatique du Bearer token aux requêtes API
- ✅ Restauration de la session au démarrage
- ✅ Déconnexion propre

## Utilisation

### 1. Initialisation au démarrage

Dans votre composant racine (`_layout.tsx`), initialisez l'authentification :

```typescript
import { useAuthInit } from './hooks/useAuthInit';

export default function RootLayout() {
  const { isLoading } = useAuthInit();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    // Votre layout
  );
}
```

### 2. Connexion

Utilisez le hook `useLogin` qui gère automatiquement le store :

```typescript
import { useLogin } from './hooks/useLogin';

const { login, isLoading, error, isSuccess } = useLogin();

await login({ identifier: 'user@example.com', password: 'password' });
```

### 3. Inscription

Utilisez le hook `useRegister` :

```typescript
import { useRegister } from './hooks/useRegister';

const { register, isLoading, error, isSuccess } = useRegister();

await register({
  username: 'username',
  email: 'user@example.com',
  password: 'password',
  // ... autres champs
});
```

### 4. Accéder aux données utilisateur

```typescript
import { useAuthStore } from './store/authStore';

function UserProfile() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Bienvenue {user?.firstname}</Text>
    </View>
  );
}
```

### 5. Déconnexion

```typescript
import { useAuthStore } from './store/authStore';

function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    // Rediriger vers l'écran de connexion
  };

  return <Button onPress={handleLogout}>Déconnexion</Button>;
}
```

### 6. Requêtes API authentifiées

Le Bearer token est **ajouté automatiquement** à toutes les requêtes API via l'intercepteur Axios :

```typescript
import apiClient from './config/apiClient';

// Le token est automatiquement ajouté !
const response = await apiClient.get('/api/v1/trips');
```

## Structure du store

```typescript
interface AuthState {
  accessToken: string | null;        // Token JWT
  user: User | null;                 // Données utilisateur
  isAuthenticated: boolean;          // État de connexion
  isLoading: boolean;                // Chargement en cours

  setToken: (token: string) => Promise<void>;  // Définir token + fetch user
  fetchUser: () => Promise<void>;              // Récupérer les infos user
  logout: () => Promise<void>;                 // Déconnexion
  initAuth: () => Promise<void>;               // Initialisation au démarrage
}
```

## Flow d'authentification

1. **Login/Register** → `setToken(accessToken)`
2. **setToken** → Sauvegarde dans AsyncStorage + appel API `/api/v1/user`
3. **fetchUser** → Récupère les données utilisateur et les stocke dans le store
4. **apiClient** → Ajoute automatiquement le Bearer token aux requêtes suivantes

## Sécurité

- Le token est stocké de manière persistante avec AsyncStorage
- En cas d'erreur 401 sur `/api/v1/user`, l'utilisateur est automatiquement déconnecté
- Le token est supprimé lors de la déconnexion

