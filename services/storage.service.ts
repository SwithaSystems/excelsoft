import { Platform } from "react-native";

// Conditionally import SecureStore only on native platforms
let SecureStore: any = null;
if (Platform.OS !== "web") {
  SecureStore = require("expo-secure-store");
}

/**
 * Platform-aware storage service that uses SecureStore on native
 * and in-memory storage on web (since SecureStore doesn't work on web)
 */
class StorageService {
  // In-memory storage for web platform
  private webStorage: Map<string, string> = new Map();

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      // Use in-memory storage for web
      this.webStorage.set(key, value);
      return Promise.resolve();
    } else {
      // Use SecureStore for iOS/Android
      return SecureStore.setItemAsync(key, value);
    }
  }

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      // Get from in-memory storage for web
      return Promise.resolve(this.webStorage.get(key) || null);
    } else {
      // Get from SecureStore for iOS/Android
      return SecureStore.getItemAsync(key);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      // Remove from in-memory storage for web
      this.webStorage.delete(key);
      return Promise.resolve();
    } else {
      // Remove from SecureStore for iOS/Android
      return SecureStore.deleteItemAsync(key);
    }
  }

  async clear(): Promise<void> {
    if (Platform.OS === "web") {
      // Clear in-memory storage for web
      this.webStorage.clear();
      return Promise.resolve();
    } else {
      // For native, we need to manually delete known keys
      // since SecureStore doesn't have a clear all method
      const keys = ["token", "refreshtoken", "user"];
      await Promise.all(keys.map((key) => SecureStore.deleteItemAsync(key)));
    }
  }
}

// Export a singleton instance
export const storage = new StorageService();
