import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { use, useEffect } from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import OrderTimeline from "./components/OrderTimeline";
import styles from "./deliveryTrackingScreenStyles";
import Footer from "@/components/Footer";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../config/colors";
import { orderService } from "@/services/orderService";
import AdminFooter from "@/components/AdminFooter";

const deliveryTrackingScreen = () => {
  const orderStatus = [
    "Order Placed",
    "Order Packed",
    "Out for delivery",
    "Reached the Location",
    "Order Delivered Successully!!",
  ];
  const props = useLocalSearchParams();
  const from = props.from;
  const orderId = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = React.useState<any>(null);
  console.log("orderId", orderId.orderId);
  const getOrderById = async () => {
    const order_Details = await orderService.getOrderByMongoId(
      String(orderId.orderId)
    );
    console.log("order_Details", order_Details);
    setOrderDetails(order_Details);
  };
  useEffect(() => {
    getOrderById();
  }, []);
  console.log("orderDetails in tracking order", orderDetails?.status);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={[globalStyles.container]}>
        <Header headerText="Order Tracking" />
        <ScrollView>
          <View style={[globalStyles.sectionContent]}>
            <Text style={styles.headingNote}>
              Your Order packed Successfully!! Let’s see the Progress!
            </Text>
            <View style={styles.trackingContainer}>
              <OrderTimeline
                statusList={orderStatus}
                actualStatus={orderDetails?.status}
              />
            </View>
          </View>
        </ScrollView>
        {from === "admin" ? <AdminFooter /> : <Footer navigation={router} />}
      </View>
    </SafeAreaView>
  );
};

export default deliveryTrackingScreen;
