import { CART_SCREEN_TITLE } from "../../config/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
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
  SafeAreaView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  CartItemInterface,
  removeFromCart,
} from "../../../store/slices/cartSlice";
import { removeFromSavedForLaterItems } from "../../../store/slices/savedForLaterSlice";
import { addToSavedForLaterItems } from "../../../store/slices/savedForLaterSlice";
import colors from "../../config/colors";
import SpecialOffersBanner from "./Components/SpecialOffersBanner";
import CartItem from "./Components/CartItem";
import OrderSummary from "../../components/OrderSummary";
import Button from "@/app/components/commonComponents/Button";
import RecommendedProductsSlider from "@/app/components/RecommendedProductsSlider";
import products from "@/data/products";
import SavedLaterItem from "./Components/SavedLaterItem";
import ConfirmationModal from "../../components/commonComponents/ConfirmationModal";
import { router } from "expo-router";
import Footer from "@/app/components/Footer";
import containers from "@/containers";
import { redirectToPage } from "../../../utilities/redirectionHelper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "@/store/store";
import NoContentFound from "@/app/components/NoContentFound";
import PageLayout from "../../pageLayoutProps";
import { showErrorAlert } from "../../config/showErrorAlert";
import {
  SESSION_EXPIRED,
  ITEM_OUT_OF_STOCK,
  QUANTITY_NOT_AVAILABLE,
} from "../../config/customErrorMessages";
import { ProductsAPI } from "@/services/productService";
import styles from "./CartStyles";

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const savedForLaterItems = useSelector(
    (state: RootState) => state.savedForLaterItems.items
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [stockAvailable, setStockAvailable] = useState<Record<string, number>>(
    {}
  );

  console.log("user in cart screen", user);

  const recommendedProducts = products
    .filter((p) =>
      ["Greek Yogurt", "Baby Stroller", "Granola Bars"].includes(p.name)
    )
    .map((product) => ({
      id: product.id,
      name: product.name,
      rating: product.rating,
      reviews: product.noOfreviews,
      imageUrl: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
    }));
  console.log("Recommended Products", recommendedProducts);

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
        dispatch(addToSavedForLaterItems(itemtoSave));
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
      showErrorAlert({
        title: "Login Required",
        message: SESSION_EXPIRED,
      });
      redirectToPage(containers.signInScreen);
    } else {
      redirectToPage(containers.pickUpModeScreen);
    }
  };

  useEffect(() => {
    async function getStock() {
      const newStock: Record<string, number> = {};

      for (let item of cartItems) {
        try {
          const product = await ProductsAPI.getProductBYID(Number(item.id));
          newStock[item.id] = product?.stock || 0;
        } catch (error) {
          newStock[item.id] = 0;
        }
      }

      for (let item of savedForLaterItems) {
        try {
          const product = await ProductsAPI.getProductBYID(Number(item.id));
          newStock[item.id] = product?.stock || 0;
        } catch (error) {
          newStock[item.id] = 0;
        }
      }
      setStockAvailable(newStock);
    }
    getStock();
  }, [cartItems, savedForLaterItems]);

  return (
    <PageLayout
      hasHeader
      hasFooter
      headerComponent={<Header headerText={CART_SCREEN_TITLE} />}
      footerComponent={<Footer activeTab="cart" />}
    >
      <View style={[globalStyles.container]}>
        <ScrollView>
          <View style={[globalStyles.pt_0]}>
            {cartItems.length === 0 ? (
              <View style={styles.emptyCartContainer}>
                <Ionicons
                  name="cart"
                  size={98}
                  color={colors.placeholdergrey}
                  style={styles.cartIcon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.emptyTitle}>Your page is empty</Text>
                  <Text style={styles.emptySubtitle}>
                    No worries! You can check our products{" "}
                    <TouchableOpacity
                      onPress={() => redirectToPage(containers.homeScreen)}
                    >
                      <Text style={styles.hereText}>here.</Text>
                    </TouchableOpacity>
                  </Text>
                </View>
              </View>
            ) : (
              <>
                {cartItems.map((eachCartItem: any) => (
                  <CartItem
                    handleDelete={handleDelete}
                    key={eachCartItem.id}
                    cartItem={eachCartItem}
                    stockAvailable={stockAvailable[eachCartItem.id] || 0}
                  />
                ))}
                <OrderSummary cartItems={cartItems} />

                <View
                  style={{
                    width: "50%",
                    marginHorizontal: "auto",
                    // marginTop: 4,
                    paddingBottom: 16,
                  }}
                >
                  <Button title="Place Order" onPress={handlePlaceOrder} />
                </View>
              </>
            )}
            {/*<Text>Have a Discount Code?</Text>
          <View style={globalStyles.discountSection}>
            <View style={globalStyles.discountTextInput}>
              <TextInput
                style={globalStyles.discountText}
                placeholder="Enter your discount code"
                placeholderTextColor=colors.primary
              />
              <Ionicons name="close" style={globalStyles.discountClearIcon} />
            </View>
            <View>
              <TouchableOpacity>
                <Text style={globalStyles.redeemButton}>Redeem</Text>
              </TouchableOpacity>
            </View>
          </View>*/}

            <SpecialOffersBanner />

            {savedForLaterItems.length > 0 && (
              <SavedLaterItem
                savedForLaterItems={savedForLaterItems}
                sectionHeadingStyle={styles.sectionHeading}
                stockAvailable={stockAvailable}
                handleDelete={(item: any) => {
                  dispatch(removeFromSavedForLaterItems(item.id));
                }}
                handleMoveToCart={(item: any) => {
                  dispatch(addToCart(item));
                  dispatch(removeFromSavedForLaterItems(item.id));
                }}
              />
            )}
            <RecommendedProductsSlider
              recommendedProducts={recommendedProducts}
              sectionTitleStyle={styles.sectionHeading}
              title="Similar products to your cart"
              showAddToCart={true}
              handleAdd={(item: any) => dispatch(addToCart(item))}
            />
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
      </View>
    </PageLayout>
  );
};

export default CartScreen;
