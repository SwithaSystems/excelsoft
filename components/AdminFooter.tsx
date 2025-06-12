import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import colors from "@/app/config/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AdminFooter = ({ navigation, activeTab = "" }: any) => {
  const insets = useSafeAreaInsets();

  const handleHomePress = () => {
    if (activeTab === "home") return;
    redirectToPage(containers.AdminDashboardScreen);
  };
  const handleOrdersPress = () => {
    if (activeTab === "orders") return;
    redirectToPage(containers.AdminSeeAllOrdersScreen);
  };
  const handleProductsPress = () => {
    if (activeTab === "products") return;
    redirectToPage(containers.AdminProductDashboardScreen);
  };
  const handleCategoryPress = () => {
    if (activeTab === "categories") return;
    redirectToPage(containers.AdminCategoriesScreen);
  };
  const handleScanPress = () => {
    if (activeTab === "scan&deliver") return;
    redirectToPage(containers.AdminOrderQRScanScreen);
  };

  return (
    <View
      style={[styles.absoluteFooter, { paddingBottom: insets.bottom || 10 }]}
    >
      <View style={styles.footer}>
        <FooterButton
          icon="home"
          label="Home"
          isActive={activeTab === "home"}
          onPress={handleHomePress}
          // onPress={() => redirectToPage(containers.AdminDashboardScreen)}
        />
        <FooterButton
          icon="clipboard"
          label="Orders"
          isActive={activeTab === "orders"}
          onPress={handleOrdersPress}

          // onPress={() => redirectToPage(containers.AdminSeeAllOrdersScreen)}
        />
        <FooterButton
          icon="cube"
          label="Products"
          isActive={activeTab === "products"}
          onPress={handleProductsPress}

          // onPress={() => redirectToPage(containers.AdminProductDashboardScreen)}
        />
        <FooterButton
          icon="list-circle"
          label="Categories"
          isActive={activeTab === "categories"}
          onPress={handleCategoryPress}

          // onPress={() => redirectToPage(containers.AdminCategoriesScreen)}
        />
        <FooterButton
          icon="gift"
          label="Scan & Deliver"
          isActive={activeTab === "scan&deliver"}
          onPress={handleScanPress}

          // onPress={() => redirectToPage(containers.AdminOrderQRScanScreen)}
        />
      </View>
    </View>
  );
};

const FooterButton = ({ icon, label, isActive, onPress, badge }: any) => (
  <TouchableOpacity style={styles.footerTab} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons
        name={icon}
        size={24}
        color={isActive ? colors.primary : colors.iconBlack}
      />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      )}
    </View>
    <Text style={{ fontSize: 10, color: isActive ? colors.primary : colors.iconBlack }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  absoluteFooter: {
    position: "relative",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopColor: colors.placeholdergrey,
    borderTopWidth: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    paddingTop: 8,
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.alertRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default AdminFooter;
