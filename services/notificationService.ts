// services/notificationService.ts

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { jsonAxios, API_BASE_URL } from "./axiosConfig";
import colors from "@/constants/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getNotificationsApiUrl = () =>
  API_BASE_URL ? `${String(API_BASE_URL).replace(/\/$/, "")}/web-push/notifications` : "/web-push/notifications";

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
/** Web: IDs of API-sourced notifications marked as read (so badge count includes them as read). */
const READ_API_IDS_KEY = "@app_notifications_read_api_ids";
/** Web: last known unread count when API succeeded (so badge doesn't disappear on remount/failure). */
const LAST_UNREAD_COUNT_KEY = "@app_notifications_last_unread_count";
/** Web: IDs of API-sourced notifications that user deleted (hide from list). */
const DELETED_API_IDS_KEY = "@app_notifications_deleted_api_ids";

export class NotificationService {
  static readonly storageKeys = {
    notifications: NOTIFICATIONS_STORAGE_KEY,
    readApiIds: READ_API_IDS_KEY,
    lastUnreadCount: LAST_UNREAD_COUNT_KEY,
    deletedApiIds: DELETED_API_IDS_KEY,
    webPushRegistered: "web_push_registered",
  };

  static async clearNotificationCache(options?: {
    includeApiState?: boolean;
    includeWebPushRegistration?: boolean;
  }): Promise<void> {
    const includeApiState = options?.includeApiState ?? true;
    const includeWebPushRegistration =
      options?.includeWebPushRegistration ?? true;

    const keysToRemove = [
      this.storageKeys.notifications,
      this.storageKeys.lastUnreadCount,
    ];

    if (includeApiState) {
      keysToRemove.push(
        this.storageKeys.readApiIds,
        this.storageKeys.deletedApiIds
      );
    }

    if (includeWebPushRegistration) {
      keysToRemove.push(this.storageKeys.webPushRegistered);
    }

    try {
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error("Error clearing notification cache:", error);
    }
  }

  static async clearTransientNotificationCache(): Promise<void> {
    await this.clearNotificationCache({
      includeApiState: false,
      includeWebPushRegistration: false,
    });
  }

  /** IDs of API-sourced notifications marked as read (web and mobile). */
  static async getReadApiIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(READ_API_IDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** IDs of API-sourced notifications user deleted (exclude from list) (web and mobile). */
  static async getDeletedApiIds(): Promise<string[]> {
    try {
      const raw = await AsyncStorage.getItem(DELETED_API_IDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** Extract notifications array from various backend response shapes. */
  static getNotificationsFromResponse(data: unknown): Array<{ _id: string; title?: string; body?: string; data?: Record<string, unknown>; createdAt?: string }> {
    if (!data || typeof data !== "object") return [];
    const d = data as Record<string, unknown>;
    if (Array.isArray(d)) return d as Array<{ _id: string; title?: string; body?: string; data?: Record<string, unknown>; createdAt?: string }>;
    const inner = d.data;
    const arr =
      d.notifications ??
      (typeof inner === "object" && inner !== null && !Array.isArray(inner) ? (inner as Record<string, unknown>).notifications : null) ??
      (Array.isArray(inner) ? inner : null) ??
      d.list ??
      d.items;
    return Array.isArray(arr) ? (arr as Array<{ _id: string; title?: string; body?: string; data?: Record<string, unknown>; createdAt?: string }>) : [];
  }

  /** Deduplicate order notifications: same order can come from local + API. Keep one per order, prefer api- id. */
  static deduplicateOrderNotifications(items: NotificationItem[]): NotificationItem[] {
    const orderKey = (item: NotificationItem) => {
      const o = item.data?.orderNumber ?? item.data?.orderId ?? item.data?.order_number ?? item.data?.order_id;
      return o != null ? `order:${String(o)}` : null;
    };
    const byOrderKey = new Map<string, NotificationItem[]>();
    const noKey: NotificationItem[] = [];
    for (const item of items) {
      const key = orderKey(item);
      if (key) {
        const arr = byOrderKey.get(key) ?? [];
        arr.push(item);
        byOrderKey.set(key, arr);
      } else {
        noKey.push(item);
      }
    }
    const result: NotificationItem[] = [...noKey];
    byOrderKey.forEach((group) => {
      const apiOne = group.find((x) => x.id.startsWith("api-"));
      result.push(apiOne ?? group[0]);
    });
    return result.sort((a, b) => b.timestamp - a.timestamp);
  }

  static async fetchNotificationsFresh(): Promise<NotificationItem[]> {
    const { data } = await jsonAxios.get(getNotificationsApiUrl());
    const rawList = this.getNotificationsFromResponse(data);

    if (rawList.length === 0) {
      await this.clearNotificationCache();
      return [];
    }

    const [readApiIds, deletedApiIds] = await Promise.all([
      this.getReadApiIds(),
      this.getDeletedApiIds(),
    ]);

    const validApiIds = new Set(rawList.map((item) => "api-" + item._id));
    const prunedReadApiIds = readApiIds.filter((id) => validApiIds.has(id));
    const prunedDeletedApiIds = deletedApiIds.filter((id) => validApiIds.has(id));

    if (prunedReadApiIds.length !== readApiIds.length) {
      await AsyncStorage.setItem(READ_API_IDS_KEY, JSON.stringify(prunedReadApiIds));
    }

    if (prunedDeletedApiIds.length !== deletedApiIds.length) {
      await AsyncStorage.setItem(
        DELETED_API_IDS_KEY,
        JSON.stringify(prunedDeletedApiIds)
      );
    }

    await AsyncStorage.removeItem(NOTIFICATIONS_STORAGE_KEY);

    return rawList
      .filter((n) => n && n._id && !prunedDeletedApiIds.includes("api-" + n._id))
      .map((n) => ({
        id: "api-" + n._id,
        title: n.title ?? "",
        body: n.body ?? "",
        data: n.data ?? {},
        timestamp: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
        isRead: prunedReadApiIds.includes("api-" + n._id),
        type: (n.data?.type as string) || "general",
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

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
      if (Platform.OS === "web" && typeof console !== "undefined") {
        console.log("[NotificationService] Saved notification to storage, total:", updated.length);
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      if (notificationId.startsWith("api-")) {
        const raw = await AsyncStorage.getItem(READ_API_IDS_KEY);
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (!ids.includes(notificationId)) {
          ids.push(notificationId);
          await AsyncStorage.setItem(READ_API_IDS_KEY, JSON.stringify(ids));
        }
        await AsyncStorage.removeItem(LAST_UNREAD_COUNT_KEY);
        return;
      }
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
      try {
        const rawList = await this.fetchNotificationsFresh();
        const apiIds = rawList.map((n) => n.id);
        if (apiIds.length > 0) {
          const raw = await AsyncStorage.getItem(READ_API_IDS_KEY);
          const ids: string[] = raw ? JSON.parse(raw) : [];
          const combined = [...new Set([...ids, ...apiIds])];
          await AsyncStorage.setItem(READ_API_IDS_KEY, JSON.stringify(combined));
        }
        await AsyncStorage.setItem(LAST_UNREAD_COUNT_KEY, "0");
      } catch {
        // Ignore API mark-all sync failures; local read state still updates.
      }
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
    await this.clearNotificationCache();
  }

  /** Clear all notification-related storage on logout. */
  static async clearAllForLogout(): Promise<void> {
    await this.clearNotificationCache();
  }

  // Get unread count (web and mobile: include API-sourced notifications and read state for api-* ids)
  static async getUnreadCount(): Promise<number> {
    try {
      const list = await this.fetchNotificationsFresh();
      const count = list.filter((n) => !n.isRead).length;
      await AsyncStorage.setItem(LAST_UNREAD_COUNT_KEY, String(count));
      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  // Delete single notification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      if (notificationId.startsWith("api-")) {
        const raw = await AsyncStorage.getItem(DELETED_API_IDS_KEY);
        const ids: string[] = raw ? JSON.parse(raw) : [];
        if (!ids.includes(notificationId)) {
          ids.push(notificationId);
          await AsyncStorage.setItem(DELETED_API_IDS_KEY, JSON.stringify(ids));
        }
        await AsyncStorage.removeItem(LAST_UNREAD_COUNT_KEY);
        return;
      }
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
      // console.log("Push notifications not supported on web");
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
        // console.log("❌ Permission not granted for notifications");
        return null;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "aea6cfd3-263e-485d-b179-a859b7197f9e",
        })
      ).data;

      // console.log("✅ Push token obtained:", token);

      if (token) {
        try {
          await jsonAxios.post(`/notifications/pushToken`, {
            userId,
            token,
          });
          // console.log("✅ Token registered with backend");
        } catch (error) {
          console.error("❌ Error registering push token:", error);
        }
      }
    } else {
      // console.log("⚠️ Must use physical device for Push Notifications");
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
    data: Record<string, unknown> = {}
  ) {
    if (Platform.OS === "web") {
      // console.log("Local notifications not supported on web");
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
