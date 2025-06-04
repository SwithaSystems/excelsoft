import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "@/app/config/colors";
import { UserAPI } from "@/services/userService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Footer = ({ navigation, activeTab = "" }: any) => {
  const insets = useSafeAreaInsets();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total: any, item: any) => total + item.quantity,
    0
  );
  const userData_redux = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [isValidUser, setIsValidUser] = useState(false);

  const validateAndFetchUser = async () => {
    try {
      if (userData_redux?.phone) {
        const response = await UserAPI.getUserByPhonenumber(
          userData_redux.phone
        );
        if (response?.data) {
          setIsValidUser(true);
        } else {
          await AsyncStorage.removeItem("user");
          dispatch({ type: "user/clearUserData" });
          setIsValidUser(false);
        }
      } else {
        setIsValidUser(false);
      }
    } catch (error) {
      console.error("User validation failed:", error);
      setIsValidUser(false);
    }
  };

  useEffect(() => {
    validateAndFetchUser();
  }, [userData_redux]);

  const handleMenuPress = () => {
    redirectToPage(
      isValidUser ? containers.userProfileScreenScreen : containers.signInScreen
    );
  };

  const handleSavedItems = () => {
    redirectToPage(
      isValidUser ? containers.savedItemScreenScreen : containers.signInScreen
    );
  };

  return (
    <View
      style={[styles.absoluteFooter, { paddingBottom: insets.bottom || 10 }]}
    >
      <View style={styles.footer}>
        <FooterButton
          icon="home"
          label="Home"
          isActive={activeTab === "home"}
          onPress={() => redirectToPage(containers.homeScreen)}
        />
        <FooterButton
          icon="heart"
          label="Saved"
          isActive={activeTab === "saved"}
          onPress={handleSavedItems}
        />
        <FooterButton
          icon="search"
          label="Search"
          isActive={activeTab === "search"}
          onPress={() => redirectToPage(containers.searchScreen)}
        />
        <FooterButton
          icon="cart"
          label="Cart"
          isActive={activeTab === "cart"}
          onPress={() => redirectToPage(containers.cartScreenScreen)}
          badge={cartItemCount}
        />
        <FooterButton
          icon="menu"
          label="Menu"
          isActive={activeTab === "menu"}
          onPress={handleMenuPress}
        />
      </View>
    </View>
  );
};

const FooterButton = ({ icon, label, isActive, onPress, badge }: any) => (
  <TouchableOpacity style={styles.footerTab} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Ionicons
        name={icon}
        size={24}
        color={isActive ? colors.primary : "#666"}
      />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      )}
    </View>
    <Text style={{ fontSize: 10, color: isActive ? colors.primary : "#666" }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  absoluteFooter: {
    position: "relative",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopColor: colors.placeholdergrey,
    borderTopWidth: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    paddingTop: 8,
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
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
