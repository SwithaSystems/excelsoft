import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addToSavedItems } from "@/store/slices/savedItemsSlice";



const Footer = ({ navigation, activeTab = "" }: any) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total: any, item: any) => total + item.quantity,
    0
  );

  return (
    <View style={styles.footer}>
      
      {/* Home Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.homeScreen)}
      >
        <Ionicons
          name="home"
          size={24}
          color={activeTab.toLowerCase() === "home" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>

      {/* Saved Button */}
      <TouchableOpacity
       style={styles.footerTab} 
      onPress={() => redirectToPage(containers.savedItemScreenScreen)}>
        
        <Ionicons
          name="heart"
          size={24}
          color={activeTab.toLowerCase() === "saved" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.searchScreen)}
      >
        <Ionicons
          name="search"
          size={24}
          color={activeTab.toLowerCase() === "search" ? "#3B4FB8" : "#666"}
        />
      </TouchableOpacity>

      {/* Cart Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.cartScreenScreen)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="cart"
            size={24}
            color={activeTab.toLowerCase() === "cart" ? "#3B4FB8" : "#666"}
          />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </Text>
            </View>
          )}
        </View>
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
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerTab: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4B4B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Footer;
