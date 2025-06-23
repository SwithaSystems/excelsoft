import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  BackHandler,
} from "react-native";
import styles from "./orderDetailsScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import { router, useLocalSearchParams } from "expo-router";
import RecommendedProductsSlider from "@/components/RecommendedProductsSlider";
import products from "@/data/products";
import Footer from "@/components/Footer";
import {
  clearNavigationStack,
  redirectToPage,
} from "@/utilities/redirectionHelper";
import containers from "@/containers";
import QRCodeDisplay from "../../components/QRCodeDisplay";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";
import colors from "../config/colors";
import PageLayout from "../pageLayoutProps";
import { ADMIN_ORDER_DETAIL_SCREEN_TITLE } from "../config/stringLiterals";

const orderDetailsScreen = () => {
  const { from } = useLocalSearchParams();
  const { orderId } = useLocalSearchParams();
  const { orderData } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  // const cartItems = useSelector((state: any) => [...state.cart.items]);
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<any[]>([]);

  const [shippingAddress_order, setShippingAddress_order] =
    React.useState<any>(null);
  console.log("orderId", orderId);

  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const response = await orderService.getOrderById(String(orderId));
          console.log("response", response);
          setOrderDetails(response);
        } catch (err) {
          console.error("Failed to fetch order details:", err);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  React.useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        if (orderData && typeof orderData === "string") {
          const parsed = JSON.parse(orderData);
          setOrderDetails(parsed);
        } else if (orderId) {
          const response = await orderService.getOrderById(String(orderId));
          setOrderDetails(response);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      }
    };

    loadOrderDetails();
  }, [orderId, orderData]);

  console.log("orderDetails", orderDetails);
  console.log("shippingAddress_id", orderDetails?.shippingAddress);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!orderDetails?.shippingAddress) return;
      try {
        const response = await addressService.getShippingAddressById(
          orderDetails?.shippingAddress
        );
        console.log("response shipping address", response);
        setShippingAddress_order(response);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };
    fetchShippingAddress();
  }, [orderDetails?.shippingAddress]);

  const cartItems = orderDetails?.products || [];

  console.log("Cart Items:", cartItems);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!orderDetails?.products?.length) return;

      try {
        const detailedCartItems = await Promise.all(
          orderDetails.products.map(async (item: any) => {
            const productDetails = await ProductsAPI.getProductBYID(
              item.productId
            );
            return {
              ...item,
              image: productDetails.image,
            };
          })
        );
        setCartItemsWithDetails(detailedCartItems);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    };

    fetchProductDetails();
  }, [orderDetails]);

  console.log("orderData in orderDetails", orderData);
  console.log("ordernumber", orderDetails?.orderNumber);
  const rawDate = new Date(orderDetails?.orderDate);
  const formattedDate = `${rawDate.getDate().toString().padStart(2, "0")}/${(
    rawDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${rawDate.getFullYear()}`;

  console.log("cartItemsWithDetails", cartItemsWithDetails);

  console.log("orderDetails by order ID", orderDetails);
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

  useEffect(() => {
    const handleHardwareBackPress = () => {
      clearNavigationStack("home/home");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    );
    return () => backHandler.remove();
  }, []);

  return (
    <>
      {/* <SafeAreaView style={globalStyles.safeAreaContainer}> */}
      <PageLayout
        hasFooter
        hasHeader
        scrollable
        headerComponent={
          <Header
            headerText={ADMIN_ORDER_DETAIL_SCREEN_TITLE}
            needResetNavigation={from !== "myOrders"}
          />
        }
        footerComponent={<Footer />}
      >
        <View style={styles.container}>
          {/* <Header
            headerText="Order Details"
            needResetNavigation={from !== "myOrders"}
          />
          <ScrollView> */}
          <View
            style={[
              // globalStyles.sectionContent,
              globalStyles.pt_0,
            ]}
          >
            <View style={{}}>
              <QRCodeDisplay
                qrValue={orderDetails?.orderNumber}
                noteText="*Please present this QR code to our store personnel at the time of pickup. Also, ensure you carry a valid ID proof."
              />
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
                {orderDetails?.status}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Order Number: </Text>
              <Text style={styles.orderSummaryItemText}>
                {orderDetails?.orderNumber}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Date Placed: </Text>
              <Text style={styles.orderSummaryItemText}>
                {/* {orderDetails?.orderDate} */}
                {formattedDate}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Shipping:</Text>
              <Text style={styles.orderSummaryItemText}>
                {orderDetails?.shippingCharges}
              </Text>
            </View>
            <View style={styles.orderSummaryItem}>
              <Text style={styles.orderSummaryItemText}>Sub Total:</Text>
              <Text style={styles.orderSummaryItemText}>
                {orderDetails?.totalAmount.toFixed(2)}
              </Text>
            </View>
            <View>
              {cartItemsWithDetails.map((eachProduct: any) => (
                <CartItem
                  hideActions={true}
                  itemContainerStyle={styles.cartItemContainerStyle}
                  key={eachProduct._id}
                  cartItem={eachProduct}
                />
              ))}
            </View>
            <View style={[globalStyles.mb_2, styles.deliverSection]}>
              <Text
                style={[
                  globalStyles.fontWeight500,
                  styles.orderSummaryItemText,
                ]}
              >
                Deliver To:
              </Text>
              <TouchableOpacity
                onPress={() => {
                  redirectToPage(containers.deliveryTrackingScreenScreen, {
                    orderId: orderDetails?._id,
                  });
                }}
              >
                <Text style={[globalStyles.btnSmUnderLine, { fontSize: 12 }]}>
                  Track Order
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[globalStyles.mb_2, styles.addressText]}>
              Choosen Delivery: {orderDetails?.pickupMode}
            </Text>
            {orderDetails?.pickupMode === "homeDelivery" &&
              shippingAddress_order && (
                <Text>
                  Address:{" "}
                  {[
                    shippingAddress_order.line1,
                    shippingAddress_order.line2,
                    shippingAddress_order.city,
                    shippingAddress_order.state,
                    shippingAddress_order.postalCode,
                    shippingAddress_order.phone,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              )}

            <View>
              <RecommendedProductsSlider
                recommendedProducts={recommendedProducts}
                sectionTitleStyle={[
                  styles.orderSummaryItemText,
                  globalStyles.fontWeight500,
                  //{marginBottom:16},
                ]}
                title="Would you like to see these too?"
                showAddToCart={false}
              />
            </View>
            <View style={styles.buttonContainer}>
              {/* <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    redirectToPage(containers.cancelOrderScreen, {
                      orderDetails: orderDetails,
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Request Cancellation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() => {
                    redirectToPage(containers.returnOrderScreen, {
                      orderDetails: JSON.stringify(orderDetails),
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Request Return</Text>
                </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </PageLayout>
      {/* </ScrollView> */}
      {/* <Footer /> */}
      {/* </View> */}
      {/* </SafeAreaView> */}
    </>
  );
};

export default orderDetailsScreen;
