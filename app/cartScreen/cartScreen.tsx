import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, TextInput } from "react-native";
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
import { useSelector, useDispatch } from "react-redux";
import {
  CartItemInterface,
  removeFromCart,
} from "../../store/slices/cartSlice";
import { removeFromSavedItems } from "../../store/slices/savedItemsSlice";
import { addToSavedItems } from "../../store/slices/savedItemsSlice";
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
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart?.items || []);
  // const cartItems = useSelector((state: any) => [state.cart.items]);
  const savedItems = useSelector((state: any) => state.savedItems.items);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        console.log("user", user);
        setUser(user);
      }
    };

    fetchUser();
  }, []);

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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    if (itemToDelete) {
      const itemtoSave = cartItems.find(
        (item: any) => item.id === itemToDelete.id
      );
      if (itemtoSave) {
        dispatch(addToSavedItems(itemtoSave));
        dispatch(removeFromCart(itemToDelete.id));
      }
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  useEffect(() => {
    console.log("Item to delete updated:", itemToDelete);
  }, [itemToDelete]);
  const handlePlaceOrder = () => {
    console.log("User:", user);
    if (!user) {
      Alert.alert("Please login", "You need to login before placing an order");
      redirectToPage(containers.signInScreen);
    } else {
      redirectToPage(containers.pickUpModescreenScreen);
    }
  };

  return (
    <View style={[globalStyles.container]}>
      <ScrollView>
        <Header headerText="Cart" />

        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          {cartItems?.map((eachCartItem: any) => {
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
            <Button title="Place Order" onPress={handlePlaceOrder} />
          </View>

          {/*<Text>Have a Discount Code?</Text>
          <View style={globalStyles.discountSection}>
            <View style={globalStyles.discountTextInput}>
              <TextInput
                style={globalStyles.discountText}
                placeholder="Enter your discount code"
                placeholderTextColor="#17C6ED"
              />
              <Ionicons name="close" style={globalStyles.discountClearIcon} />
            </View>
            <View>
              <TouchableOpacity>
                <Text style={globalStyles.redeemButton}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>*/}
          <RecommendedProductsSlider
            recommendedProducts={recommendedProducts}
            sectionTitleStyle={styles.sectionHeading}
            title="Similar products to your cart"
            showAddToCart={true}
          />
          {savedItems.length > 0 && (
            <SavedLaterItem
              savedForLaterItems={savedItems}
              sectionHeadingStyle={styles.sectionHeading}
              handleDelete={(item: any) => {
                dispatch(removeFromSavedItems(item.id));
              }}
            />
          )}
        </View>

        {/* Delete Item Modal */}
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
