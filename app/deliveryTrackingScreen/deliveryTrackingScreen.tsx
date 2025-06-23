import { DELIVERY_TRACKING_SCREEN_TITLE } from "./../config/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { use, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import OrderTimeline from "./components/OrderTimeline";
import styles from "./deliveryTrackingScreenStyles";
import Footer from "@/components/Footer";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../config/colors";
import { orderService } from "@/services/orderService";
import AdminFooter from "@/components/AdminFooter";
import PageLayout from "../pageLayoutProps";

const deliveryTrackingScreen = () => {
  // const orderStatus = [
  //   "Order Placed",
  //   "Order Packed",
  //   "Out for delivery",
  //   "Reached the Location",
  //   "Order Delivered Successully!!",
  // ];

  const props = useLocalSearchParams();
  const from = props.from;
  const orderId = useLocalSearchParams();
  const [allOrderStatuses, setAllOrderStatuses] = useState<string[]>([]);
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

  const getAllOrderStatuses = async () => {
    const orderStatuses = await orderService.getAllOrderStatuses();
    console.log("all Order statuses", orderStatuses);
    setAllOrderStatuses(orderStatuses?.statuses);
  };

  useEffect(() => {
    getAllOrderStatuses();
  }, []);
  console.log("orderDetails in tracking order", orderDetails?.status);

  const paymentStatus = ["Payment Pending", "Payment Confirmed"];
  const filteredStatuses = from === "admin" 
            ? allOrderStatuses
            : allOrderStatuses.filter( status => !paymentStatus.includes(status));

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText={DELIVERY_TRACKING_SCREEN_TITLE} />}
      footerComponent={
        from === "admin" ? <AdminFooter /> : <Footer navigation={router} />
      }
    >
      <View style={[globalStyles.container]}>
        {/* <Header headerText={DELIVERY_TRACKING_SCREEN_TITLE} /> */}
        {/* <ScrollView> */}
        <View
          style={
            [
              // globalStyles.sectionContent
            ]
          }
        >
          <Text style={styles.headingNote}>
            Your Order packed Successfully!! Let’s see the Progress!
          </Text>
          <View style={styles.trackingContainer}>  
            <OrderTimeline
              statusList={filteredStatuses}
              actualStatus={orderDetails?.status}
            />
          </View>
        </View>
      </View>
    </PageLayout>
    /* </ScrollView>*/
  );
};

export default deliveryTrackingScreen;
