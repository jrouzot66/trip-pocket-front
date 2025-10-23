// Supprimer les avertissements de dépréciation spécifiques
if (typeof console !== 'undefined' && console.warn) {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    // Supprimer l'avertissement pointerEvents de react-native-web
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      args[0].includes('props.pointerEvents is deprecated')
    ) {
      return;
    }
    
    // Supprimer l'avertissement shadow* de react-native-web
    if (
      args.length > 0 &&
      typeof args[0] === 'string' &&
      args[0].includes('"shadow*" style props are deprecated. Use "boxShadow"')
    ) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
}
