import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const EXCLUDED_APIS = [
  "/twilio/SendOtp",
  "/twilio/verifyOtp",
  "/products/category",
  "/products",
  "/products/subCategories",
  "/products/search",
  "/categories",
];
// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token", token);
      const isExcluded = EXCLUDED_APIS.some((url) => config.url?.includes(url));
      if (token && !isExcluded) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log("config", config.headers.Authorization);
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && originalRequest) {
      try {
        // Remove token and user data
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");

        // Redirect to login (you'll need to implement this based on your navigation setup)
        // For example: router.replace('/signIn');

        return Promise.reject(error);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout. Please try again."));
    }

    // Handle network errors
    if (error.message === "Network Error") {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
