import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
// console.log(
//   "Environment Variable EXPO_PUBLIC_API_URL:",
//   process.env.EXPO_PUBLIC_API_URL
// );
// console.log("Using API_BASE_URL:", API_BASE_URL);
const EXCLUDED_APIS = [
  "/twilio/SendOtp",
  "/twilio/verifyOtp",
  "/products/category",
  "/products/subCategories",
  "/products/search",
  "/categories",
  "/auth/login",
  "/auth/register",
"/promotions/live/all"

];

// Track if a refresh is in progress to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Track last token refresh time to prevent excessive refreshing
let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL = 60000; // 1 minute minimum between refreshes

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

// Decode JWT token to check expiry
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token is close to expiry (within 24 hours)
const isTokenNearExpiry = (
  token: string,
  bufferTime: number = 24 * 60 * 60
) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = decoded.exp - currentTime;

  return timeUntilExpiry <= bufferTime;
};

const proactiveTokenRefresh = async (token: string) => {
  if (isRefreshing) return token;

  const now = Date.now();
  if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
    return token; // Too soon to refresh again
  }

  if (!isTokenNearExpiry(token)) {
    return token; // Token is still valid for a while
  }

  // console.log("Proactively refreshing token...");
  isRefreshing = true;
  lastRefreshTime = now;

  try {
    const refreshToken = await SecureStore.getItemAsync("refreshtoken");
    if (!refreshToken) {
      throw new Error("Refresh token not available.");
    }

    const refreshResponse = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
        timeout: 10000,
      }
    );

    const newAccessToken = refreshResponse.data.access_token;
    const newRefreshToken = refreshResponse.data.refresh_token;

    await SecureStore.setItemAsync("token", newAccessToken);
    if (newRefreshToken) {
      await SecureStore.setItemAsync("refreshtoken", newRefreshToken);
    }

    // console.log("Token proactively refreshed successfully");
    isRefreshing = false;
    return newAccessToken;
  } catch (error) {
    // console.log("Proactive token refresh failed:", error);
    isRefreshing = false;
    return token; // Return original token if refresh fails
  }
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
        let token = await SecureStore.getItemAsync("token");
        // // console.log("Token before setting", token);
        // const refreshToken = await AsyncStorage.getItem("refreshtoken");
        // await AsyncStorage.setItem("token", "expired");
        // // console.log("Token after setting", token);
        const isExcluded = EXCLUDED_APIS.some((url) =>
          config.url?.includes(url)
        );

        if (token && !isExcluded) {
          // Proactively refresh token if it's close to expiry
          token = await proactiveTokenRefresh(token);
          config.headers.Authorization = `Bearer ${token}`;
        }

        // console.log(
        //   "Request config:",
        //   config.url,
        //   config.headers.Authorization ? "with token" : "without token"
        // );
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
      // Check if server sent a new token in response headers
      const newToken = response.headers["x-new-token"];
      if (newToken) {
        try {
          SecureStore.setItemAsync("token", newToken);
        } catch (error) {
          console.error("SecureStore setItem error:", error);
        }
      }
      return response;
    },
    async (error: AxiosError) => {
      // const originalRequest = error.config;
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
        _retryCount?: number;
      };

      const status = error.response?.status;

      // console.log("=== Axios Error Interceptor ===");
      // console.log("Error:", error);
      // console.log("Status:", status);
      // console.log("Config:", originalRequest);
      // console.log("Response:", error.response);

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && error.config) {
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

        // originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await SecureStore.getItemAsync("refreshtoken");
          // console.log("refreshToken after 401", refreshToken);

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
          // console.log("refreshResponse", refreshResponse.data);
          const newAccessToken = refreshResponse.data.access_token;
          const newRefreshToken = refreshResponse.data.refresh_token;

          // console.log("newAccessToken", newAccessToken);

          // Store the new tokens
          try {
            await SecureStore.setItemAsync("token", newAccessToken);
            if (newRefreshToken) {
              await SecureStore.setItemAsync("refreshtoken", newRefreshToken);
            }
          } catch (error) {
            console.error("SecureStore setItem error:", error);
          }

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // Process the queue with the new token
          processQueue(null, newAccessToken);
          isRefreshing = false;
          lastRefreshTime = Date.now();
          // console.log(
          //   "Token refreshed successfully, retrying original request"
          // );

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError: any) {
          // console.log("Token refresh failed:", refreshError);

          processQueue(refreshError, null);
          isRefreshing = false;

          // Only logout if refresh token is also invalid
          if (
            refreshError.response?.status === 401 ||
            refreshError.response?.status === 403
          ) {
            try {
              await Promise.all([
                SecureStore.deleteItemAsync("token"),
                SecureStore.deleteItemAsync("refreshtoken"),
                SecureStore.deleteItemAsync("user"),
              ]);
            } catch (error) {
              console.error("SecureStore deleteItem error:", error);
            }
            redirectToPage(containers.signInScreen);
          }

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
