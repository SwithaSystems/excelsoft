import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ADMINFOOTER_CATEGORIES,
  ADMINFOOTER_HOME,
  ADMINFOOTER_ORDERS,
  ADMINFOOTER_PRODUCTS,
  ADMINFOOTER_SCAN,
} from "@/constants/stringLiterals";
import colors from "@/constants/colors";

const AdminFooter = ({ navigation, activeTab = "" }: any) => {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const isMobile = width < 768; 


  const handleHomePress = () => {
    if (activeTab === ADMINFOOTER_HOME) return;
    redirectToPage(containers.AdminDashboardScreen);
  };
  const handleOrdersPress = () => {
    if (activeTab === ADMINFOOTER_ORDERS) return;
    redirectToPage(containers.AdminSeeAllOrdersScreen);
  };
  const handleProductsPress = () => {
    if (activeTab === ADMINFOOTER_PRODUCTS) return;
    redirectToPage(containers.AdminProductDashboardScreen);
  };
  const handleCategoryPress = () => {
    if (activeTab === ADMINFOOTER_CATEGORIES) return;
    redirectToPage(containers.AdminCategoriesScreen);
  };
  const handleScanPress = () => {
    if (activeTab === ADMINFOOTER_SCAN) return;
    redirectToPage(containers.AdminOrderQRScanScreen);
  };

  const items = [
    { icon: "home", label: "Home", onPress: handleHomePress, key: ADMINFOOTER_HOME },
    { icon: "clipboard", label: "Orders", onPress: handleOrdersPress, key: ADMINFOOTER_ORDERS },
    { icon: "cube", label: "Products", onPress: handleProductsPress, key: ADMINFOOTER_PRODUCTS },
    { icon: "list-circle", label: "Categories", onPress: handleCategoryPress, key: ADMINFOOTER_CATEGORIES },
    { icon: "gift", label: "Scan & Deliver", onPress: handleScanPress, key: ADMINFOOTER_SCAN },
  ];

  return (
    <View
      style={[
        // styles.absoluteFooter, { paddingBottom: insets.bottom || 10 }
        isMobile ? styles.absoluteFooter : styles.sidebar,
        isMobile && { paddingBottom: insets.bottom || 10 },
      ]}
    >
      <View style={ 
        // styles.footer
        isMobile ? styles.footer : styles.sidebarMenu
        }>
        {items.map((item, idx) => (
          <FooterButton
            key={idx}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.key}
            onPress={item.onPress}
            isSidebar={!isMobile}
          />
        ))}
        {/* <FooterButton
          icon="home"
          label="Home"
          isActive={activeTab === ADMINFOOTER_HOME}
          onPress={handleHomePress}
          // onPress={() => redirectToPage(containers.AdminDashboardScreen)}
        />
        <FooterButton
          icon="clipboard"
          label="Orders"
          isActive={activeTab === ADMINFOOTER_ORDERS}
          onPress={handleOrdersPress}

          // onPress={() => redirectToPage(containers.AdminSeeAllOrdersScreen)}
        />
        <FooterButton
          icon="cube"
          label="Products"
          isActive={activeTab === ADMINFOOTER_PRODUCTS}
          onPress={handleProductsPress}

          // onPress={() => redirectToPage(containers.AdminProductDashboardScreen)}
        />
        <FooterButton
          icon="list-circle"
          label="Categories"
          isActive={activeTab === ADMINFOOTER_CATEGORIES}
          onPress={handleCategoryPress}

          // onPress={() => redirectToPage(containers.AdminCategoriesScreen)}
        />
        <FooterButton
          icon="gift"
          label="Scan & Deliver"
          isActive={activeTab === ADMINFOOTER_SCAN}
          onPress={handleScanPress}

          // onPress={() => redirectToPage(containers.AdminOrderQRScanScreen)}
        /> */}
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
        color={isActive ? colors.primary : colors.black}
      />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      )}
    </View>
    <Text
      style={{ fontSize: 10, color: isActive ? colors.primary : colors.black }}
    >
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

  // Shared Styles

  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.primaryRed,
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

  //Web styles 

  sidebar: {
    backgroundColor: colors.white,
    borderTopColor: colors.placeholdergrey,
    borderTopWidth: 1,
    width: 220,
    height: '100%',
    paddingVertical: 20,
  },
  sidebarMenu: {
    flexDirection: "column",
  },
  sidebarTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  }
});

export default AdminFooter;
