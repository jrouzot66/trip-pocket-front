# Variables d'environnement

Ce document décrit les variables d'environnement utilisées dans l'application Trip Pocket.

## 📁 Fichier .env

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration API
EXPO_PUBLIC_API_URL=http://192.168.1.98:3000
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_STORAGE_KEY=@trip-pocket:accessToken

# Configuration Storybook
EXPO_PUBLIC_STORYBOOK=false
```

## 🔧 Variables disponibles

### API Configuration

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `EXPO_PUBLIC_API_URL` | URL de base de l'API | `http://192.168.1.98:3000` |
| `EXPO_PUBLIC_API_TIMEOUT` | Timeout des requêtes API (ms) | `10000` |
| `EXPO_PUBLIC_STORAGE_KEY` | Clé de stockage du token | `@trip-pocket:accessToken` |

### Storybook Configuration

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `EXPO_PUBLIC_STORYBOOK` | Active le mode Storybook | `false` |

## 🚀 Utilisation

### Développement local
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_STORYBOOK=false
```

### Production
```env
EXPO_PUBLIC_API_URL=https://api.trippocket.com
EXPO_PUBLIC_STORYBOOK=false
```

### Mode Storybook
```env
EXPO_PUBLIC_STORYBOOK=true
```

## 📝 Notes importantes

1. **Préfixe `EXPO_PUBLIC_`** : Nécessaire pour exposer les variables côté client
2. **Redémarrage requis** : Les changements de variables d'environnement nécessitent un redémarrage
3. **Sécurité** : Ne jamais commiter le fichier `.env` avec des données sensibles
4. **Fallbacks** : Des valeurs par défaut sont définies dans le code

## 🔄 Migration

L'apiClient utilise maintenant les variables d'environnement avec des valeurs par défaut :

```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.98:3000';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000');
const STORAGE_KEY = process.env.EXPO_PUBLIC_STORAGE_KEY || '@trip-pocket:accessToken';
```

Cela permet une configuration flexible sans casser l'application existante.
