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
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";
import { UserAPI } from "../services/userService";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "@/app/config/colors";

function BrandHeader(props) {
  const [username, setUsername] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      if (user && user?.phone) {
        const userPhone = user?.phone;
        console.log("userPhone", userPhone);

        // Check if user exists in DB
        const response = await UserAPI.getUserByPhonenumber(userPhone);

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
            await AsyncStorage.removeItem("user");

            //  clear Redux store
            if (dispatch && typeof dispatch === "function") {
              dispatch({ type: "user/clearUser" });
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
          bottom: Platform.OS === "android" ? 20 : 0,
        }}
      >
        <Image
          source={require("../assets/FinalizedLogo.png")}
          style={{ width: 112, height: 34 }}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              if (isValidUser) {
                redirectToPage(containers.userProfileScreenScreen);
              } else {
                redirectToPage(containers.signInScreen);
              }
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!props?.hideUserGreeting && (
                <Text style={{ marginRight: 8 }}>
                  {isValidUser ? `Hello, ${username || "User"}` : "Sign In"}
                </Text>
              )}
              <Ionicons name="person-circle-outline" size={24} color="#000" />
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
                backgroundColor: colors.black,
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
              redirectToPage(containers.UserNotificationsScreen);
            }}
          >
            <Ionicons name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default BrandHeader;