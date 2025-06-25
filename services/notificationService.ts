import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
// import axiosInstance from "./axiosConfig";
import { jsonAxios } from "./axiosConfig";
import colors from "@/app/config/colors";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async registerForPushNotificationsAsync(userId: string) {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.deepBlueRed,
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return null;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "aea6cfd3-263e-485d-b179-a859b7197f9e",
        })
      ).data;

      // Register token with backend
      if (token) {
        try {
          await jsonAxios.post(`/notifications/pushToken`, {
            userId,
            token,
          });
        } catch (error) {
          console.error("Error registering push token:", error);
        }
      }
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  }

  static async unregisterPushNotifications(userId: string) {
    try {
      await jsonAxios.delete(`/notifications/pushToken/${userId}`);
      return true;
    } catch (error) {
      console.error("Error removing push token:", error);
      return false;
    }
  }

  static async sendOrderStatusUpdate(
    userId: string,
    orderId: string,
    status: string
  ) {
    try {
      await jsonAxios.post(`/notifications/orders/${userId}/status`, {
        orderId,
        status,
      });
      return true;
    } catch (error) {
      console.error("Error sending order status update:", error);
      return false;
    }
  }

  static async sendOrderDeliveryUpdate(
    userId: string,
    orderId: string,
    deliveryDate: string,
    timeSlot: string
  ) {
    try {
      await jsonAxios.post(`/notifications/orders/${userId}/delivery`, {
        orderId,
        deliveryDate,
        timeSlot,
      });
      return true;
    } catch (error) {
      console.error("Error sending delivery update:", error);
      return false;
    }
  }

  // Local notification methods
  static async scheduleLocalNotification(
    title: string,
    body: string,
    data: any = {}
  ) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: null,
      });
      return true;
    } catch (error) {
      console.error("Error scheduling local notification:", error);
      return false;
    }
  }

  static async subscribeToNotifications(
    onNotification: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(onNotification);
  }

  static async handleNotificationResponse(
    onResponse: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(onResponse);
  }
}
