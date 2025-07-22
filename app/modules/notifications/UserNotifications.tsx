import { NOTIFICATIONS_LISTING_SCREEN_TITLE } from "../../config/stringLiterals";
import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import Footer from "@/app/components/Footer";
import colors from "../../config/colors";
import PageLayout from "../../pageLayoutProps";
import styles from "./UserNotificationsStyles";

const notifications = [
  {
    id: 1,
    message: "20% off on dairy products. Live for next two hours!",
    type: "offer",
  },
  {
    id: 2,
    message: "Items added to your cart are restocked",
    type: "cart",
  },
  {
    id: 3,
    message: "Check price drop on the items of your cart",
    type: "priceDrop",
  },
  {
    id: 4,
    message: "Your order have been packed.",
    type: "order",
  },
];

const getIconName = (type: string) => {
  if (type === "offer") return "gift-outline";
  else if (type === "cart") return "cart-outline";
  else if (type === "priceDrop") return "pricetag-outline";
  else if (type === "order") return "receipt-outline";
  return "notifications-outline";
};

const UserNotifications = () => {
  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable={false}
      headerComponent={
        <Header headerText={NOTIFICATIONS_LISTING_SCREEN_TITLE} />
      }
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {notifications.length === 0 ? (
          <View style={styles.emptyNotifContainer}>
            <Ionicons
              name="notifications-off-outline"
              size={80}
              color={colors.secondary}
            />
            <Text style={styles.noNotificationText}>No Notifications yet</Text>
            <Text style={styles.subText}>
              You are all caught up! Check back some other time!
            </Text>
          </View>
        ) : (
          notifications.map(function (item) {
            return (
              <View key={item.id} style={styles.notificationBox}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={getIconName(item.type)}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.notificationText}>{item.message}</Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </PageLayout>
  );
};

export default UserNotifications;
