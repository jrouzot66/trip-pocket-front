import { Alert, AlertButton, Platform } from 'react-native';

const alertPolyfill = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  const result = window.confirm(
    [title, message].filter(Boolean).join('\n')
  );

  if (result) {
    const confirmOption = buttons?.find(({ style }) => style !== 'cancel');
    confirmOption?.onPress?.();
  } else {
    const cancelOption = buttons?.find(({ style }) => style === 'cancel');
    cancelOption?.onPress?.();
  }
};

const alert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
): void => {
  if (Platform.OS === 'web') {
    alertPolyfill(title, message, buttons);
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default alert;

