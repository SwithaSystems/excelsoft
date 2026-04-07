// screens/UserNotificationsScreen.tsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  DeviceEventEmitter,
  Platform,
} from "react-native";
import Header from "@/app/components/Header";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useRoleContext } from "@/context/RoleContext";
import { Ionicons } from "@expo/vector-icons";
import { NotificationService } from "@/services/notificationService";
import colors from "@/constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { handleNotificationNavigation } from "@/services/navigationService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const FOCUS_LOAD_THROTTLE_MS = 1200;

export default function UserNotificationsScreen() {
  const { isValidUser } = useRoleContext();
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const [notifications, setNotifications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [notificationToDeleteId, setNotificationToDeleteId] = useState<string | null>(null);
  const lastFocusLoadRef = useRef<number>(0);

  useEffect(() => {
    if (typeof console !== "undefined") console.log("[UserNotifications] Screen mounted");
    return () => { if (typeof console !== "undefined") console.log("[UserNotifications] Screen unmounted"); };
  }, []);

  const loadNotifications = useCallback(async () => {
    if (typeof console !== "undefined") console.log("[UserNotifications] loadNotifications start");
    setLoadError(null);
    try {
      const list = await NotificationService.fetchNotificationsFresh();
      if (typeof console !== "undefined") {
        console.log("[UserNotifications] loaded", list.length, "notifications");
      }
      setNotifications(list);
    } catch (e: unknown) {
      const error = e as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      let msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to load notifications";
      if (typeof msg === "string" && msg.includes("Cannot GET")) {
        msg = "Notifications API not reached. Set EXPO_PUBLIC_API_URL in .env to your backend URL (e.g. https://your-api.herokuapp.com).";
      }
      setNotifications([]);
      setLoadError(msg);
      if (typeof console !== "undefined") console.warn("[UserNotifications] API fetch failed:", e);
    }
  }, []);

  // Ensure we load at least once on mount (avoids empty list when focus throttle skips on web).
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

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
      } catch {
        // Ignore malformed payload strings and fall back to the raw notification.
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
    setNotificationToDeleteId(notificationId);
    setDeleteModalVisible(true);
  };

  const performDeleteNotification = async () => {
    if (!notificationToDeleteId) return;
    await NotificationService.deleteNotification(notificationToDeleteId);
    setNotificationToDeleteId(null);
    setDeleteModalVisible(false);
    await loadNotifications();
    if (DeviceEventEmitter?.emit) DeviceEventEmitter.emit("notificationUpdate");
  };

  const formatOrderNumberInText = (text: string) =>
    (text || "").replace(/#(\d+)/g, "#ORD-$1");

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
          {formatOrderNumberInText(item.title)}
        </Text>
        <Text
          style={[styles.body, item.isRead && styles.readBody]}
          numberOfLines={2}
        >
          {formatOrderNumberInText(item.body)}
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

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header
      headerText="Notifications"
      secondaryBtnText={notifications.length > 0 ? "Mark all read" : undefined}
      secondaryBtnCallBack={notifications.length > 0 ? handleMarkAllAsRead : undefined}
    />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : undefined;

  const renderWebPageHeader = () => (
    <View style={[styles.pageHeaderRow, isMobileWeb && styles.pageHeaderRowMobile]}>
      <View style={styles.pageHeaderSpacer} />

      <View style={[styles.pageHeaderTitleWrap, styles.pageHeaderTitleWrapWeb]}>
        <Text style={styles.pageHeaderTitle}>Notifications</Text>
      </View>

      <View style={styles.pageHeaderActionWrap}>
        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={handleMarkAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isWeb}
      footerComponent={FooterComponent}
      hasSidebar={false}
      scrollable={false}
    >
      <View
        style={[
          styles.container,
          isWeb && styles.webContainer,
          isMobileWeb && styles.mobileWebContainer,
        ]}
      >
        {isWeb && renderWebPageHeader()}

        <View style={[styles.contentCard, isMobileWeb && styles.contentCardMobileWeb]}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              {isValidUser && loadError ? (
                <>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="cloud-offline-outline" size={48} color="#999" />
                  </View>
                  <Text style={styles.emptyText}>Couldn&apos;t load notifications</Text>
                  <Text style={styles.emptySubtext}>{loadError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      setLoadError(null);
                      loadNotifications();
                    }}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="notifications-off-outline" size={48} color="#999" />
                  </View>
                  <Text style={styles.emptyText}>No notifications yet</Text>
                  <Text style={styles.emptySubtext}>
                    You&apos;ll see notifications here when you receive them
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
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <ConfirmationModal
          isModalVisible={deleteModalVisible}
          onClose={() => {
            setDeleteModalVisible(false);
            setNotificationToDeleteId(null);
          }}
          handleCancel={() => {
            setDeleteModalVisible(false);
            setNotificationToDeleteId(null);
          }}
          handleSubmit={performDeleteNotification}
          title="Delete Notification"
          text="Are you sure you want to delete this notification?"
          submitText="Delete"
          cancelText="Cancel"
          isDestructive
        />
      </View>
    </LayoutComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
  },
  webContainer: {
    width: "60%",
    alignSelf: "center",
  },
  mobileWebContainer: {
    width: "94%",
  },
  pageHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
  },
  pageHeaderRowMobile: {
    marginBottom: 16,
  },
  pageHeaderSpacer: {
    minWidth: 72,
  },
  pageHeaderTitleWrap: {
    flex: 1,
    alignItems: "center",
  },
  pageHeaderTitleWrapWeb: {
    alignItems: "flex-start",
  },
  pageHeaderActionWrap: {
    minWidth: 120,
    alignItems: "flex-end",
  },
  pageHeaderTitle: {
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
  contentCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    overflow: "hidden",
  },
  contentCardMobileWeb: {
    borderRadius: 12,
  },
  listContent: {
    paddingBottom: 12,
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
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
