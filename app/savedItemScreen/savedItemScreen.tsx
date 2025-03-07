import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import styles from "./savedItemScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import Footer from "@/components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { removeFromSavedItems, moveToCart } from "../../store/slices/savedItemsSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { router } from "expo-router";

const savedItemScreen = () => {
  const dispatch = useDispatch();
  const savedItems = useSelector((state: any) => state.savedItems.items);

  const handleMoveToCart = (item: any) => {
    dispatch(addToCart(item));
    dispatch(moveToCart(item.id));
  };

  const handleDelete = (item: any) => {
    dispatch(removeFromSavedItems(item.id));
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="Saved Items" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {savedItems.map((eachItem: any) => {
            return (
              <CartItem
                footerBtnText="Move to Cart"
                handleDelete={() => handleDelete(eachItem)}
                handleFooterBtnPress={() => handleMoveToCart(eachItem)}
                key={eachItem.id}
                cartItem={eachItem}
              />
            );
          })}
        </View>
      </ScrollView>
      <Footer navigation={router} activeTab="saved" />
    </View>
  );
};

export default savedItemScreen;
