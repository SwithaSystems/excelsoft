import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import styles from "./AdminDashboardStyles";
import BrandHeader from "@/components/BrandHeader";
import { globalStyles } from "@/assets/styles/globalStyles";
import Footer from "@/components/Footer";
import ordersData from "../../data/ordersData";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";
import AdminFooter from "@/components/AdminFooter";
import { orderService } from "@/services/orderService";
import CurrencySymbol from "@/constants/CurrencySymbol";

const AdminDashboard = () => {
  const [allTodayOrders, setAllTodayOrders] = React.useState<any>([]);
  const [allOrders, setAllOrders] = React.useState<any>([]);

  const today = new Date();
  const dateOnly = today.toISOString().split("T")[0];

  const getOrdersByOrderDate = async () => {
    const allTodayOrders = await orderService.getOrdersByOrderDate(dateOnly);
    setAllTodayOrders(allTodayOrders);
  };
  const getAllOrders = async () => {
    const allOrders = await orderService.getAllOrders();
    setAllOrders(allOrders);
  };

  React.useEffect(() => {
    getOrdersByOrderDate();
    getAllOrders();
  }, []);

  console.log("allTodayOrders", allTodayOrders);

  console.log("allOrders", allOrders);

  // const totalOrders = allTodayOrders.length;
  const pendingOrders = allOrders.filter(
    (order: any) => order.status !== "Order Delivered Successfully"
  );
  const recentOrders = allOrders
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )
    .slice(0, 3);
  console.log("recentOrders", recentOrders);

  const today_Revenue = allOrders
    .filter((order: any) => order.status === "Order Delivered Successfully")
    .reduce((total: number, order: any) => total + order.totalAmount, 0);

  const paddingTop =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0;
  const getStatusBadgeStyle = (status: String) => {
    switch (status) {
      case "Completed":
        return globalStyles.orderCompletedBadge;
      case "Pending":
        return globalStyles.orderPendingBadge;
      case "Canceled":
        return globalStyles.orderCanceledBadge;
    }
  };

  const renderOrder = ({ item }: any) => {
    const orderTime = new Date(item.orderDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    console.log("orderTime", orderTime);

    return (
      <TouchableOpacity
        onPress={() => {
          redirectToPage(containers.AdminOrderDetailScreen);
        }}
      >
        <View style={styles.orderContainer}>
          <View>
            <Text style={styles.orderId}>{item.orderNumber}</Text>
            {/* <Text style={styles.customerName}>{item.customer}</Text> */}
            <Text style={styles.orderTime}>{orderTime}</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              // justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Text
              style={[
                globalStyles.OrderStatusText,
                getStatusBadgeStyle(item.status),
              ]}
            >
              {item.status}
            </Text>
            <Text style={styles.orderAmount}>
              {item.amount}
              <Ionicons
                style={{ marginLeft: 8 }}
                name="chevron-forward"
                color={"#94A3B8"}
                size={20}
              />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView style={globalStyles.safeAreaContainer}>
        <View style={[styles.container, { paddingTop }]}>
          <BrandHeader hideUserGreeting={true} />
          console.log("hideUserGreeting:", props.hideUserGreeting);
          <ScrollView>
            <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
              <Text style={styles.title}>Dashboard</Text>

              <View style={styles.metricsContainer}>
                <View style={styles.metricBox}>
                  <View style={styles.metricIconContainer}>
                    <MaterialIcons
                      name="work-outline"
                      size={24}
                      color="#2563EB"
                    />
                    <Text style={styles.metricTitle}>Total Orders</Text>
                  </View>
                  <View>
                    <Text style={styles.metricValue}>{allOrders.length}</Text>
                    <View style={styles.salesRaiseSection}>
                      <Ionicons
                        name="trending-up-outline"
                        size={24}
                        color={colors.primary}
                        style={{ paddingRight: 8 }}
                      />
                      <Text style={styles.metricChange}>+12.5%</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.metricBox}>
                  <View style={styles.metricIconContainer}>
                    <MaterialIcons
                      name="work-outline"
                      size={24}
                      color="#2563EB"
                    />
                    <Text style={styles.metricTitle}>Pending Orders</Text>
                  </View>
                  <View>
                    <Text style={styles.metricValue}>
                      {pendingOrders.length}
                    </Text>
                    {/* <View style={styles.salesRaiseSection}>
                      <Ionicons
                        name="trending-up-outline"
                        size={24}
                        color={colors.primary}
                        style={{ paddingRight: 8 }}
                      />
                      <Text style={styles.metricChange}>5 new</Text>
                    </View> */}
                  </View>
                </View>
                <View style={styles.metricBox}>
                  <View style={styles.metricIconContainer}>
                    <MaterialIcons
                      name="work-outline"
                      size={24}
                      color="#2563EB"
                    />
                    <Text style={styles.metricTitle}>Today's Revenue</Text>
                  </View>
                  <View>
                    <Text style={styles.metricValue}>
                      {CurrencySymbol}
                      {today_Revenue.toFixed(2)}
                    </Text>
                    <View style={styles.salesRaiseSection}>
                      <Ionicons
                        name="trending-up-outline"
                        size={24}
                        color={colors.primary}
                        style={{ paddingRight: 8 }}
                      />
                      <Text style={styles.metricChange}>+14.5%</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.ordersHeader}>
                <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
                <TouchableOpacity
                  onPress={() => {
                    redirectToPage(containers.AdminSeeAllOrdersScreen);
                  }}
                >
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={recentOrders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.id}
              />
            </View>
          </ScrollView>
          <AdminFooter activeTab="home" />
        </View>
      </SafeAreaView>
    </>
  );
};

export default AdminDashboard;
