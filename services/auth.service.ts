import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import containers from "@/containers";
import { jsonAxios } from "./axiosConfig";
import { redirectToPage } from "@/utilities/redirectionHelper";

export const authService = {
  /**
   * Logs in the user with the provided credentials.
   * Stores access token, refresh token, and user info in AsyncStorage.
   * @param loginId - The user's login identifier (email/phone).
   * @param password - The user's password.
   * @returns The response data from the login API.
   */
  async login(loginId: string, password: string) {
    try {
      const response = await jsonAxios.post("/auth/login", {
        loginId,
        password,
      });
      await SecureStore.setItemAsync("token", response.data.access_token);
      await SecureStore.setItemAsync("refreshtoken", response.data.refresh_token);
      await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registers a new user with the provided payload.
   * Stores access token and user info in AsyncStorage.
   * @param payload - The registration payload containing user data.
   * @returns The response data from the register API.
   */
  async register(payload: {
    userData: { phone: string; email: string; password: string };
  }) {
    try {
      const response = await jsonAxios.post("/auth/register", payload);
      await SecureStore.setItemAsync("token", response.data.access_token);
      await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logs out the current user by removing tokens and user info from AsyncStorage.
   * Redirects to the sign-in screen.
   */
  async logout() {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      await SecureStore.deleteItemAsync("refreshtoken");
      redirectToPage(containers.signInScreen);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gets the current user object from AsyncStorage.
   * @returns The user object or null if not found.
   */
  async getCurrentUser() {
    try {
      const userStr = await SecureStore.getItemAsync("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  /**
   * Checks if the user is authenticated by verifying the presence of a token.
   * @returns True if authenticated, false otherwise.
   */
  async isAuthenticated() {
    try {
      const token = await SecureStore.getItemAsync("token");
      return !!token;
    } catch (error) {
      return false;
    }
  },

  /**
   * Explicitly refreshes the access token using the refresh token.
   * Stores new tokens in AsyncStorage if successful.
   * @returns The new access token, or throws an error if refresh fails.
   */
  async refreshToken() {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshtoken");
      if (!refreshToken) throw new Error("Refresh token not available.");
      const response = await jsonAxios.post(
        "/auth/refresh-token",
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );
      const { access_token, refresh_token } = response.data;
      await SecureStore.setItemAsync("token", access_token);
      if (refresh_token) {
        await SecureStore.setItemAsync("refreshtoken", refresh_token);
      }
      return access_token;
    } catch (error) {
      throw error;
    }
  },
};
