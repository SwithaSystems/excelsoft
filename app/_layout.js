// app/_layout.js

import React, { useEffect, useState } from "react";
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
import { DeviceEventEmitter } from "react-native";

// Notifications setup
function NotificationsHandler() {
  const { user } = useAuth();

  useEffect(() => {
    const initializeNotifications = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser?.id) {
        await NotificationService.registerForPushNotificationsAsync(
          currentUser.id.toString()
        );

        // Handle notification received while app is OPEN
        const subscription = await NotificationService.subscribeToNotifications(
          async (notification) => {
            console.log("Notification received:", notification);

            // Save notification to storage
            const notificationItem = {
              id: notification.request.identifier,
              title: notification.request.content.title || "Notification",
              body: notification.request.content.body || "",
              data: notification.request.content.data,
              timestamp: Date.now(),
              isRead: false,
              type: notification.request.content.data?.type || "general",
            };

            await NotificationService.saveNotification(notificationItem);

            // Emit event to update badge
            DeviceEventEmitter.emit("notificationUpdate");

            // Show toast
            Toast.show({
              type: "customToast",
              text1: notification.request.content.title,
              text2: notification.request.content.body,
              onPress: async () => {
                await NotificationService.markAsRead(notificationItem.id);
                DeviceEventEmitter.emit("notificationUpdate");
                const data = notification.request.content.data;
                handleNotificationNavigation(data);
              },
            });
          }
        );

        // Handle notification TAP (app was closed/background)
        const responseSubscription =
          await NotificationService.handleNotificationResponse(
            async (response) => {
              const notification = response.notification;
              const data = notification.request.content.data;

              console.log("User tapped notification:", data);

              // Save if not already saved and mark as read
              const notificationItem = {
                id: notification.request.identifier,
                title: notification.request.content.title || "Notification",
                body: notification.request.content.body || "",
                data: data,
                timestamp: Date.now(),
                isRead: true, // Mark as read since user tapped it
                type: data?.type || "general",
              };

              await NotificationService.saveNotification(notificationItem);
              DeviceEventEmitter.emit("notificationUpdate");

              // Navigate
              handleNotificationNavigation(data);
            }
          );

        // Check if app was opened from a notification
        const initialNotification =
          await Notifications.getLastNotificationResponseAsync();
        if (initialNotification) {
          const data = initialNotification.notification.request.content.data;
          console.log("App opened from notification:", data);

          setTimeout(() => {
            handleNotificationNavigation(data);
          }, 1000);
        }

        return () => {
          subscription.remove();
          responseSubscription.remove();
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

        if (!res.data?.stripePublishableKey) {
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
      urlScheme="yourapp"
      merchantIdentifier="merchant.com.yourapp"
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
