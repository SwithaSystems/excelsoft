import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../config/colors";
import SpecialOffersBanner from "./components/SpecialOffersBanner";
import CartItem from "./components/CartItem";
import OrderSummary from "../../components/OrderSummary";
import Button from "@/components/commonComponents/Button";
import styles from "./cartScreenStyles";
import RecommendedProductsSlider from "@/components/RecommendedProductsSlider";
import products from "@/data/products";
import SavedLaterItem from "./components/SavedLaterItem";
import ConfirmationModal from "../../components/commonComponents/ConfirmationModal";
import { router } from "expo-router";
import Footer from "@/components/Footer";
import containers from "@/containers";
import { redirectToPage } from "../../utilities/redirectionHelper";

const CartScreen = () => {
  const savedItems = [
    {
      id: 1,
      image: require("../../assets/baby-bicycle.png"), // Replace with your image paths
      name: "Duck Toys",
      price: 10.0,
      originalPrice: 6.99,
    },
    {
      id: 2,
      image: require("../../assets/baby-bicycle.png"),
      name: "Orange Juice",
      price: 3.0,
      quantity: 0,
    },
  ];
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

  const [cartItems, setCartItems] = useState([
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
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    alert("delete item");
    setIsModalVisible(false);
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={[globalStyles.container]}>
      <ScrollView>
        <Header headerText="Cart" />

        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {cartItems.map((eachCartItem) => {
            return (
              <CartItem
                handleDelete={handleDelete}
                key={eachCartItem.id}
                cartItem={eachCartItem}
              />
            );
          })}
          <SpecialOffersBanner />

          <OrderSummary
            cartItems={cartItems}
            sectionHeadingStyle={styles.sectionHeading}
          />
          <View
            style={{
              width: "50%",
              marginHorizontal: "auto",
              marginTop: 4,
              marginBottom: 16,
            }}
          >
            <Button
              title="Place Order"
              onPress={() => redirectToPage(containers.pickUpModescreenScreen)}
            />
          </View>
          <SavedLaterItem
            savedForLaterItems={savedItems}
            sectionHeadingStyle={styles.sectionHeading}
            handleDelete={() => {
              alert("delete saved");
            }}
          />
          <RecommendedProductsSlider
            recommendedProducts={recommendedProducts}
            sectionTitleStyle={styles.sectionHeading}
            title="Similar products to your cart"
            showAddToCart={true}
          />
        </View>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this? You can save this item for later too."
          submitText="Delete Item"
          handleSubmit={confirmDelete}
          cancelText="Save for Later"
          handleCancel={cancelDelete}
        />
      </ScrollView>
      <Footer navigation={router} activeTab="cart" />
    </View>
  );
};

export default CartScreen;
