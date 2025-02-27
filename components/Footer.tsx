import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

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
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total: any, item: any) => total + item.quantity, 0);

  return (
    <View style={styles.footer}>
      {footerOptions.map((eachFooterOption, index) => {
        const isCart = eachFooterOption.title.toLowerCase() === 'cart';
        const isActive = activeTab.toLowerCase() === eachFooterOption.title.toLowerCase();
        
        return (
          <>
          <TouchableOpacity
            key={index}
            style={styles.footerTab}
            onPress={() => redirectToPage(eachFooterOption.redirectTo)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={eachFooterOption.icon}
                size={24}
                color={isActive ? "#3B4FB8" : "#666"}
              />
              {isCart && cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
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
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerTab: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Footer;
