import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import styles from "./savedItemScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import Footer from "@/components/Footer";

const savedItemScreen = () => {
  const savedItems = [
    {
      id: 1,
      image: require("../../assets/baby-bicycle.png"), // Replace with your image paths
      name: "Duck Toys",
      price: 10.0,
      originalPrice: 6.99,
      quantity: 1,
    },
    {
      id: 2,
      image: require("../../assets/baby-bicycle.png"),
      name: "Orange Juice",
      price: 3.0,
      quantity: 2,
    },
    {
      id: 3,
      image: require("../../assets/baby-bicycle.png"),
      name: "Whole Wheat Bread",
      price: 12.0,
      quantity: 1,
    },
  ];
  return (
    <View style={globalStyles.container}>
      <Header headerText="Saved Items" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {savedItems.map((eachItem) => {
            return (
              <CartItem
                footerBtnText="Move to Cart"
                handleDelete={() => {
                  alert("Delete");
                }}
                key={eachItem.id}
                cartItem={eachItem}
              />
            );
          })}
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default savedItemScreen;
