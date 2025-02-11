import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";

const Footer = ({ navigation, activeTab }: any) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.homeScreen)}
      >
        <Ionicons
          name="home"
          size={24}
          color={activeTab === "home" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.cartScreenScreen)}
      >
        <Ionicons
          name="cart"
          size={24}
          color={activeTab === "cart" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.userProfileScreenScreen)}
      >
        <Ionicons
          name="person"
          size={24}
          color={activeTab === "profile" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => navigation.navigate("Menu")}
      >
        <Ionicons
          name="menu"
          size={24}
          color={activeTab === "menu" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});

export default Footer;
