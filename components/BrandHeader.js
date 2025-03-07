import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";

function BrandHeader(props) {
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
            redirectToPage(containers.userProfileScreenScreen);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: 8 }}>Hello, User</Text>
            <Ionicons name="person-circle-outline" size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default BrandHeader;
