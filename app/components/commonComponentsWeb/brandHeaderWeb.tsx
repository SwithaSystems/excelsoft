import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "@/constants/colors";
import SearchBar from "../searchBar";
import { useRole } from "@/hooks/useRole";

export default function BrandHeaderWeb() {
  const { isAdmin, isValidUser, username, user } = useRole();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isDesktop ? 40 : isTablet ? 24 : 16,
          paddingVertical: isDesktop ? 14 : 10,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Image
          source={require("@/assets/RecreatedLogo_2.png")}
          style={[
            styles.logo,
            {
              width: isDesktop ? 140 : isTablet ? 110 : 100,
              height: isDesktop ? 40 : 36,
            },
          ]}
        />

        {(isTablet || isDesktop) && (
          <View style={{ marginLeft: 16, flex: 1 }}>
            <SearchBar
              placeholder="Search..."
              onPress={() => redirectToPage(containers.searchScreen)}
            />
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {user && !isAdmin && (
          <View style={styles.rightIconsContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="heart" size={24} color={colors.primary} />
              <Text>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="cart" size={24} color={colors.primary} />
              <Text>Cart</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => redirectToPage(containers.userNotificationsScreen)}
        >
          <Ionicons name="notifications" size={24} color={colors.primary} />
          <Text>Notifications</Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => {
              redirectToPage(
                isValidUser
                  ? containers.AdminDashboardScreen
                  : containers.homeScreen
              );
            }}
          >
            <Text style={styles.adminText}>
              {isValidUser ? "Admin" : "User"}
            </Text>
          </TouchableOpacity>
        )}

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
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});