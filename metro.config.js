const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Supprimer l'avertissement pointerEvents de react-native-web
config.resolver.platforms = ["ios", "android", "native", "web"];

// Configuration pour supprimer les avertissements spécifiques
config.transformer = {
    ...config.transformer,
    minifierConfig: {
        ...config.transformer.minifierConfig,
        // Supprimer les avertissements de dépréciation
        keep_fnames: true,
    },
};

module.exports = config;
