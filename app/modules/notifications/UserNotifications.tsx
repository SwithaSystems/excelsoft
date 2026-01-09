// screens/UserNotificationsScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationService } from "@/services/notificationService";
import colors from "@/constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { handleNotificationNavigation } from "@/services/navigationService";

export default function UserNotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    const stored = await NotificationService.getStoredNotifications();
    setNotifications(stored);
    // Emit event to update badge
    DeviceEventEmitter.emit("notificationUpdate");
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: any) => {
    // Mark as read
    await NotificationService.markAsRead(notification.id);
    await loadNotifications();

    // Navigate
    handleNotificationNavigation(notification.data);
  };

  const handleMarkAllAsRead = async () => {
    await NotificationService.markAllAsRead();
    await loadNotifications();
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await NotificationService.clearAllNotifications();
            await loadNotifications();
          },
        },
      ]
    );
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
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order_status":
      case "order_delivery":
        return "cart";
      case "new_message":
        return "chatbubble";
      case "promotion":
        return "pricetag";
      default:
        return "notifications";
    }
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
    if (days < 7) return `${days}d ago`;

    return new Date(timestamp).toLocaleDateString();
  };

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={getNotificationIcon(item.type)}
            size={24}
            color={item.isRead ? colors.primary : colors.error}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, !item.isRead && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {/* Read/Unread indicator */}
          <View
            style={[
              styles.checkmark,
              item.isRead ? styles.readCheckmark : styles.unreadCheckmark,
            ]}
          >
            <Ionicons name="checkmark" size={16} color="white" />
          </View>

          {/* Delete button */}
          <TouchableOpacity
            onPress={() => handleDeleteNotification(item.id)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={colors.darkGray} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          {notifications.length > 0 && (
            <>
              <TouchableOpacity
                onPress={handleMarkAllAsRead}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClearAll}
                style={styles.headerButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color={colors.darkGray}
          />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            You'll see notifications here when you receive them
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  listContent: {
    padding: 8,
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: "#f0f8ff",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "bold",
    color: colors.primary,
  },
  body: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  rightSection: {
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 8,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  readCheckmark: {
    backgroundColor: "#4CAF50", // Green for read
  },
  unreadCheckmark: {
    backgroundColor: colors.secondaryRed, // Red for unread
  },
  deleteButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
