import { DELIVERY_TRACKING_SCREEN_TITLE } from "./../config/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import OrderTimeline from "./components/OrderTimeline";
import styles from "./deliveryTrackingScreenStyles";
import Footer from "@/components/Footer";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../config/colors";
import { orderService } from "@/services/orderService";
import AdminFooter from "@/components/AdminFooter";
import PageLayout from "../pageLayoutProps";
// Order status constants matching backend response
const ORDER_STATUS = {
  ORDER_PLACED: "Order Placed",
  AWAITING_AGE_VERIFICATION: "Awaiting Age Verification",
  PREPARING: "Preparing", // Note: backend uses "Preparing" not "Preparing Order"
  READY: "Ready",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  COLLECTED: "Collected",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
  REJECTED: "Rejected",
  STOCK_ISSUE: "Stock Issue",
  REFUND_INITIATED: "Refund Initiated",
  REFUND_COMPLETED: "Refund Completed",
} as const;

const deliveryTrackingScreen = () => {
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

  // Function to check if order has age-restricted products
  const hasAgeRestrictedProducts = (order: any): boolean => {
    if (!order?.items && !order?.products) return false;

    // Check items array (adjust property names based on your data structure)
    const items = order.items || order.products || [];
    return items.some(
      (item: any) =>
        item.isAgeRestricted ||
        item.ageRestricted ||
        item.requiresAgeVerification ||
        item.product?.isAgeRestricted ||
        item.product?.ageRestricted
    );
  };

  // Function to get filtered statuses based on order type and user role
  const getFilteredStatuses = (): string[] => {
    const paymentStatus = ["Payment Pending", "Payment Confirmed"];

    // Base filtering for admin vs customer
    let filteredStatuses =
      from === "admin"
        ? allOrderStatuses
        : allOrderStatuses.filter((status) => !paymentStatus.includes(status));

    if (
      from !== "admin" &&
      orderDetails &&
      !hasAgeRestrictedProducts(orderDetails)
    ) {
      filteredStatuses = filteredStatuses.filter(
        (status) => status !== ORDER_STATUS.AWAITING_AGE_VERIFICATION
      );
    }

    return filteredStatuses;
  };

  // Function to get relevant statuses in the correct order for the timeline
  const getOrderedStatusesForTimeline = (): string[] => {
    const hasAgeRestriction =
      orderDetails && hasAgeRestrictedProducts(orderDetails);

    // Define the order flow based on backend statuses
    const baseFlow = [
      ORDER_STATUS.ORDER_PLACED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED,
    ];

    const ageRestrictedFlow = [
      ORDER_STATUS.ORDER_PLACED,
      ORDER_STATUS.AWAITING_AGE_VERIFICATION,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY,
      ORDER_STATUS.OUT_FOR_DELIVERY,
      ORDER_STATUS.DELIVERED,
    ];

    // For pickup orders, replace DELIVERED with COLLECTED
    const isPickupOrder =
      orderDetails?.pickupMode === "storePickup" ||
      orderDetails?.type === "curbsidePickup";

    let relevantFlow: any = hasAgeRestriction ? ageRestrictedFlow : baseFlow;

    if (isPickupOrder) {
      relevantFlow = relevantFlow
        .map((status: any) =>
          status === ORDER_STATUS.DELIVERED ? ORDER_STATUS.COLLECTED : status
        )
        .filter((status: any) => status !== ORDER_STATUS.OUT_FOR_DELIVERY);
    }

    // Filter to only include statuses that exist in the backend response
    return relevantFlow.filter((status: any) =>
      allOrderStatuses.includes(status)
    );
  };

  console.log("orderDetails in tracking order", orderDetails?.status);
  console.log(
    "hasAgeRestrictedProducts",
    orderDetails && hasAgeRestrictedProducts(orderDetails)
  );

  // Get the appropriate statuses for display
  const displayStatuses = getOrderedStatusesForTimeline();

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
        <View>
          <Text style={styles.headingNote}>
            Your Order packed Successfully!! Let's see the Progress!
          </Text>
          <View style={styles.trackingContainer}>
            <OrderTimeline
              statusList={displayStatuses}
              actualStatus={orderDetails?.status}
            />
          </View>
        </View>
      </View>
    </PageLayout>
  );
};

export default deliveryTrackingScreen;
