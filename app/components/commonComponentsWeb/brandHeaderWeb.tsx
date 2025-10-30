import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "@/constants/colors";
import SearchBar from "../searchBar";
import { useRoleContext } from "@/context/RoleContext";

interface BrandHeaderWebProps {
  hideUserGreeting?: boolean;
}

export default function BrandHeaderWeb({ hideUserGreeting = false }: BrandHeaderWebProps) {
  const { isAdmin, isValidUser, username } = useRoleContext();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isDesktop ? 40 : isTablet ? 24 : 16,
          paddingVertical: isDesktop ? 8 : 10,
        },
      ]}
    >
      {/* LEFT SECTION - Logo and Search */}
      <View style={styles.leftSection}>
        <Image
          source={require("@/assets/RecreatedLogo_2.png")}
          style={[
            styles.logo,
            {
              width: isDesktop ? 140 : isTablet ? 110 : 100,
              height: isDesktop ? 60 : 36,
            },
          ]}
        />
        
        {(isTablet || isDesktop) && (
          <View style={{ marginLeft: 16, flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <SearchBar
              placeholder="Search..."
              onPress={() => redirectToPage(containers.searchScreen)}
            />
          </View>
        )}
      </View>

      {/* RIGHT SECTION */}
      <View style={styles.rightSection}>

        {/* Profile/Sign In */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => {
            if (isValidUser) {
              redirectToPage(containers.userProfileScreen);
            } else {
              redirectToPage(containers.signInScreen);
            }
          }}
        >
          <Text style={styles.greetingText}>
            {isValidUser ? `Hello, ${username || "User"}` : "Sign In"}
          </Text>
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        {/* Admin/User Switch Button - Only for admin users */}
        {isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => {
              if (hideUserGreeting) {
                // On admin page, go back to user
                redirectToPage(containers.homeScreen);
              } else {
                // On user page, go to admin
                redirectToPage(containers.AdminDashboardScreen);
              }
            }}
          >
            <Text style={styles.adminText}>
              {hideUserGreeting ? "User" : "Admin"}
            </Text>
          </TouchableOpacity>
        )}

         {!hideUserGreeting && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => redirectToPage(containers.userNotificationsScreen)}
            >
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <Text>Notifications</Text>
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.lightgrey,
  },
  logo: {
    resizeMode: "contain",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 14,
    padding: 6,
  },
  adminButton: {
    marginLeft: 16,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  greetingText: {
    marginRight: 8,
    color: colors.primary,
    fontWeight: "500",
  },
});