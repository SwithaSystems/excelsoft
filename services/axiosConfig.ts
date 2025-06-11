import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

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

// Create axios instance with support for both JSON and FormData
const createAxiosInstance = (contentType: "json" | "formdata" = "json") => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type":
        contentType === "json" ? "application/json" : "multipart/form-data",
    },
  });

  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token", token);
        // const refreshToken = await AsyncStorage.getItem("refreshtoken");
        // console.log("refreshtoken", refreshToken);
        const isExcluded = EXCLUDED_APIS.some((url) =>
          config.url?.includes(url)
        );

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
          const refreshToken = await AsyncStorage.getItem("refreshtoken");
          if (!refreshToken) {
            throw new Error("Refresh token not available.");
          }
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
            }
          );

          const newAccessToken = refreshResponse.data.token;
          console.log("newAccessToken", newAccessToken);

          await AsyncStorage.setItem("token", newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Token refresh failed → logout
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("refresh_token");
          await AsyncStorage.removeItem("user");
          redirectToPage(containers.signInScreen);
          // router.replace("../auth/signIn");
          return Promise.reject(refreshError);
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

  return axiosInstance;
};

// Export two instances: one for JSON and one for FormData
export const jsonAxios = createAxiosInstance("json");
export const formDataAxios = createAxiosInstance("formdata");

export default createAxiosInstance;
