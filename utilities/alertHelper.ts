import { Alert, Platform } from 'react-native';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export const showAlert = (
  title: string,
  message?: string,
  buttons?: AlertButton[]
) => {
  if (Platform.OS === 'web') {
    // For web, use native browser dialogs
    if (buttons && buttons.length > 1) {
      // Confirmation dialog
      const confirmMessage = message ? `${title}\n\n${message}` : title;
      if (window.confirm(confirmMessage)) {
        // Find and execute the non-cancel button
        const confirmButton = buttons.find(b => b.style !== 'cancel');
        confirmButton?.onPress?.();
      } else {
        // Find and execute the cancel button
        const cancelButton = buttons.find(b => b.style === 'cancel');
        cancelButton?.onPress?.();
      }
    } else {
      // Simple alert
      const alertMessage = message ? `${title}\n\n${message}` : title;
      window.alert(alertMessage);
      buttons?.[0]?.onPress?.();
    }
  } else {
    // For mobile, use React Native Alert
    Alert.alert(title, message, buttons as any);
  }
};

