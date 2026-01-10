// services/notificationService.ts

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { jsonAxios } from "./axiosConfig";
import colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Only configure on mobile platforms
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data: any;
  timestamp: number;
  isRead: boolean;
  type: string;
}

const NOTIFICATIONS_STORAGE_KEY = "@app_notifications";

export class NotificationService {
  // Get all stored notifications
  static async getStoredNotifications(): Promise<NotificationItem[]> {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting stored notifications:", error);
      return [];
    }
  }

  // Save notification to local storage
  static async saveNotification(notification: NotificationItem): Promise<void> {
    try {
      const existing = await this.getStoredNotifications();
      const updated = [notification, ...existing];
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.map((notif) =>
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
  static async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.map((notif) => ({
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
      return notifications.filter((n) => !n.isRead).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Delete single notification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.filter((n) => n.id !== notificationId);
      await AsyncStorage.setItem(
        NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }

  static async registerForPushNotificationsAsync(userId: string) {
    // Skip on web platform
    if (Platform.OS === "web") {
      console.log("Push notifications not supported on web");
      return null;
    }

    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: colors.secondaryRed,
        sound: "default",
        enableVibrate: true,
        showBadge: true,
        enableLights: true,
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
        console.log("❌ Permission not granted for notifications");
        return null;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "aea6cfd3-263e-485d-b179-a859b7197f9e",
        })
      ).data;

      console.log("✅ Push token obtained:", token);

      if (token) {
        try {
          await jsonAxios.post(`/notifications/pushToken`, {
            userId,
            token,
          });
          console.log("✅ Token registered with backend");
        } catch (error) {
          console.error("❌ Error registering push token:", error);
        }
      }
    } else {
      console.log("⚠️ Must use physical device for Push Notifications");
    }

    return token;
  }

  static async unregisterPushNotifications(userId: string) {
    if (Platform.OS === "web") {
      return true;
    }

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
        data: {
          type: "order_status",
          orderId: orderId,
          screen: "OrderDetails",
        },
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
        data: {
          type: "order_delivery",
          orderId: orderId,
          screen: "OrderDetails",
        },
      });
      return true;
    } catch (error) {
      console.error("Error sending delivery update:", error);
      return false;
    }
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    data: any = {}
  ) {
    if (Platform.OS === "web") {
      console.log("Local notifications not supported on web");
      return false;
    }

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
    if (Platform.OS === "web") {
      return { remove: () => {} };
    }
    return Notifications.addNotificationReceivedListener(onNotification);
  }

  static async handleNotificationResponse(
    onResponse: (response: Notifications.NotificationResponse) => void
  ) {
    if (Platform.OS === "web") {
      return { remove: () => {} };
    }
    return Notifications.addNotificationResponseReceivedListener(onResponse);
  }
}
