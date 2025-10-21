# Trip Pocket 🎒

Application mobile de gestion de voyages créée avec [Expo](https://expo.dev).

## 📚 Documentation

La documentation complète du projet est disponible dans le dossier [`docs/`](./docs/) :

- **[Guide d'authentification](./docs/AUTHENTICATION_SETUP.md)** - Configuration et utilisation du système d'authentification
- **[Navigation](./docs/NAVIGATION_UPDATE.md)** - Système de navigation et routes protégées
- **[Store](./docs/STORE.md)** - Documentation du store Zustand

👉 **[Lire la documentation complète](./docs/README.md)**

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## ✨ Fonctionnalités

- ✅ **Authentification complète** - Login, inscription, gestion de session
- ✅ **Stockage persistant** - Token sauvegardé avec AsyncStorage
- ✅ **Profil utilisateur** - Page dédiée avec toutes les informations
- ✅ **Navigation automatique** - Redirections intelligentes selon l'état de connexion
- ✅ **API sécurisée** - Bearer token ajouté automatiquement aux requêtes

## 🏗️ Architecture

- **State Management** : Zustand
- **Navigation** : Expo Router (file-based routing)
- **API Client** : Axios avec intercepteurs
- **Stockage** : AsyncStorage
- **Authentification** : JWT avec Bearer token

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
