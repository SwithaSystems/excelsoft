import * as SecureStore from "expo-secure-store";

const sanitizeKey = (key: string): string => {
  if (!key || typeof key !== 'string') {
    console.warn('Invalid key provided to SecureStore:', key);
    return 'fallback-key';
  }
  const sanitized = key.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  return sanitized || 'default-key';
};

export const secureStore = {
  setItem: async (key: string, value: string) => {
    try {
      const sanitizedKey = sanitizeKey(key);
      await SecureStore.setItemAsync(sanitizedKey, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
      throw error;
    }
  },
  
  getItem: async (key: string) => {
    try {
      const sanitizedKey = sanitizeKey(key);
      return await SecureStore.getItemAsync(sanitizedKey);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  
  removeItem: async (key: string) => {
    try {
      const sanitizedKey = sanitizeKey(key);
      await SecureStore.deleteItemAsync(sanitizedKey);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
      throw error;
    }
  },
};