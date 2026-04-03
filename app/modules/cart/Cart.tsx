import { CART_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, TextInput, Platform } from "react-native";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
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
  refreshCartItem,
  removeFromCart,
} from "../../../store/slices/cartSlice";
import { removeFromSavedForLaterItems } from "../../../store/slices/savedForLaterSlice";
import { addToSavedForLaterItems } from "../../../store/slices/savedForLaterSlice";
import colors from "../../../constants/colors";
import CartItem from "./Components/CartItem";
import OrderSummary from "../../components/OrderSummary";
import Button from "@/app/components/commonComponents/Button";
import RecommendedProductsSlider from "@/app/components/RecommendedProductsSlider";
import SavedLaterItem from "./Components/SavedLaterItem";
import ConfirmationModal from "../../components/commonComponents/ConfirmationModal";
import { router } from "expo-router";
import Footer from "@/app/components/Footer";
import containers from "@/containers";
import { redirectToPage } from "../../../utilities/redirectionHelper";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { RootState } from "@/store/store";
import NoContentFound from "@/app/components/NoContentFound";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import {
  SESSION_EXPIRED,
  ITEM_OUT_OF_STOCK,
  QUANTITY_NOT_AVAILABLE,
} from "../../../constants/customErrorMessages";
import { Product, ProductsAPI } from "@/services/productService";
import styles from "./CartStyles";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import { isAgeRestrictedCartItem } from "@/utilities/ageRestriction";
import AgeRestrictionNote from "@/app/components/commonComponents/AgeRestrictionNote";

const CartScreen = () => {
  const dispatch = useDispatch();
  const isWeb = Platform.OS === "web";

  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const cartItems = useSelector((state: RootState) => state.cart?.items || []);
  const savedForLaterItems = useSelector(
    (state: RootState) => state.savedForLaterItems.items
  );
  const user = useSelector((state: RootState) => state.user.user);

  const [stockAvailable, setStockAvailable] = useState<Record<string, number>>(
    {}
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoadingSimilarProducts, setIsLoadingSimilarProducts] = useState(false);
  const [errorModalState, setErrorModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const hasAgeRestrictedItems = cartItems.some((item: any) =>
    isAgeRestrictedCartItem(item)
  );


  const showErrorAlert = ({
    title,
    message,
    buttonLabel = "OK",
  }: {
    title: string;
    message: string;
    buttonLabel?: string;
  }) => {
    setErrorModalState({
      isVisible: true,
      title,
      message,
      buttonLabel,
    });
  };

  // Bulk product validation using single API call
  const validateAndRefreshProducts = async (items: any[]) => {
    if (items.length === 0) return;

    try {
      // Extract all unique _ids from items
      const itemIds = items.map((item) => item._id);

      // Single API call to get all products
      const products = await ProductsAPI.getProductBy_multipleID(itemIds);

      // Create a map of products by _id for quick lookup
      const productMap = new Map(
        products.map((product) => [product._id, product])
      );

      // Process each cart item
      for (const item of items) {
        const product = productMap.get(item._id);

        if (!product || product.stock === 0) {
          // Product not found or out of stock - remove from cart
          showErrorAlert({
            title: "Product not available",
            message: `The item "${item.name}" is no longer available and has been removed from your cart.`,
          });
          dispatch(removeFromCart(item.id));
        } else {
          // Product exists - refresh cart item with latest data
          dispatch(refreshCartItem({ _id: item._id, data: product }));
        }
      }
    } catch (error: any) {
      console.error("Error validating products:", error);
      showErrorAlert({
        title: "Error",
        message: "Something went wrong while checking product information.",
      });
    }
  };

  // Bulk stock validation for checkout
  const validateCartStock = async (
    cartItems: any[],
    showAlerts: boolean = true
  ): Promise<{ valid: boolean; stockMap: Record<string, number> }> => {
    const stockMap: Record<string, number> = {};

    if (cartItems.length === 0) {
      return { valid: true, stockMap };
    }

    try {
      // Extract all unique _ids
      const itemIds = cartItems.map((item) => item._id);

      // Single API call to get all products
      const products = await ProductsAPI.getProductBy_multipleID(itemIds);

      // Create product map for quick lookup
      const productMap = new Map(
        products.map((product) => [product._id, product])
      );

      // Validate each cart item
      for (const item of cartItems) {
        const product = productMap.get(item._id);
        const stock = product?.stock ?? 0;
        stockMap[item._id] = stock;

        if (!product) {
          if (showAlerts) {
            showErrorAlert({
              title: "Product not found",
              message: `"${item.name}" is no longer available.`,
            });
          }
          return { valid: false, stockMap };
        }

        if (showAlerts && stock === 0) {
          showErrorAlert({
            title: "Out of Stock",
            message: `"${item.name}" is currently out of stock.`,
          });
          return { valid: false, stockMap };
        }

        if (showAlerts && item.quantity > stock) {
          showErrorAlert({
            title: "Insufficient Stock",
            message: `"${item.name}" has only ${stock} in stock. Please adjust the quantity.`,
          });
          return { valid: false, stockMap };
        }
      }

      return { valid: true, stockMap };
    } catch (error) {
      console.error("Error validating cart stock:", error);
      if (showAlerts) {
        showErrorAlert({
          title: "Error",
          message: "Something went wrong while checking stock availability.",
        });
      }
      return { valid: false, stockMap };
    }
  };

  // Bulk stock check for display (cart + saved items)
  const updateStockAvailability = async () => {
    const allItems = [...cartItems, ...savedForLaterItems];

    if (allItems.length === 0) {
      setStockAvailable({});
      return;
    }

    try {
      // Extract all unique _ids
      // const itemIds = [...new Set(allItems.map((item) => item._id))]; // Remove duplicates

      const itemIds = allItems
        .map((item) => item._id ?? null)
        .filter((id) => id !== null);
      // Single API call
      const products = await ProductsAPI.getProductBy_multipleID(itemIds);

      // Build stock map
      const stockMap: Record<string, number> = {};
      products.forEach((product) => {
        if (product && product._id) {
          stockMap[product._id] = product.stock ?? 0;
        }
      });

      setStockAvailable(stockMap);
    } catch (error) {
      console.error("Error fetching stock availability:", error);
      // Set all to 0 on error
      const errorStockMap: Record<string, number> = {};
      [...cartItems, ...savedForLaterItems].forEach((item) => {
        if (item._id !== undefined) {
          errorStockMap[item._id] = 0;
        }
      });
      setStockAvailable(errorStockMap);
    }
  };

  // Initial product validation when cart items change
  useEffect(() => {
    if (cartItems.length > 0) {
      validateAndRefreshProducts(cartItems);
    }
  }, []); // Only run once on mount to avoid infinite loops

  // Update stock availability when cart or saved items change
  useEffect(() => {
    updateStockAvailability();
  }, [cartItems.length, savedForLaterItems.length]);

  // Fetch similar products for recommendations
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setIsLoadingSimilarProducts(true);
        const response = await ProductsAPI.getAllProducts(1, 20);
        // Filter out products that are already in cart
        const cartItemIds = cartItems.map((item: any) => item._id || item.id);
        const filteredProducts = response.data.filter(
          (product: Product) => !cartItemIds.includes(product._id || product.id)
        );
        // Take first 4 products
        setSimilarProducts(filteredProducts.slice(0, 4));
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setSimilarProducts([]);
      } finally {
        setIsLoadingSimilarProducts(false);
      }
    };

    if (isWeb) {
      fetchSimilarProducts();
    }
  }, [cartItems, isWeb]);

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return; // Prevent multiple clicks

    if (!user) {
      showErrorAlert({
        title: "Login Required",
        message: SESSION_EXPIRED,
      });
      redirectToPage(containers.signInScreen);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const { valid } = await validateCartStock(cartItems, true);
      if (valid) {
        redirectToPage(containers.pickUpModeScreen);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Rest of your component methods remain the same...
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

  const handleClearCart = () => {
    showAlert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            cartItems.forEach((item: any) => {
              dispatch(removeFromCart(item.id));
            });
          },
        },
      ]
    );
  };

  // Conditional Header and Footer components
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={CART_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer activeTab="cart" />
  );

  // Conditional Layout component
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  // Your JSX remains the same, just update the Place Order button:
  return (
    <LayoutComponent
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      scrollable={true}
    >
      {isWeb && !isMobileWeb ? (
        // Web/Desktop: No inner ScrollView, PageLayoutWeb handles scrolling
        <View style={[globalStyles.container]}>
          <View style={[globalStyles.pt_0]}>
            {cartItems.length === 0 ? (
              // Empty cart UI...
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
              // Web/Desktop Layout: Two-column layout
              <View style={styles.webContainer}>
                {/* Left Column: Cart Items and Saved for Later */}
                <View style={styles.leftColumn}>
                  {/* Cart Header */}
                  <View style={styles.cartHeader}>
                    <Text style={styles.cartHeaderText}>Cart</Text>
                    <TouchableOpacity onPress={handleClearCart}>
                      <Text style={styles.clearCartText}>Clear Cart</Text>
                    </TouchableOpacity>
                  </View>
                  {hasAgeRestrictedItems && (
                    <AgeRestrictionNote
                      containerStyle={styles.ageWarningContainer}
                      titleStyle={styles.ageWarningTitle}
                      messageStyle={styles.ageWarningText}
                    />
                  )}

                  {/* Cart Items */}
                  {cartItems.map((eachCartItem: any) => (
                    <CartItem
                      handleDelete={handleDelete}
                      key={eachCartItem.id}
                      cartItem={eachCartItem}
                      stockAvailable={stockAvailable[eachCartItem._id] || 0}
                    />
                  ))}
                </View>

                {/* Right Column: Order Details, Place Order, Similar Products */}
                <View style={styles.rightColumn}>
                  {/* Order Summary */}
                  <OrderSummary 
                    cartItems={cartItems} 
                    containerStyle={styles.compactOrderSummary}
                    sectionHeadingStyle={styles.compactOrderSummaryHeading}
                  />

                  {/* Place Order Button */}
                  <View style={styles.placeOrderContainer}>
                    <Button
                      title={isPlacingOrder ? "Processing..." : "Place Order"}
                      onPress={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    />
                  </View>
                </View>
              </View>
            )}
                {/* Saved for Later */}
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

          </View>

          <ConfirmationModal
            onClose={() => {
              setIsModalVisible(false);
            }}
            isModalVisible={isModalVisible}
            title="Delete Product"
            text="Are you sure you want to delete this? You can save this item for later too."
            submitText="Delete Item"
            handleSubmit={confirmDelete}
            cancelText="Save for Later"
            handleCancel={cancelDelete}
          />
          <ConfirmationModal
            onClose={() =>
              setErrorModalState((prev) => ({ ...prev, isVisible: false }))
            }
            isModalVisible={errorModalState.isVisible}
            title={errorModalState.title}
            text={errorModalState.message}
            submitText={errorModalState.buttonLabel}
            handleSubmit={() =>
              setErrorModalState((prev) => ({ ...prev, isVisible: false }))
            }
          />
        </View>
      ) : (
        // Mobile: Use ScrollView
        <View style={[globalStyles.container]}>
          <ScrollView>
            <View style={[globalStyles.pt_0]}>

              {/* MOBILE CART SECTION */}
              {cartItems.length === 0 ? (
                // Empty cart UI
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
                  {hasAgeRestrictedItems && (
                    <AgeRestrictionNote
                      containerStyle={styles.ageWarningContainer}
                      titleStyle={styles.ageWarningTitle}
                      messageStyle={styles.ageWarningText}
                    />
                  )}
                  {/* Cart Items */}
                  {cartItems.map((eachCartItem: any) => (
                    <CartItem
                      handleDelete={handleDelete}
                      key={eachCartItem.id}
                      cartItem={eachCartItem}
                      stockAvailable={stockAvailable[eachCartItem._id] || 0}
                    />
                  ))}

                  {/* Order Summary */}
                  <OrderSummary cartItems={cartItems} />

                  {/* Place Order */}
                  <View
                    style={{
                      width: "50%",
                      marginHorizontal: "auto",
                      paddingBottom: 16,
                      marginTop: 16,
                    }}
                  >
                    <Button
                      title={isPlacingOrder ? "Processing..." : "Place Order"}
                      onPress={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    />
                  </View>
                </>
              )}

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

            </View>

            {/* CONFIRMATION MODAL */}
            <ConfirmationModal
              onClose={() => setIsModalVisible(false)}
              isModalVisible={isModalVisible}
              title="Delete Product"
              text="Are you sure you want to delete this? You can save this item for later too."
              submitText="Delete Item"
              handleSubmit={confirmDelete}
              cancelText="Save for Later"
              handleCancel={cancelDelete}
            />
            <ConfirmationModal
              onClose={() =>
                setErrorModalState((prev) => ({ ...prev, isVisible: false }))
              }
              isModalVisible={errorModalState.isVisible}
              title={errorModalState.title}
              text={errorModalState.message}
              submitText={errorModalState.buttonLabel}
              handleSubmit={() =>
                setErrorModalState((prev) => ({ ...prev, isVisible: false }))
              }
            />
          </ScrollView>
        </View>
      )}

      {confirmationModal}
    </LayoutComponent>
  );
};

export default CartScreen;
