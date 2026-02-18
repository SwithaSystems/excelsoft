// screens/UserNotificationsScreen.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  DeviceEventEmitter,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationService } from "@/services/notificationService";
import { jsonAxios } from "@/services/axiosConfig";
import colors from "@/constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { handleNotificationNavigation } from "@/services/navigationService";

const FOCUS_LOAD_THROTTLE_MS = 1200;

export default function UserNotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const lastFocusLoadRef = useRef<number>(0);

  useEffect(() => {
    if (typeof console !== "undefined") console.log("[UserNotifications] Screen mounted");
    return () => { if (typeof console !== "undefined") console.log("[UserNotifications] Screen unmounted"); };
  }, []);

  const loadNotifications = useCallback(async () => {
    if (typeof console !== "undefined") console.log("[UserNotifications] loadNotifications start");
    const stored = await NotificationService.getStoredNotifications();
    let list = stored ?? [];

    // Web only: fetch from backend (GET /web-push/notifications) and merge. Mobile uses only AsyncStorage above.
    if (Platform.OS === "web") {
      try {
        const [res, readApiIds] = await Promise.all([
          jsonAxios.get<{ notifications: Array<{ _id: string; title: string; body: string; data: Record<string, unknown>; createdAt: string }> }>("/web-push/notifications"),
          NotificationService.getReadApiIds(),
        ]);
        const data = res.data;
        const apiList = (data?.notifications ?? []).map((n) => ({
          id: "api-" + n._id,
          title: n.title,
          body: n.body,
          data: n.data ?? {},
          timestamp: new Date(n.createdAt).getTime(),
          isRead: readApiIds.includes("api-" + n._id),
          type: (n.data?.type as string) || "general",
        }));
        const seen = new Set(list.map((x) => x.id));
        for (const n of apiList) {
          if (!seen.has(n.id)) {
            seen.add(n.id);
            list.push(n);
          }
        }
        list.sort((a, b) => b.timestamp - a.timestamp);
      } catch (e) {
        if (typeof console !== "undefined") console.warn("[UserNotifications] API fetch failed:", e);
      }
    }

    if (typeof console !== "undefined") console.log("[UserNotifications] loaded", list.length, "notifications");
    setNotifications(list);
  }, []);

  // Throttle: on web, useFocusEffect can fire repeatedly and cause an infinite loop. Run load at most once per throttle window.
  useFocusEffect(
    useCallback(() => {
      const now = Date.now();
      if (now - lastFocusLoadRef.current < FOCUS_LOAD_THROTTLE_MS) return;
      lastFocusLoadRef.current = now;
      loadNotifications();
    }, [loadNotifications])
  );

  // When _layout saves a web push (or mobile receives a notification), refresh the list. Do NOT emit from loadNotifications.
  useEffect(() => {
    if (!DeviceEventEmitter?.addListener) return;
    const onUpdate = () => {
      lastFocusLoadRef.current = 0;
      loadNotifications();
    };
    const sub = DeviceEventEmitter.addListener("notificationUpdate", onUpdate);
    return () => sub.remove();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: any) => {
    // console.log(" Notification pressed:", JSON.stringify(notification, null, 2));
    
    await NotificationService.markAsRead(notification.id);
    await loadNotifications();
    if (DeviceEventEmitter?.emit) DeviceEventEmitter.emit("notificationUpdate");
    
    // Parse notification data - handle both object and string formats
    let notificationData = notification.data;
    
    // If data is a string, try to parse it
    if (typeof notificationData === 'string') {
      try {
        notificationData = JSON.parse(notificationData);
      } catch (e) {
        // console.log(" Could not parse notification data as JSON:", e);
      }
    }
    
    // If no data field, use the notification itself
    if (!notificationData) {
      notificationData = notification;
    }
    
    // Extract order information from various possible fields
    const normalizedData = {
      ...notificationData,
      // Try to find orderId or orderNumber in various places
      orderId: notificationData.orderId || notificationData.orderNumber || notificationData.order_id,
      orderNumber: notificationData.orderNumber || notificationData.orderNumber || notificationData.order_number,
      type: notificationData.type || notificationData.notificationType || 'orderUpdate',
    };
    
    // console.log(" Normalized notification data:", JSON.stringify(normalizedData, null, 2));
    // console.log("Navigating with data:", JSON.stringify(normalizedData, null, 2));
    
    handleNotificationNavigation(normalizedData);
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    await loadNotifications();
    if (DeviceEventEmitter?.emit) DeviceEventEmitter.emit("notificationUpdate");
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await NotificationService.deleteNotification(notificationId);
            await loadNotifications();
            if (DeviceEventEmitter?.emit) DeviceEventEmitter.emit("notificationUpdate");
          },
        },
      ]
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.isRead ? styles.readItem : styles.unreadItem,
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.6}
    >
      {/* Unread Dot Indicator on Left */}
      <View style={styles.dotContainer}>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text
          style={[
            styles.title,
            item.isRead ? styles.readTitle : styles.unreadTitle,
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.body, item.isRead && styles.readBody]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => handleDeleteNotification(item.id)}
        style={styles.deleteButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-outline" size={22} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="notifications-off-outline" size={48} color="#999" />
          </View>
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            You'll see notifications here when you receive them
          </Text>
          {Platform.OS === "web" && (
            <>
              <Text style={styles.emptyHint}>
                Tap the bell icon in the header and allow notifications to get order updates here and in your browser.
              </Text>
              <Text style={[styles.emptyHint, { marginTop: 8, fontSize: 13 }]}>
                Keep this tab open when you place an order so notifications appear here.
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  markAllText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  unreadItem: {
    backgroundColor: "#f0f7ff",
  },
  readItem: {
    backgroundColor: "#fff",
  },
  dotContainer: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  contentSection: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "700",
    color: "#000",
  },
  readTitle: {
    fontWeight: "600",
    color: "#6b7280",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
    color: "#374151",
  },
  readBody: {
    color: "#9ca3af",
  },
  timestamp: {
    fontSize: 13,
    color: "#999",
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 48,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  emptyHint: {
    marginTop: 16,
    fontSize: 14,
    color: colors.primary,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 24,
  },
});