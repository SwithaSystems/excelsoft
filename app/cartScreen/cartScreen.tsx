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

const CartScreen = () => {
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
    setCartItems(cartItems.filter((item) => item.id !== itemToDelete.id));
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const SavedForItem = ({ item }) => (
    <View style={styles.savedItem}>
      <Image source={item.image} style={styles.savedItemImage} />
      <Text>{item.name}</Text>
      <TouchableOpacity style={styles.addBtn}>
        <Text style={{ color: "white" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );
  const SimilarProductItem = ({ item }) => (
    <View style={styles.similarProductItem}>
      <Image source={item.image} style={styles.similarProductImage} />
      <View style={styles.similarProductDetails}>
        <Text>{item.name}</Text>
        <Text>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={{ color: "white" }}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[globalStyles.container]}>
      <ScrollView>
        <Header headerText="Cart" />

        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {cartItems.map((eachCartItem) => {
            return <CartItem key={eachCartItem.id} cartItem={eachCartItem} />;
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
              onPress={() => {
                alert("place order");
              }}
            />
          </View>
          <RecommendedProductsSlider
            recommendedProducts={recommendedProducts}
            sectionTitleStyle={styles.sectionHeading}
            title="Similar products to your cart"
            showAddToCart={true}
          />

          {/* <View style={styles.similarProductsContainer}>
            <Text style={styles.similarProductsTitle}>
              Similar products to your cart
            </Text>
            <FlatList
              data={similarProducts}
              renderItem={({ item }) => <SimilarProductItem item={item} />}
              keyExtractor={(item) => item.id.toString()}
            />
          </View> */}
        </View>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>
                Are you sure you want to delete this? You can save this item for
                later too.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={confirmDelete}
                >
                  <Text style={{ color: "white" }}>Delete Item</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveForLaterButton}
                  onPress={cancelDelete}
                >
                  <Text>Save for later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

export default CartScreen;
