import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

function BrandHeader(props) {
  const [username, setUsername] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log("user", user);
        setUsername(user?.firstName || "User");
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../assets/brandlogo.png")}
          style={{ width: 24, height: 24 }}
        />
        <TouchableOpacity
          onPress={() => {
            if (username) {
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
      </View>
    </>
  );
}

export default BrandHeader;
