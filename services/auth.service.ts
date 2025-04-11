import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosConfig";
import { router } from "expo-router";
import containers from "@/containers";

export const authService = {
  async login(phone: string, password: string) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        phone,
        password,
      });
      await AsyncStorage.setItem("token", response.data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(userData: { phone: string; email: string; password: string }) {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      console.log("response", response.data);
      await AsyncStorage.setItem("token", response.data.access_token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/(auth)/signIn" as any);
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const userStr = await AsyncStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem("token");
      return !!token;
    } catch (error) {
      return false;
    }
  },
};
