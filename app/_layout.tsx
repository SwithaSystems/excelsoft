import React from "react";
import { Stack } from "expo-router";
import { NotificationService } from "../services/notificationService";
import { useAuth, AuthProvider } from "../hooks/useAuth";

// Component to handle notifications
function NotificationsHandler() {
  const { user } = useAuth();

  React.useEffect(() => {
    // Initialize notifications when the app starts
    const initializeNotifications = async () => {
      if (user?.id) {
        await NotificationService.registerForPushNotificationsAsync(user.id);

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
            // For example, navigate to order details if notification is about an order
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
  }, [user?.id]);

  return null;
}

export default function Layout() {
  return (
    <AuthProvider>
      <NotificationsHandler />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
