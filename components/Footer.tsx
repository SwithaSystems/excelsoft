import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addToSavedItems } from "@/store/slices/savedItemsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "@/app/config/colors";
import { UserAPI } from "@/services/userService";

const Footer = ({ navigation, activeTab = "" }: any) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total: any, item: any) => total + item.quantity,
    0
  );
  const [user, setUser] = useState(null);
  const [isValidUser, setIsValidUser] = useState(false);
  const userData_redux = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const validateAndFetchUser = async () => {
    try {
      if (userData_redux && userData_redux?.phone) {
        // Validate if the user exists in the database
        const response = await UserAPI.getUserByPhonenumber(
          userData_redux.phone
        );

        if (response?.data) {
          console.log("User validated in database");
          setIsValidUser(true);
        } else {
          console.log("User not found in database, clearing local data");
          setIsValidUser(false);

          // Clear AsyncStorage and Redux
          try {
            await AsyncStorage.removeItem("user");
            // Make sure this action exists in your reducer
            dispatch({ type: "user/clearUser" });
          } catch (error) {
            console.error("Error clearing user data:", error);
          }
        }
      } else {
        // No user in Redux
        console.log("No user in Redux");
        setIsValidUser(false);
      }
    } catch (error) {
      console.error("Error validating user:", error);
      setIsValidUser(false);
    }
  };
  // const fetchUser = async () => {
  //   // const user = await AsyncStorage.getItem("user");
  //   console.log("userData_redux", userData_redux);
  //   if (userData_redux) {
  //     setUser(userData_redux);
  //   } else {
  //     setUser(null);
  //   }
  // };

  useEffect(() => {
    validateAndFetchUser();
  }, [userData_redux]);

  const handleMenuPress = () => {
    if (isValidUser) {
      redirectToPage(containers.userProfileScreenScreen);
    } else {
      redirectToPage(containers.signInScreen);
    }
  };
  const handleSavedItems = () => {
    if (isValidUser) {
      redirectToPage(containers.savedItemScreenScreen);
    } else {
      redirectToPage(containers.signInScreen);
    }
  };

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
          color={activeTab.toLowerCase() === "home" ? colors.primary : "#666"}
        />
        <Text
          style={{
            fontSize: 10,
            color: activeTab.toLowerCase() == "home" ? colors.primary : "#666",
          }}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Saved Button */}
      <TouchableOpacity style={styles.footerTab} onPress={handleSavedItems}>
        <Ionicons
          name="heart"
          size={24}
          color={activeTab.toLowerCase() === "saved" ? colors.primary : "#666"}
        />
        <Text
          style={{
            fontSize: 10,
            color: activeTab.toLowerCase() == "saved" ? colors.primary : "#666",
          }}
        >
          Saved
        </Text>
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.searchScreen)}
      >
        <Ionicons
          name="search"
          size={24}
          color={activeTab.toLowerCase() === "search" ? colors.primary : "#666"}
        />
        <Text
          style={{
            fontSize: 10,
            color:
              activeTab.toLowerCase() == "search" ? colors.primary : "#666",
          }}
        >
          Search
        </Text>
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
            color={activeTab.toLowerCase() === "cart" ? colors.primary : "#666"}
          />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{
            fontSize: 10,
            color: activeTab.toLowerCase() == "cart" ? colors.primary : "#666",
          }}
        >
          Cart
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerTab} onPress={handleMenuPress}>
        <Ionicons
          name="menu"
          size={24}
          color={activeTab.toLowerCase() == "menu" ? colors.primary : "#666"}
        />
        <Text
          style={{
            fontSize: 10,
            color: activeTab.toLowerCase() == "menu" ? colors.primary : "#666",
          }}
        >
          Menu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingVertical: 8,
    borderTopWidth: 1,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.placeholdergrey,
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
