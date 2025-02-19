import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";

const footerOptions = [
  { title: "Home", icon: "home", redirectTo: containers.homeScreen },
  {
    title: "Saved",
    icon: "heart",
    redirectTo: containers.savedItemScreenScreen,
  },
  { title: "Search", icon: "search", redirectTo: containers.searchScreen },
  { title: "Cart", icon: "cart", redirectTo: containers.cartScreenScreen },
];
const Footer = ({ navigation, activeTab = "" }: any) => {
  return (
    <View style={styles.footer}>
      {footerOptions.map((eachFooterOption, index) => {
        return (
          <>
            <TouchableOpacity
              key={index}
              style={styles.footerTab}
              onPress={() => redirectToPage(eachFooterOption.redirectTo)}
            >
              <Ionicons
                name={eachFooterOption.icon}
                size={24}
                color={
                  activeTab.toLowerCase() ===
                  eachFooterOption.title.toLocaleLowerCase()
                    ? "#3B4FB8"
                    : "#666"
                }
              />
            </TouchableOpacity>
          </>
        );
      })}
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
