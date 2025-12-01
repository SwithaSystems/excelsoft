import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          return localStorage.getItem(key);
        }
        return null;
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error("Storage getItem error:", error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem(key, value);
        }
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Storage setItem error:", error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.removeItem(key);
        }
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Storage removeItem error:", error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      if (Platform.OS === "web") {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.clear();
        }
      } else {
        await AsyncStorage.clear();
      }
    } catch (error) {
      console.error("Storage clear error:", error);
    }
  },
};
