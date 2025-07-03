import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import containers from "@/containers";
import { jsonAxios } from "./axiosConfig";
import { redirectToPage } from "@/utilities/redirectionHelper";

export const authService = {
  async login(loginId: string, password: string) {
    try {
      console.log("credentials", loginId, password);
      const response = await jsonAxios.post("/auth/login", {
        loginId,
        password,
      });
      console.log("response", response.data);
      await AsyncStorage.setItem("token", response.data.access_token);
      // await AsyncStorage.setItem(
      //   "refreshtoken",
      //   JSON.stringify(response.data.refresh_token)
      // );
      await AsyncStorage.setItem("refreshtoken", response.data.refresh_token);
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      console.log(
        'stored',
        await AsyncStorage.getItem('token'),
        await AsyncStorage.getItem('refreshtoken')
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(payload: {
    userData: { phone: string; email: string; password: string };
  }) {
    try {
      const response = await jsonAxios.post("/auth/register", payload);
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
      // router.replace("/auth/signIn" as any);
      redirectToPage(containers.signInScreen);
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
