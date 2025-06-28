import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import SplashScreen from "../components/commonComponents/SplashScreen";
import containers from "../containers";
import { AppProvider, useAppContext } from "../context/AppContext";
import { NotificationService } from "@/services/notificationService";
import { AuthProvider } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { StripeProvider } from "@stripe/stripe-react-native";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import CustomToastAlert from "../components/commonComponents/CustomToastAlert";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import BiometricAuth from "../components/Biometriauth"; // Import your BiometricAuth component
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Component to handle notifications
function NotificationsHandler() {
  useEffect(() => {
    // Initialize notifications when the app starts
    const initializeNotifications = async () => {
      const user = await authService.getCurrentUser();
      if (user?.id) {
        await NotificationService.registerForPushNotificationsAsync(
          user.id.toString()
        );

        // Set up notification listeners
        const subscription = await NotificationService.subscribeToNotifications(
          (notification) => {
            console.log("Notification received:", notification);
          }
        );

        const responseSubscription =
          await NotificationService.handleNotificationResponse((response) => {
            const data = response.notification.request.content.data;
            console.log("User interacted with notification:", data);

            // Handle notification response based on data
            if (data?.orderId) {
              // Handle navigation to order details
            }
          });

        // Clean up subscriptions on unmount
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
      // Check if user has enabled biometric authentication
      const biometricEnabled = await SecureStore.getItemAsync(
        "biometric_enabled"
      );

      // Require biometric auth if:
      // 1. User is logged in
      // 2. User has enabled biometric authentication
      if (user && biometricEnabled === "true") {
        setIsBiometricEnabled(true);
        setIsBiometricAuthenticated(false);
      } else {
        setIsBiometricEnabled(false);
        setIsBiometricAuthenticated(true); // Skip biometric auth
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
    // No backend verification required – simply mark as authenticated
    setIsBiometricAuthenticated(true);
    // Toast.show({
    //   type: "success",
    //   text1: "Authentication Successful",
    //   text2: "Welcome back!",
    // });
  };
  const handleBiometricAuthFailure = (error) => {
    console.error("Biometric authentication failed:", error);
    Toast.show({
      type: "error",
      text1: "Authentication Failed",
      text2: error,
    });
  };

  // Show loading while checking biometric settings
  if (isCheckingBiometric) {
    return <SplashScreen />;
  }

  // Show biometric authentication if enabled and not authenticated
  if (isBiometricEnabled && !isBiometricAuthenticated) {
    return (
      <BiometricAuth
        onAuthSuccess={handleBiometricAuthSuccess}
        onAuthFailure={handleBiometricAuthFailure}
      />
    );
  }

  // Return normal app content
  return children;
}

const LayoutContent = () => {
  const { isLoading } = useAppContext();

  return (
    <>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <BiometricAuthWrapper>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name={containers.splashScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="index" options={{ title: "ExcelSoft" }} />
            <Stack.Screen
              name={containers.homeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.searchScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.productDetailScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.searchResultsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.searchSuggesionsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.welcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.signInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.catagoryScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.reviewsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.userReviewScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.cartScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.pickUpModescreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.pickupScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.storePickUpScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.curbsidePickupScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.homeDeliveryScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.orderSummeryScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.paymentScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.paymentSaveCardScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.billingAddressScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.orderSuccessfulScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.deliveryTrackingScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.offersScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.welcomeScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.signUpScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.mailVerificationScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.resedMailScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.verifcationScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.passwordResetScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.verifyUserScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.forgotPasswordScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.userProfileScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.editProfileScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.editAccountInformationscreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.changePasswordScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.notificationsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.customerSupportScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.myOrderScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.orderDetailsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.savedItemScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.savedAddressScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.editAddressScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.allPaymentsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.updateCardDetailsScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.addNewPaymentScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.feedBackScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.dashBoardScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.filterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminSeeAllOrdersScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminOrderDetailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminProductDashboardScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminProductUpdationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminStoreInformationScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminOrderQRScanScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.categoriesScreeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.NotificationListingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.returnOrderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AppReviewScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.cancelOrderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.replaceOrderScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.addAddressScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.selectBillingAddressScreenScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.AdminCategoriesScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.UserNotificationsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name={containers.biometricSettingsScreen}
              options={{ headerShown: false }}
            />
          </Stack>
        </BiometricAuthWrapper>
      )}
    </>
  );
};

export default function Layout() {
  return (
    <StripeProvider publishableKey="pk_test_51R964dE2THJkmBnHVkIykpypErffxTtnzoitEUsS0MOdtf2mUCqpARkTLpxXdyoRUxP8yXwzlHN8EZBlUZMlDsg000rsEfx2De">
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
