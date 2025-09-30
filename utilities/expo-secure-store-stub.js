// Stub for expo-secure-store on web platform
// This provides a no-op implementation since SecureStore doesn't work on web

const SecureStore = {
  getItemAsync: async (key) => {
    console.warn("SecureStore.getItemAsync called on web - returning null");
    return null;
  },

  setItemAsync: async (key, value) => {
    console.warn("SecureStore.setItemAsync called on web - no-op");
    return;
  },

  deleteItemAsync: async (key) => {
    console.warn("SecureStore.deleteItemAsync called on web - no-op");
    return;
  },
};

// Export both named and default
export { SecureStore };
export default SecureStore;

// Also export all common methods
export const getItemAsync = SecureStore.getItemAsync;
export const setItemAsync = SecureStore.setItemAsync;
export const deleteItemAsync = SecureStore.deleteItemAsync;
