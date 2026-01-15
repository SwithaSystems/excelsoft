// app/components/commonComponents/BrandHeader.js

import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  DeviceEventEmitter,
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { clearNavigationStack, redirectToPage } from "../../utilities/redirectionHelper";
import containers from "../../containers";
import { UserAPI } from "../../services/userService";
import { useSelector, useDispatch } from "react-redux";
import * as SecureStore from "expo-secure-store";
import colors from "@/constants/colors";
import { NotificationService } from "@/services/notificationService";

function BrandHeader(props) {
  const [username, setUsername] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); 
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      if (user) {
        const userId = user?._id ? user?._id : user?.id;

        const response = await UserAPI.getUserById(userId);

        if (response?.data) {
          setIsAdmin(response?.data?.isAdmin);
          setUsername(response?.data?.firstName || "User");
          setIsValidUser(true);
        } else {
          setIsValidUser(false);
          setUsername(null);

          try {
            if (Platform.OS !== "web") {
              await SecureStore.deleteItemAsync("user");
            }
            if (dispatch && typeof dispatch === "function") {
              dispatch({ type: "user/clearUserData" });
            }
          } catch (error) {
            console.error("Error clearing user data:", error);
          }
        }
      } else {
        setUsername(null);
        setIsValidUser(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUsername(null);
      setIsValidUser(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    const count = await NotificationService.getUnreadCount();
    setUnreadCount(count);
  };

  useEffect(() => {
    fetchUser();
    fetchUnreadCount();

    const fetchUser_Listener = DeviceEventEmitter.addListener(
      "fetchUser",
      () => {
        fetchUser();
      }
    );

    const notificationListener = DeviceEventEmitter.addListener(
      "notificationUpdate",
      () => {
        fetchUnreadCount();
      }
    );

    const interval = setInterval(fetchUnreadCount, 5000);

    return () => {
      fetchUser_Listener.remove();
      notificationListener.remove();
      clearInterval(interval);
    };
  }, [user]);
  // console.log("isAdmin", isAdmin);

  // Block rendering until auth is resolved
  if (authLoading) {
    return null;
  }

  return (
    <>
      <View
        style={{
          padding: Platform.OS === "android" ? 0 : 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 4,
        }}
      >
        <Image
          source={require("@/assets/RecreatedLogo_2.png")}
          style={{ width: 112, height: 34 }}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              if (isAdmin && props.hideUserGreeting) {
                redirectToPage(containers.AdminProfileScreen);
              } else if (isValidUser) {
                redirectToPage(containers.userProfileScreen);
              } else {
                redirectToPage(containers.signInScreen);
              }
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!props?.hideUserGreeting && (
                <Text style={{ marginRight: 8, color: colors.primary }}>
                  {isValidUser ? `Hello, ${username || "User"}` : "Sign In"}
                </Text>
              )}
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={colors.primary}
              />
            </View>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              onPress={() => {
                if (props.hideUserGreeting) {
                  clearNavigationStack(containers.homeScreen);
                } else {
                  clearNavigationStack(containers.AdminDashboardScreen);
                }
              }}
              style={{
                marginLeft: 14,
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>
                {props.hideUserGreeting ? "User" : "Admin"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{ marginLeft: 14 }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={() => {
              redirectToPage(containers.userNotificationsScreen);
            }}
          >
            <Ionicons name="notifications" size={24} color={colors.primary} />
            {unreadCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -6,
                  backgroundColor: colors.primaryRed,
                  borderRadius: 10,
                  minWidth: 18,
                  height: 18,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "bold" }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default BrandHeader;
