import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
// import axiosInstance from "./axiosConfig";
import { jsonAxios } from "./axiosConfig";
import colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
const NOTIFICATIONS_STORAGE_KEY = "@app_notifications";

export class NotificationService {
  // Get all stored notifications
  static async getStoredNotifications() {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting stored notifications:", error);
      return [];
    }
  }

  // Save notification to local storage
  static async saveNotification(notification: any) {
    try {
      const existing = await this.getStoredNotifications();
      const updated = [notification, ...existing]; // New ones first
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.map((notif: any) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      );
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Mark all as read
  static async markAllAsRead() {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.map((notif: any) => ({
        ...notif,
        isRead: true,
      }));
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }

  // Clear all notifications
  static async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  }

  // Get unread count
  static async getUnreadCount(): Promise<number> {
    try {
      const notifications = await this.getStoredNotifications();
      return notifications.filter((n: any) => !n.isRead).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Delete single notification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.filter((n: any) => n.id !== notificationId);
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }
  static async registerForPushNotificationsAsync(userId: string) {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.secondaryRed,
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
      // console.log("Must use physical device for Push Notifications");
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
