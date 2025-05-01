import React, { useEffect, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import RecommendedProductsSlider from "@/components/RecommendedProductsSlider";
import products from "@/data/products";
import Footer from "@/components/Footer";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import QRCodeDisplay from "../../components/QRCodeDisplay";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { ProductsAPI } from "@/services/productService";

const orderDetailsScreen = () => {
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
  const formattedDate = new Date(orderDetails?.orderDate).toLocaleDateString(
    "en-CA"
  );
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

  return (
    <>
      <View style={styles.container}>
        <Header headerText="Order Details" />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
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
                Processed
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
            <View style={{ marginTop: 8 }}>
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
                  redirectToPage(containers.deliveryTrackingScreenScreen);
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
            {orderDetails?.pickupMode === "homeDelivery" && (
              <Text style={[globalStyles.mb_3, styles.addressText]}>
                Address: {shippingAddress_order?.line1}
                {"\n"}
                {shippingAddress_order?.city}, {shippingAddress_order?.state}
                {"\n"}
                {shippingAddress_order?.postalCode},{" "}
                {shippingAddress_order?.country}
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
              <TouchableOpacity
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
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Footer />
      </View>
    </>
  );
};

export default orderDetailsScreen;
