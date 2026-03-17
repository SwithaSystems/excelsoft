// AdminSidebarWeb.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import colors from "@/constants/colors";
import containers from "@/containers";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface AdminSidebarWebProps {
  isDrawer?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "stats-chart",
    route: "/modules/admin/AdminDashboard",
  },
  {
    id: "orders",
    label: "Orders",
    icon: "cart",
    route: "/modules/admin/AdminSeeAllOrders",
  },
  {
    id: "products",
    label: "Products",
    icon: "cube",
    route: "/modules/admin/AdminProductDashboard",
  },
  {
    id: "categories",
    label: "Categories",
    icon: "folder",
    route: "/modules/admin/AdminCategories",
  },
  {
    id: "store-information",
    label: "Store Information",
    icon: "storefront",
    route: `/${containers.AdminStoreInformationScreen}`,
  },
  {
    id: "scan",
    label: "Scan & Deliver",
    icon: "people",
    route: "/modules/admin/AdminOrderQRScan",
  },
  {
    id: "upload",
    label: "Upload",
    icon: "people",
    route: "/modules/admin/FileUploadAddProductCategory",
  },
  {
    id: "promotion",
    label: "Promotion Management",
    icon: "megaphone",
    route: "/modules/admin/AdminPromotion",
  },
  {
    id: "access-control",
    label: "User Access Control",
    icon: "shield-checkmark",
    route: "/modules/admin/AdminAccessControl",
  },
  {
    id: "global-settings",
    label: "Global Settings",
    icon: "settings",
    route: "/modules/admin/AdminGlobalSettings",
  },
  {
    id: "notification-settings",
    label: "Notification Settings",
    icon: "notifications",
    route: `/${containers.adminNotificationSettingsScreen}`,
  },
];

export const AdminSidebarWeb: React.FC<AdminSidebarWebProps> = ({
  isDrawer = false,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile } = useWebMediaQuery();

  const handleNavigation = (route: string) => {
    router.push(route as any);
    // Close drawer if it's open
    if (isDrawer && onClose) {
      onClose();
    }
  };

  const isActive = (route: string) => {
    return pathname === route || pathname?.startsWith(route);
  };

  // Don't render on mobile browser unless it's in drawer mode
  if (!isDrawer && isMobile) {
    return null;
  }

  return (
    <View style={[styles.container, isDrawer && styles.containerDrawer]}>
      <View style={styles.navList}>
        {navItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => handleNavigation(item.route)}
              activeOpacity={0.7}
            >
              <View style={styles.navItemContent}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? colors.white : colors.darkGray}
                />
                <Text
                  style={[styles.navLabel, active && styles.navLabelActive]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
              {active && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 24,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: colors.lightgrey,
  },
  containerDrawer: {
    borderRightWidth: 0,
    paddingTop: 0,
  },
  navList: {
    gap: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    position: "relative",
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.darkGray,
    flex: 1,
  },
  navLabelActive: {
    color: colors.white,
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: 4,
    height: "60%",
    backgroundColor: colors.primary,
    borderRadius: 2,
    transform: [{ translateY: -12 }],
  },
});

export default AdminSidebarWeb;
