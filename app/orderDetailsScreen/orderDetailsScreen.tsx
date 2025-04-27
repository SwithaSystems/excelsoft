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
import { router, useLocalSearchParams } from "expo-router";
import RecommendedProductsSlider from "@/components/RecommendedProductsSlider";
import products from "@/data/products";
import Footer from "@/components/Footer";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import QRCodeDisplay from "../../components/QRCodeDisplay";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";

const orderDetailsScreen = () => {
  const { orderId } = useLocalSearchParams();
  const { orderData } = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  const cartItems = useSelector((state: any) => [...state.cart.items]);

  console.log("cartItems in orderDetails", cartItems);

  console.log("orderData in orderDetails", orderData);

  React.useEffect(() => {
    if (typeof orderData === "string") {
      try {
        const parsed = JSON.parse(orderData);
        setOrderDetails(parsed);
      } catch (err) {
        console.error("Failed to parse orderData:", err);
      }
    }
  }, [orderData]);
  console.log("orderDetails", orderDetails);
  console.log("ordernumber", orderDetails?.orderNumber);

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

  // const deliveryMode = {
  //   mode: "Home Delivery",
  //   address:
  //     "H.No: 1-123, xyz street, That Town, Near Mellinda Cafe, UK, 3123456",
  // };
  // const cartItems = [
  //   {
  //     id: 1,
  //     image: require("../../assets/baby-bicycle.png"), // Replace with your image paths
  //     name: "Duck Toys",
  //     price: 10.0,
  //     originalPrice: 6.99,
  //     quantity: 1,
  //   },
  //   {
  //     id: 2,
  //     image: require("../../assets/baby-bicycle.png"),
  //     name: "Orange Juice",
  //     price: 3.0,
  //     quantity: 2,
  //   },
  //   {
  //     id: 3,
  //     image: require("../../assets/baby-bicycle.png"),
  //     name: "Whole Wheat Bread",
  //     price: 12.0,
  //     quantity: 1,
  //   },
  // ];
  return (
    <>
      <View style={styles.container}>
        <Header headerText="Order Details" />
        <ScrollView>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
            if(orderDetails?.status === "Pending")&&
            {
              <View style={{}}>
                <QRCodeDisplay
                  qrValue={orderDetails?.orderNumber}
                  noteText="*Please present this QR code to our store personnel at the time of pickup. Also, ensure you carry a valid ID proof."
                />
                {/* <Text style={styles.barCodeNote}>
                Show this bar code to our store personnel during the pickup.
              </Text> */}
              </View>
            }
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
                {orderDetails?.orderDate}
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
                {orderDetails?.totalAmount}
              </Text>
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
            <View style={globalStyles.mb_2}>
              <Text style={globalStyles.fontWeight500}>Deliver To:</Text>
              <TouchableOpacity
                onPress={() => {
                  redirectToPage(containers.deliveryTrackingScreenScreen);
                }}
              >
                <Text style={globalStyles.btnSmUnderLine}>Track Order</Text>
              </TouchableOpacity>
            </View>
            <Text style={globalStyles.mb_2}>
              Choosen Delivery: {orderDetails?.pickupMode}
            </Text>
            <Text style={globalStyles.mb_3}>
              Address: {orderDetails?.shippingAddress?.line1}
              {"\n"}
              {orderDetails?.shippingAddress?.city},{" "}
              {orderDetails?.shippingAddress?.state}
              {"\n"}
              {orderDetails?.shippingAddress?.postalCode},{" "}
              {orderDetails?.shippingAddress?.country}
            </Text>
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
        </ScrollView>
        <Footer />
      </View>
    </>
  );
};

export default orderDetailsScreen;
