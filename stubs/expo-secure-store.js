// Stub for expo-secure-store on web - uses localStorage
const setItemAsync = async (key, value) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('localStorage setItem error:', error);
      throw error;
    }
  }
};

const getItemAsync = async (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('localStorage getItem error:', error);
      return null;
    }
  }
  return null;
};

const deleteItemAsync = async (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage removeItem error:', error);
      throw error;
    }
  }
};

// Export as both named and default
export { setItemAsync, getItemAsync, deleteItemAsync };
export default { setItemAsync, getItemAsync, deleteItemAsync };