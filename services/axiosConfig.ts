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

// Track if a refresh is in progress to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};
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
        console.log("Token before setting", token);
        // const refreshToken = await AsyncStorage.getItem("refreshtoken");
        await AsyncStorage.setItem("token", "expired");
        console.log("Token after setting", token);
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
      // const originalRequest = error.config;
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const status = error.response?.status;

      console.log("=== Axios Error Interceptor ===");
      console.log("Error:", error);
      console.log("Status:", status);
      console.log("Config:", originalRequest);
      console.log("Response:", error.response);
      // Handle 401 Unauthorized errors
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        // Check if this API should be excluded from token refresh
        const isExcluded = EXCLUDED_APIS.some((url) =>
          originalRequest.url?.includes(url)
        );

        if (isExcluded) {
          return Promise.reject(error);
        }

        if (isRefreshing) {
          // If refresh is already in progress, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await AsyncStorage.getItem("refreshtoken");
          console.log("refreshToken after 401", refreshToken);

          if (!refreshToken) {
            throw new Error("Refresh token not available.");
          }

          // Create a new axios instance for the refresh request to avoid interceptor conflicts
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/auth/refresh-token`,
            {},
            {
              headers: { Authorization: `Bearer ${refreshToken}` },
              timeout: 10000,
            }
          );
          console.log("refreshResponse", refreshResponse.data);
          const newAccessToken = refreshResponse.data.access_token;
          const newRefreshToken = refreshResponse.data.refresh_token;

          console.log("newAccessToken", newAccessToken);

          // Store the new tokens
          await AsyncStorage.setItem("token", newAccessToken);
          if (newRefreshToken) {
            await AsyncStorage.setItem("refreshtoken", newRefreshToken);
          }

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Process the queue with the new token
          processQueue(null, newAccessToken);

          isRefreshing = false;

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.log("Token refresh failed:", refreshError);

          // Process the queue with error
          processQueue(refreshError, null);
          isRefreshing = false;

          // Token refresh failed → logout
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("refreshtoken");
          await AsyncStorage.removeItem("user");

          // Redirect to login
          redirectToPage(containers.signInScreen);

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
