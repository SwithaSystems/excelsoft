import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  DeviceEventEmitter,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { UserAPI } from "../services/userService";
import { useSelector } from "react-redux";
import { Platform } from "react-native";

function BrandHeader(props) {
  const [username, setUsername] = useState(null);
  const user = useSelector((state) => state.user.user);

  const fetchUser = async () => {
    if (user && user?.phone) {
      const userPhone = user?.phone;
      console.log("userPhone", userPhone);
      const response = await UserAPI.getUserByPhonenumber(userPhone);
      console.log("userdata", response.data);
      setUsername(response?.data?.firstName || "User");
    } else {
      console.log("user or user.phone is undefined", user);
    }
  };

  console.log("user in home page", user?.phone);
  useEffect(() => {
    fetchUser();
    const fetchUser_Listener = DeviceEventEmitter.addListener(
      "fetchUser",
      () => {
        fetchUser();
      }
    );
    return () => {
      fetchUser_Listener.remove();
    };
  }, []);

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
          source={require("../assets/bannerheaderlogo.png")}
          style={{ width: 42, height: 42 }}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              if (user) {
                redirectToPage(containers.userProfileScreenScreen);
              } else {
                redirectToPage(containers.signInScreen);
              }
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 8 }}>
                {username ? `Hello, ${username}` : "Sign In"}
              </Text>
              <Ionicons name="person-circle-outline" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 14 }}>
            <Ionicons name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default BrandHeader;
