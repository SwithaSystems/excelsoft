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

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const navItems: NavItem[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: "stats-chart", 
    route: "/modules/admin/AdminDashboard"
  },
  { 
    id: "orders", 
    label: "Orders", 
    icon: "cart", 
    route: "/modules/admin/AdminSeeAllOrders" 
  },
  { 
    id: "products", 
    label: "Products", 
    icon: "cube", 
    route: "/modules/admin/AdminProductDashboard" 
  },
  { 
    id: "categories", 
    label: "Categories", 
    icon: "folder", 
    route: "/modules/admin/AdminCategories"
  },
  { 
    id: "scan", 
    label: "Scan & Deliver", 
    icon: "people", 
    route: "/modules/admin/AdminOrderQRScan"
  },
];

export const AdminSidebarWeb: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  console.log('Current pathname:', pathname);
  console.log('Container routes:', navItems.map(item => ({ label: item.label, route: item.route })));

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const isActive = (route: string) => {
    return pathname === route || pathname?.startsWith(route);
  };

  if (!isTablet && !isDesktop) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.navList}>
        {navItems.map((item) => {
          const active = isActive(item.route);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                active && styles.navItemActive,
              ]}
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
                  style={[
                    styles.navLabel,
                    active && styles.navLabelActive,
                  ]}
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