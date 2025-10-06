// utilities/expo-secure-store-stub.js

const SecureStore = {
  getItemAsync: async (key) => {
    console.log(`SecureStore.getItemAsync called for key: ${key}`);
    try {
      const value = localStorage.getItem(key);
      return value ? value : null;
    } catch (e) {
      console.warn('Error reading from localStorage', e);
      return null;
    }
  },

  setItemAsync: async (key, value) => {
    console.log(`SecureStore.setItemAsync called for key: ${key}, value: ${value}`);
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('Error writing to localStorage', e);
    }
  },

  deleteItemAsync: async (key) => {
    console.log(`SecureStore.deleteItemAsync called for key: ${key}`);
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Error deleting from localStorage', e);
    }
  },

  // Optional extra methods
  getValueWithKeyAsync: async (key) => {
    return SecureStore.getItemAsync(key);
  },
  setValueWithKeyAsync: async (key, value) => {
    return SecureStore.setItemAsync(key, value);
  },
  deleteValueWithKeyAsync: async (key) => {
    return SecureStore.deleteItemAsync(key);
  },
};

export default SecureStore;

export const getItemAsync = SecureStore.getItemAsync;
export const setItemAsync = SecureStore.setItemAsync;
export const deleteItemAsync = SecureStore.deleteItemAsync;
export const getValueWithKeyAsync = SecureStore.getValueWithKeyAsync;
export const setValueWithKeyAsync = SecureStore.setValueWithKeyAsync;
export const deleteValueWithKeyAsync = SecureStore.deleteValueWithKeyAsync;
