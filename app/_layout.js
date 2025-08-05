import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import SplashScreen from "../app/components/commonComponents/SplashScreen";
import containers from "../containers";
import { AppProvider, useAppContext } from "../context/AppContext";
import { NotificationService } from "@/services/notificationService";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { StripeProvider } from "@stripe/stripe-react-native";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import CustomToastAlert from "../app/components/commonComponents/CustomToastAlert";
import BiometricAuth from "../app/components/Biometriauth";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// Notifications setup
function NotificationsHandler() {
  useEffect(() => {
    const initializeNotifications = async () => {
      const user = await authService.getCurrentUser();
      if (user?.id) {
        await NotificationService.registerForPushNotificationsAsync(
          user.id.toString()
        );

        const subscription = await NotificationService.subscribeToNotifications(
          (notification) => {
            console.log("Notification received:", notification);
          }
        );

        const responseSubscription =
          await NotificationService.handleNotificationResponse((response) => {
            const data = response.notification.request.content.data;
            console.log("User interacted with notification:", data);
          });

        return () => {
          subscription.remove();
          responseSubscription.remove();
        };
      }
    };

    initializeNotifications();
  }, []);

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
    <StripeProvider publishableKey={stripePublishableKey}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppProvider>
            <AuthProvider>
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
            </AuthProvider>
          </AppProvider>
        </PersistGate>
      </Provider>
    </StripeProvider>
  );
}
