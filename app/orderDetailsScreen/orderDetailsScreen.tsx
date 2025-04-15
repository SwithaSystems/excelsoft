import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./orderDetailsScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import { router } from "expo-router";
import RecommendedProductsSlider from "@/components/RecommendedProductsSlider";
import products from "@/data/products";
import Footer from "@/components/Footer";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import QRCodeDisplay from "../../components/QRCodeDisplay";

const orderDetailsScreen = () => {
  const recommendedProducts = products
    .filter((p) =>
      ["Greek Yogurt", "Baby Stroller", "Granola Bars"].includes(p.name)
    )
    .map((product) => ({
      id: product.id,
      title: product.name,
      rating: product.rating,
      reviews: product.noOfreviews,
      imageUrl: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
    }));

  const deliveryMode = {
    mode: "Home Delivery",
    address:
      "H.No: 1-123, xyz street, That Town, Near Mellinda Cafe, UK, 3123456",
  };
  const cartItems = [
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
    <>
      <View style={styles.container}>
        <Header headerText="Order Details" />
        <ScrollView>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
            <View style={{}}>
            <QRCodeDisplay qrValue={55555} noteText='*Please present this QR code to our store personnel at the time of pickup. Also, ensure you carry a valid ID proof.'/>
              {/* <Text style={styles.barCodeNote}>
                Show this bar code to our store personnel during the pickup.
              </Text> */}
            </View>
            <View style={styles.orderSummaryItem}>
              <Text
                style={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                ]}
              >
                Status
              </Text>
              <Text
                style={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                ]}
              >
                Processed
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Order Number: </Text>
              <Text style={styles.orderSummaryItemText}>#ORD-2025-1234</Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Date Placed: </Text>
              <Text style={styles.orderSummaryItemText}>21-01-2025</Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Shipping:</Text>
              <Text style={styles.orderSummaryItemText}>$25.00</Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Sub Total:</Text>
              <Text style={styles.orderSummaryItemText}>$25.00</Text>
            </View>
            <View style={{ marginTop: 8 }}>
              {cartItems.map((eachCartItem) => {
                return (
                  <CartItem
                    hideActions={true}
                    itemContainerStyle={styles.cartItemContainerStyle}
                    key={eachCartItem.id}
                    cartItem={eachCartItem}
                  />
                );
              })}
            </View>
            <View>
              <View style={[styles.orderSummaryItem, globalStyles.mb_2]}>
                <Text
                  style={[
                    styles.orderSummaryItemText,
                    globalStyles.fontWeight500,
                  ]}
                >
                  Deliver To:
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    redirectToPage(containers.deliveryTrackingScreenScreen);
                  }}
                >
                  <Text style={globalStyles.btnSmUnderLine}>Track Order</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.orderSummaryItemText, globalStyles.mb_2]}>
                Choosen Delivery: {deliveryMode.mode}
              </Text>
              <Text style={[styles.orderSummaryItemText, globalStyles.mb_3]}>
                Address: {deliveryMode.address}
              </Text>
            </View>
            <View>
              <RecommendedProductsSlider
                recommendedProducts={recommendedProducts}
                sectionTitleStyle={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                  globalStyles.mb_3,
                ]}
                title="Would you like to see these too?"
                showAddToCart={false}
              />
            </View>
          </View>
            <TouchableOpacity style={styles.cancelButton}
            onPress={() => {
              redirectToPage(containers.cancelOrderScreen);
            }}
            >
              <Text style = {styles.buttonText}>Request Cancellation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.requestButton}
            onPress={() => {
              redirectToPage(containers.returnOrderScreen);
            }}
            >
              <Text style = {styles.buttonText}>Request Return</Text>
            </TouchableOpacity>
        </ScrollView>
        <Footer />
      </View>
    </>
  );
};

export default orderDetailsScreen;
