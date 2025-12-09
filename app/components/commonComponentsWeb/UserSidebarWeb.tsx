import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import colors from "@/constants/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import containers from "@/containers";

interface NavItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

interface QuickLinkItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const navItems: NavItem[] = [
  { id: "profile", label: "Profile Settings", icon: "person", route: containers.editProfileScreen },
  { id: "address", label: "Saved Address", icon: "location", route: containers.savedAddressScreen },
  { id: "password", label: "Change Password", icon: "lock-closed", route: containers.changePasswordScreen },
  { id: "notification", label: "Notification", icon: "notifications", route: containers.notificationsScreen },
  // { id: "cards", label: "Saved Cards", icon: "card", route: "/saved-cards" },
];

const quickLinks: QuickLinkItem[] = [
  { id: "orders", label: "Your Orders", icon: "briefcase", route: containers.myOrderScreen },
  { id: "saved-items", label: "Saved Items", icon: "heart", route: containers.savedItemScreen },
  { id: "saved-address-quick", label: "Saved Address", icon: "map-marker", route: containers.savedAddressScreen },
  // { id: "payments", label: "Payments", icon: "credit-card", route: "/payments" },
];

export const UserSidebarWeb: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const userData_redux = useSelector((state: RootState) => state.user.user);

  const [user, setUser] = useState<any>(null);
  const [showQuickLinks, setShowQuickLinks] = useState(false);

  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const dropdownAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (showQuickLinks) {
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [showQuickLinks]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userData_redux?.id && !userData_redux?._id) return;

      try {
        const response = await UserAPI.getUserById(
          userData_redux?._id ? userData_redux._id : userData_redux.id
        );
        if (response?.data) setUser(response.data);
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };
    fetchUser();
  }, [userData_redux]);

  const handleNavigation = (route: string, params?: any) => {
    if (params) router.push({ pathname: route as any, params });
    else router.push(route as any);
  };

  const handleQuickLinkPress = (item: QuickLinkItem) => {
    if (item.id === "orders") {
      handleNavigation(item.route, {
        userId: userData_redux?._id || userData_redux?.id,
      });
    } else {
      handleNavigation(item.route);
    }
    setShowQuickLinks(false);
  };

  const isActive = (route: string) =>
    pathname === route || pathname?.startsWith(route);

  if (!isTablet && !isDesktop) return null;

  return (
    <View style={[styles.container, showQuickLinks && { paddingBottom: 200 }]}>
      {/* Profile */}
      <View style={styles.profileSection}>
        <Image
          source={
            user?.profileImageUrl
              ? { uri: user.profileImageUrl }
              : require("@/assets/default_user_profile.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.userName} numberOfLines={1}>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.firstName || "User"}
        </Text>
      </View>

      {/* Navigation */}
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
                  style={[
                    styles.navLabel,
                    active && styles.navLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Links Section */}
      <View style={styles.quickLinksContainer}>
        <View style={styles.divider} />

        <View style={styles.quickLinksWrapper}>
          {/* Quick Links Button */}
          <TouchableOpacity
            style={styles.quickLinksButton}
            onPress={() => setShowQuickLinks(!showQuickLinks)}
            activeOpacity={0.7}
          >
            <View style={styles.quickLinksButtonContent}>
              <Ionicons name="apps" size={22} color={colors.primary} />
              <Text style={styles.quickLinksButtonText}>Quick Links</Text>
              <Ionicons
                name={showQuickLinks ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.darkGray}
              />
            </View>
          </TouchableOpacity>

          {/* Animated Dropdown */}
          {showQuickLinks && (
            <Animated.View
              style={[
                styles.quickLinksDropdown,
                {
                  opacity: dropdownAnim,
                  transform: [
                    {
                      translateY: dropdownAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {quickLinks.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickLinkItem}
                  onPress={() => handleQuickLinkPress(item)}
                  activeOpacity={0.7}
                >
                  <FontAwesome
                    name={item.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.quickLinkText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 24,
    borderRightWidth: 1,
    borderRightColor: colors.lightgrey,
    overflow: "visible",
  },

  profileSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.lightgrey,
    marginBottom: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },

  navList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 8,
    flex: 1,
  },
  navItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navItemContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.darkGray,
  },
  navLabelActive: {
    color: colors.white,
    fontWeight: "600",
  },

  quickLinksContainer: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightgrey,
    marginBottom: 12,
  },

  quickLinksWrapper: {
    position: "relative",
  },

  quickLinksButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1.4,
    borderColor: colors.primary,
  },
  quickLinksButtonContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  quickLinksButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  quickLinksDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    zIndex: 999,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  quickLinkItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.lightgrey,
  },
  quickLinkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
