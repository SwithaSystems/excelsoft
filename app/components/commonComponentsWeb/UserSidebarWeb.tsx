import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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

const navItems: NavItem[] = [
  { 
  id: "profile", 
  label: "Profile Settings", 
  icon: "person", 
  route: containers.editProfileScreen 
},
  { 
    id: "address", 
    label: "Saved Address", 
    icon: "location", 
    route: containers.savedAddressScreen 
 },
  { 
    id: "password", 
    label: "Change Password", 
    icon: "lock-closed", 
    route: containers.changePasswordScreen 
  },
  { 
    id: "notification", 
    label: "Notification", 
    icon: "notifications", 
    route: containers.notificationsScreen 
  },
  { 
    id: "cards", 
    label: "Saved Cards", 
    icon: "card",  
    route: "/saved-cards",
  },
//   { 
//     id: "feedback", 
//     label: "Feedback", 
//     icon: "chatbox-ellipses", 
//     route: containers.appReviewScreen 
//   },
];

export const UserSidebarWeb: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const userData_redux = useSelector((state: RootState) => state.user.user);
  
  const [user, setUser] = useState<{
    id?: number;
    _id?: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  } | null>(null);

  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userData_redux?.id && !userData_redux?._id) return;

      try {
        const response = await UserAPI.getUserById(
          userData_redux?._id ? userData_redux?._id : userData_redux?.id
        );
        if (response?.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error("User fetch failed", err);
      }
    };

    fetchUser();
  }, [userData_redux]);

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
      {/* Profile Section */}
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

      {/* Navigation List */}
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
                  color={active ? colors.primary : colors.darkGray}
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
    borderRightWidth: 1,
    borderRightColor: colors.lightgrey,
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
    marginBottom: 12,
    backgroundColor: colors.lightgrey,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
  navList: {
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 16,
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
    color: colors.primary,
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

export default UserSidebarWeb;