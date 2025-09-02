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
import { redirectToPage } from "../../utilities/redirectionHelper";
import containers from "../../containers";
import { UserAPI } from "../../services/userService";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import colors from "@/constants/colors";

function BrandHeader(props) {
  const [username, setUsername] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  console.log("user in home page", user);
  const fetchUser = async () => {
    try {
      if (user) {
        const userId = user?._id ? user?._id : user?.id;
        console.log("userPhone", userId);

        // Check if user exists in DB
        const response = await UserAPI.getUserById(userId);

        if (response?.data) {
          console.log("userdata", response.data);
          setIsAdmin(response?.data?.isAdmin);
          setUsername(response?.data?.firstName || "User");
          setIsValidUser(true);
        } else {
          console.log("User not found in database");
          setIsValidUser(false);
          setUsername(null);

          // Clear Redux store and AsyncStorage
          try {
            // Clear AsyncStorage user data
            // await AsyncStorage.removeItem("user");

            await SecureStore.removeItemAsync("user");
            //  clear Redux store
            if (dispatch && typeof dispatch === "function") {
              dispatch({ type: "user/clearUserData" });
            }
          } catch (error) {
            console.error("Error clearing user data:", error);
          }
        }
      } else {
        // Set default username when user is not logged in
        setUsername(null);
        setIsValidUser(false);
        console.log("user or user.phone is undefined", user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUsername(null);
      setIsValidUser(false);
    }
  };

  useEffect(() => {
    // Fetch user whenever the user state changes
    fetchUser();

    // Listen for fetchUser events
    const fetchUser_Listener = DeviceEventEmitter.addListener(
      "fetchUser",
      () => {
        fetchUser();
      }
    );

    return () => {
      fetchUser_Listener.remove();
    };
  }, [user]);
  console.log("isAdmin", isAdmin);

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
            onPress={() => {
              if (isValidUser) {
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
                  redirectToPage(containers.homeScreen);
                } else {
                  redirectToPage(containers.AdminDashboardScreen);
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
            onPress={() => {
              redirectToPage(containers.userNotificationsScreen);
            }}
          >
            <Ionicons name="notifications" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default BrandHeader;
