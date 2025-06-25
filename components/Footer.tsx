import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
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
import {
  FOOTER_CART,
  FOOTER_HOME,
  FOOTER_MENU,
  FOOTER_SAVED,
  FOOTER_SEARCH,
} from "@/app/config/stringLiterals";

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

  const hasNavigationButtons = Platform.OS === "android" && insets.bottom === 0;
  const androidBottomPadding = hasNavigationButtons
    ? 20
    : Math.max(insets.bottom, 10);
  const footerHeight =
    60 +
    (Platform.OS === "ios"
      ? insets.bottom
      : insets.bottom > 0
      ? insets.bottom
      : 10);

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
    if (activeTab === FOOTER_MENU) return;
    redirectToPage(
      isValidUser ? containers.userProfileScreenScreen : containers.signInScreen
    );
  };

  const handleSavedItems = () => {
    if (activeTab === FOOTER_SAVED) return;
    redirectToPage(
      isValidUser ? containers.savedItemScreenScreen : containers.signInScreen
    );
  };

  const handleHomePress = () => {
    if (activeTab === FOOTER_HOME) return;
    redirectToPage(containers.homeScreen);
  };

  const handleSearchPress = () => {
    if (activeTab === FOOTER_SEARCH) return;
    redirectToPage(containers.searchScreen);
  };

  const handleCartPress = () => {
    if (activeTab === FOOTER_CART) return;
    redirectToPage(containers.cartScreenScreen);
  };

  return (
    <View>
      <View style={styles.footer}>
        <FooterButton
          icon="home"
          label="Home"
          isActive={activeTab === FOOTER_HOME}
          onPress={handleHomePress}
        />
        <FooterButton
          icon="heart"
          label="Saved"
          isActive={activeTab === FOOTER_SAVED}
          onPress={handleSavedItems}
        />
        <FooterButton
          icon="search"
          label="Search"
          isActive={activeTab === FOOTER_SEARCH}
          onPress={handleSearchPress}
        />
        <FooterButton
          icon="cart"
          label="Cart"
          isActive={activeTab === FOOTER_CART}
          onPress={handleCartPress}
          badge={cartItemCount}
        />
        <FooterButton
          icon="menu"
          label="Menu"
          isActive={activeTab === FOOTER_MENU}
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
        color={isActive ? colors.primary : colors.black}
      />
      {badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
        </View>
      )}
    </View>
    <Text
      style={{
        fontSize: 10,
        color: isActive ? colors.primary : colors.black,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.placeholdergrey,
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
    backgroundColor: colors.alertRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Footer;
