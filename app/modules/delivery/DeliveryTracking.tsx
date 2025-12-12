import {
  DELIVERY_MODE_CURBSIDE,
  DELIVERY_MODE_HOME,
  DELIVERY_MODE_STORE,
  DELIVERY_TRACKING_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import OrderTimeline from "./Components/OrderTimeline";
import styles from "./DeliveryTrackingStyles";
import Button from "@/app/components/commonComponents/Button";
import Footer from "@/app/components/Footer";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../../../constants/colors";
import { orderService } from "@/services/orderService";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

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

  // console.log("orderId", orderId.orderId);

  const getOrderById = async () => {
    const order_Details = await orderService.getOrderByMongoId(
      String(orderId.orderId)
    );
    // console.log("order_Details", order_Details);
    setOrderDetails(order_Details);
  };

  useEffect(() => {
    getOrderById();
  }, []);

  const getAllOrderStatuses = async () => {
    const orderStatuses = await orderService.getAllOrderStatuses();
    // console.log("all Order statuses", orderStatuses);
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

  const getOrderedStatusesForTimeline = (): string[] => {
    if (!orderDetails || !allOrderStatuses.length) return [];

    const hasAgeRestriction = hasAgeRestrictedProducts(orderDetails);

    const status = orderDetails?.status;

    let flow: string[] = hasAgeRestriction
      ? [
          ORDER_STATUS.ORDER_PLACED,
          ORDER_STATUS.AWAITING_AGE_VERIFICATION,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY,
          ORDER_STATUS.OUT_FOR_DELIVERY,
          ORDER_STATUS.DELIVERED,
        ]
      : [
          ORDER_STATUS.ORDER_PLACED,
          ORDER_STATUS.PREPARING,
          ORDER_STATUS.READY,
          ORDER_STATUS.OUT_FOR_DELIVERY,
          ORDER_STATUS.DELIVERED,
        ];

    // For pickup orders, replace DELIVERED with COLLECTED
    const isPickupOrder =
      orderDetails?.pickupMode === DELIVERY_MODE_STORE ||
      orderDetails?.type === DELIVERY_MODE_CURBSIDE;

    // let relevantFlow: any = hasAgeRestriction ? ageRestrictedFlow : baseFlow;

    if (isPickupOrder) {
      flow = flow
        .map((status: any) =>
          status === ORDER_STATUS.DELIVERED ? ORDER_STATUS.COLLECTED : status
        )
        .filter((status: any) => status !== ORDER_STATUS.OUT_FOR_DELIVERY);
    }

    //Scenario when there is a stock issue for the ordered product
    if (status === ORDER_STATUS.STOCK_ISSUE) {
      const prepIndex = flow.indexOf(ORDER_STATUS.PREPARING);
      if (prepIndex !== -1) {
        flow.slice(0, prepIndex + 1);
        flow.push(ORDER_STATUS.STOCK_ISSUE);
      }
      return flow;
    }

    //Scenario when the order is cancelled/failed/rejected
    const negativeStatuses = [
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.FAILED,
      ORDER_STATUS.REJECTED,
    ];

    if (negativeStatuses.includes(status)) {
      const currentIndex = flow.indexOf(status);

      const lastUpdatedIndex =
        flow.indexOf(orderDetails.lastValidStatus) >= 0
          ? flow.indexOf(orderDetails.lastValidStatus)
          : flow.indexOf(ORDER_STATUS.PREPARING);

      const truncatedFlow =
        lastUpdatedIndex >= 0 ? flow.slice(0, lastUpdatedIndex + 1) : [];

      return [...truncatedFlow, status];
    }
    // Filter to only include statuses that exist in the backend response
    return flow.filter((status: any) => allOrderStatuses.includes(status));
  };

  // console.log("orderDetails in tracking order", orderDetails?.status);
  // console.log(
  //   "hasAgeRestrictedProducts",
  //   orderDetails && hasAgeRestrictedProducts(orderDetails)
  // );

  // Get the appropriate statuses for display
  const displayStatuses = getOrderedStatusesForTimeline();

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={
        <Header headerText={DELIVERY_TRACKING_SCREEN_TITLE}
        needResetNavigation = {false}
      />}
      footerComponent={
        from === "admin" ? <AdminFooter /> : <Footer navigation={router} />
      }
    >
      <View style={[globalStyles.container]}>
        <View>
          {from === "admin" && orderDetails ? (
            <View style={styles.adminInfoCard}>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Order ID: </Text>#
                {orderDetails?.orderNumber}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Customer: </Text>
                {orderDetails?.userId?.firstName}{" "}
                {orderDetails?.userId?.lastName}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.label}>Pick Up Choice: </Text>
                {orderDetails?.pickupMode === DELIVERY_MODE_HOME
                  ? "Home Delivery"
                  : "Store Pickup"}
              </Text>
            </View>
          ) : (
            <View>
              <Text style={styles.headingNote}>
                Your Order placed Successfully!! Let's see the Progress!
              </Text>
            </View>
          )}

          <View style={styles.trackingContainer}>
            <OrderTimeline
              statusList={displayStatuses}
              actualStatus={orderDetails?.status}
              reason={orderDetails?.reason}
            />
          </View>

          {from === "admin" && (
            <View style={[globalStyles.mt_4, { marginBottom: 40 }]}>
              <Button
                title="View Order Details"
                onPress={() => {
                  redirectToPage(containers.AdminOrderDetailScreen, {
                    orderId: orderDetails?._id,
                  });
                }}
              />
            </View>
          )}
        </View>
      </View>
    </PageLayout>
  );
};

export default deliveryTrackingScreen;
