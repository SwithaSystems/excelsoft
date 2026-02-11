// app/_layout.js

import React, { useEffect, useState, useRef } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import SplashScreen from "../app/components/commonComponents/SplashScreen";
import containers from "../containers";
import { AppProvider, useAppContext } from "../context/AppContext";
import { NotificationService } from "@/services/notificationService";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { RoleProvider } from "../context/RoleContext";
import { authService } from "../services/auth.service";
import { StripeProvider } from "@stripe/stripe-react-native";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import CustomToastAlert from "../app/components/commonComponents/CustomToastAlert";
import BiometricAuth from "../app/components/Biometriauth";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import axios from "axios";
import { handleNotificationNavigation } from "@/services/navigationService";
import { DeviceEventEmitter, AppState, Platform } from "react-native";

// Only configure notification handler on mobile platforms
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Notifications setup
function NotificationsHandler() {
  const { user } = useAuth();
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);

  // Web only: listen for push payloads from the service worker so the in-app list updates
  useEffect(() => {
    if (Platform.OS !== "web" || typeof navigator === "undefined" || !navigator.serviceWorker) return;
    console.log("[Layout] Web: added service worker message listener for PUSH_PAYLOAD");
    const onMessage = async (event) => {
      if (event.data?.type !== "PUSH_PAYLOAD") return;
      console.log("[Layout] PUSH_PAYLOAD received from service worker", event.data.payload);
      const { title, body, data } = event.data.payload || {};
      const notificationItem = {
        id: "web-push-" + Date.now(),
        title: title || "Notification",
        body: body || "",
        data: data || {},
        timestamp: Date.now(),
        isRead: false,
        type: (data && data.type) || "general",
      };
      await NotificationService.saveNotification(notificationItem);
      if (DeviceEventEmitter && DeviceEventEmitter.emit) {
        DeviceEventEmitter.emit("notificationUpdate");
      }
      console.log("[Layout] Notification saved and notificationUpdate emitted");
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    // Skip Expo notification listeners on web (web uses service worker + message above)
    if (Platform.OS === "web") return;

    const initializeNotifications = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser?.id) {
        await NotificationService.registerForPushNotificationsAsync(
          currentUser.id.toString()
        );

        // Handle notification received
        notificationListener.current =
          Notifications.addNotificationReceivedListener(
            async (notification) => {
              // console.log("📱 Notification received:", notification);

              const notificationItem = {
                id: notification.request.identifier,
                title: notification.request.content.title || "Notification",
                body: notification.request.content.body || "",
                data: notification.request.content.data,
                timestamp: Date.now(),
                isRead: false,
                type:
                  (notification.request.content.data &&
                    notification.request.content.data.type) ||
                  "general",
              };

              await NotificationService.saveNotification(notificationItem);
              DeviceEventEmitter.emit("notificationUpdate");

              if (appState.current === "active") {
                Toast.show({
                  type: "customToast",
                  text1: notification.request.content.title,
                  text2: notification.request.content.body,
                  visibilityTime: 4000,
                  autoHide: true,
                  topOffset: 50,
                  onPress: async () => {
                    await NotificationService.markAsRead(notificationItem.id);
                    DeviceEventEmitter.emit("notificationUpdate");
                    handleNotificationNavigation(
                      notification.request.content.data
                    );
                  },
                });
              }
            }
          );

        // Handle notification tap
        responseListener.current =
          Notifications.addNotificationResponseReceivedListener(
            async (response) => {
              // console.log("👆 User tapped notification:", response);

              const notification = response.notification;
              const data = notification.request.content.data;

              const notificationItem = {
                id: notification.request.identifier,
                title: notification.request.content.title || "Notification",
                body: notification.request.content.body || "",
                data: data,
                timestamp: Date.now(),
                isRead: true,
                type: (data && data.type) || "general",
              };

              await NotificationService.saveNotification(notificationItem);
              DeviceEventEmitter.emit("notificationUpdate");

              setTimeout(() => {
                handleNotificationNavigation(data);
              }, 500);
            }
          );

        // Check if app was opened from a notification
        const initialNotification =
          await Notifications.getLastNotificationResponseAsync();
        if (initialNotification) {
          // console.log("🚀 App opened from notification:", initialNotification);
          const data = initialNotification.notification.request.content.data;

          setTimeout(() => {
            handleNotificationNavigation(data);
          }, 1500);
        }

        // Track app state changes
        const subscription = AppState.addEventListener(
          "change",
          (nextAppState) => {
            appState.current = nextAppState;
            // console.log("App state changed to:", nextAppState);
          }
        );

        return () => {
          if (notificationListener.current) {
            try {
              notificationListener.current.remove();
            } catch (error) {
              console.warn("Error removing notification listener:", error);
            }
          }
          if (responseListener.current) {
            try {
              responseListener.current.remove();
            } catch (error) {
              console.warn("Error removing response listener:", error);
            }
          }
          subscription?.remove();
        };
      }
    };

    initializeNotifications();
  }, [user]);

  return null;
}

// Biometric Wrapper
function BiometricAuthWrapper({ children }) {
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] =
    useState(false);
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkBiometricSettings();
  }, [user]);

  const checkBiometricSettings = async () => {
    try {
      // Skip biometrics on web
      if (Platform.OS === "web") {
        setIsBiometricEnabled(false);
        setIsBiometricAuthenticated(true);
        setIsCheckingBiometric(false);
        return;
      }

      const biometricEnabled = await SecureStore.getItemAsync(
        "biometric_enabled"
      );

      if (user && biometricEnabled === "true") {
        setIsBiometricEnabled(true);
        setIsBiometricAuthenticated(false);
      } else {
        setIsBiometricEnabled(false);
        setIsBiometricAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking biometric settings:", error);
      setIsBiometricEnabled(false);
      setIsBiometricAuthenticated(true);
    } finally {
      setIsCheckingBiometric(false);
    }
  };

  const handleBiometricAuthSuccess = async () => {
    setIsBiometricAuthenticated(true);
  };

  const handleBiometricAuthFailure = (error) => {
    console.error("Biometric authentication failed:", error);
    Toast.show({
      type: "error",
      text1: "Authentication Failed",
      text2: error,
    });
  };

  if (isCheckingBiometric) {
    return <SplashScreen />;
  }

  if (isBiometricEnabled && !isBiometricAuthenticated) {
    return (
      <BiometricAuth
        onAuthSuccess={handleBiometricAuthSuccess}
        onAuthFailure={handleBiometricAuthFailure}
      />
    );
  }

  return children;
}

// Main layout content
function LayoutContent() {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <BiometricAuthWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </BiometricAuthWrapper>
  );
}

// Default exported layout
export default function Layout() {
  const [stripePublishableKey, setStripePublishableKey] = useState(null);
  const clientId = "client_abc";

  useEffect(() => {
    const fetchStripeConfig = async () => {
      try {
        const res = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/stripe-config/${clientId}`
        );

        if (!res.data || !res.data.stripePublishableKey) {
          console.error("No publishable key in response:", res.data);
          return;
        }

        setStripePublishableKey(res.data.stripePublishableKey);
      } catch (error) {
        console.error("Failed to fetch Stripe config", error);
      }
    };

    fetchStripeConfig();
  }, []);

  if (!stripePublishableKey) {
    return <SplashScreen />;
  }

  return (
    <StripeProvider
      publishableKey={stripePublishableKey}
      urlScheme="excelsoft"
      merchantIdentifier="merchant.com.excelsoft.app"
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppProvider>
            <AuthProvider>
              <RoleProvider>
                <NotificationsHandler />
                <LayoutContent />
                <Toast
                  config={{
                    customToast: ({ text1, text2, onPress }) => (
                      <CustomToastAlert
                        text1={text1}
                        text2={text2}
                        onPress={onPress}
                      />
                    ),
                  }}
                />
              </RoleProvider>
            </AuthProvider>
          </AppProvider>
        </PersistGate>
      </Provider>
    </StripeProvider>
  );
}
