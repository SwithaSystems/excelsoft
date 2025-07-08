import React, { useMemo, useCallback } from "react";
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
import PageLayout from "../pageLayoutProps";
import { router, useLocalSearchParams } from "expo-router";

const AdminDashboard = () => {
  const { refresh } = useLocalSearchParams();
  const [allTodayOrders, setAllTodayOrders] = React.useState<any>([]);
  const [allOrders, setAllOrders] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);

  // Memoize date calculation
  const dateOnly = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  // Optimize API calls with error handling and loading states
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [todayOrders, orders] = await Promise.all([
        orderService.getOrdersByOrderDate(dateOnly),
        orderService.getAllOrders(),
      ]);

      setAllTodayOrders(todayOrders);
      setAllOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [dateOnly]);

  React.useEffect(() => {
    fetchData();
    if (refresh === "true") {
      router.replace("/AdminDashboard/AdminDashboard");
    }
  }, [fetchData]);

  // Memoize expensive calculations
  const dashboardMetrics = useMemo(() => {
    if (!allOrders.length) {
      return {
        totalOrders: 0,
        pendingOrders: [],
        recentOrders: [],
        todayRevenue: 0,
      };
    }

    const pendingOrders = allOrders.filter(
      (order: any) => order.status !== "Delivered"
    );

    const recentOrders = allOrders
      .slice()
      .sort(
        (a: any, b: any) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )
      .slice(0, 3);

    const todayRevenue = allOrders
      .filter((order: any) => order.status === "Delivered" || "Collected")
      .reduce((total: number, order: any) => total + order.totalAmount, 0);

    return {
      totalOrders: allOrders.length,
      pendingOrders,
      recentOrders,
      todayRevenue,
    };
  }, [allOrders]);

  const paddingTop = useMemo(
    () => (Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0),
    []
  );

  const getStatusBadgeStyle = useCallback((status: String) => {
    switch (status) {
      case "Order Placed":
        return globalStyles.orderPlacedBadge;
      case "Delivered":
        return globalStyles.orderCompletedBadge;
      case "Pending":
        return globalStyles.orderPendingBadge;
      case "Cancelled":
        return globalStyles.orderCanceledBadge;
      default:
        return {};
    }
  }, []);

  // Memoize order item component
  const OrderItem = React.memo(({ item }: any) => {
    const orderTime = useMemo(
      () =>
        new Date(item.orderDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      [item.orderDate]
    );

    const handlePress = useCallback(() => {
      redirectToPage(containers.AdminOrderDetailScreen, {
        orderId: item._id,
      });
    }, [item._id]);

    return (
      <TouchableOpacity onPress={handlePress}>
        <View style={styles.orderContainer}>
          <View>
            <Text style={styles.orderId}>{`#ORD-${item.orderNumber}`}</Text>
            <Text style={styles.orderTime}>{orderTime}</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
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
                color={colors.dirtyBlue}
                size={20}
              />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const renderOrder = useCallback(
    ({ item }: any) => <OrderItem item={item} />,
    []
  );

  const handleSeeAllPress = useCallback(() => {
    redirectToPage(containers.AdminSeeAllOrdersScreen);
  }, []);

  const keyExtractor = useCallback((item: any) => item.id || item._id, []);
  // Helper function to format date/time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMs = now.getTime() - orderDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
    }
  };
  const renderOrderItem = ({ item }: any) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            redirectToPage(containers.AdminOrderDetailScreen, {
              orderId: item._id,
            });
          }}
        >
          <View style={styles.eachOrderItem}>
            <View
              style={[
                globalStyles.flexRow,
                globalStyles.justifyContentBetween,
                globalStyles.mb_1,
              ]}
            >
              <Text style={globalStyles.size_16}>
                #ORD-{item.orderNumber || item._id || "N/A"}
              </Text>
              <Text style={globalStyles.size_16}>
                {getTimeAgo(item.createdAt)} ago
              </Text>
            </View>
            <View
              style={[
                globalStyles.flexRow,
                globalStyles.justifyContentBetween,
                globalStyles.mb_3,
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.idContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                      {typeof item.userId === "object" && item.userId?.firstName
                        ? `${item.userId.firstName} ${
                            item.userId.lastName || ""
                          }`.trim()
                        : `User ID: ${
                            typeof item.userId === "string"
                              ? item.userId
                              : item.userId?._id || "N/A"
                          }`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      redirectToPage(containers.deliveryTrackingScreenScreen, {
                        from: "admin",
                        orderId: item._id,
                      });
                    }}
                  >
                    <Text style={styles.trackOrderText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[globalStyles.size_16, globalStyles.fontWeight500]}>
                Total: {CurrencySymbol}{" "}
                {typeof item.totalAmount === "number"
                  ? item.totalAmount.toFixed(2)
                  : "0.00"}
              </Text>
              <View>
                <Text
                  style={[
                    styles.statusPill,
                    item.status === "Cancelled"
                      ? styles.cancelled
                      : item.status === "Replaced"
                      ? styles.replaced
                      : item.status === "Returned"
                      ? styles.returned
                      : styles.defaultStatus,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //   <View style={[styles.container, { paddingTop }]}>
    //     <BrandHeader hideUserGreeting={true} />
    <PageLayout
      hasHeader
      headerComponent={<BrandHeader hideUserGreeting={true} />}
      hasFooter
      footerComponent={<AdminFooter activeTab="home" />}
      scrollable
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            // globalStyles.sectionContent,
            globalStyles.pt_0,
          ]}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Dashboard</Text>
            <Text
              style={styles.linkText}
              onPress={() => {
                redirectToPage(containers.fileUploadAddProductCategoryScreen);
              }}
            >
              Upload Data
            </Text>
          </View>
          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <View style={styles.metricIconContainer}>
                <MaterialIcons
                  name="work-outline"
                  size={24}
                  color={colors.lushblue}
                />
                <Text style={styles.metricTitle}>Total Orders</Text>
              </View>
              <View>
                <Text style={styles.metricValue}>
                  {dashboardMetrics.totalOrders}
                </Text>
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
                  color={colors.lushblue}
                />
                <Text style={styles.metricTitle}>Pending Orders</Text>
              </View>
              <View>
                <Text style={styles.metricValue}>
                  {dashboardMetrics.pendingOrders.length}
                </Text>
              </View>
            </View>

            <View style={styles.metricBox}>
              <View style={styles.metricIconContainer}>
                <MaterialIcons
                  name="work-outline"
                  size={24}
                  color={colors.lushblue}
                />
                <Text style={styles.metricTitle}>Today's Revenue</Text>
              </View>
              <View>
                <Text style={styles.metricValue}>
                  {CurrencySymbol}
                  {dashboardMetrics.todayRevenue.toFixed(2)}
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
            <View style={styles.metricBox}>
              <View style={styles.metricIconContainer}>
                <TouchableOpacity
                  onPress={() => {
                    redirectToPage(containers.adminAccessControlScreenScreen);
                  }}
                >
                  <Text style={styles.metricTitle}>User Admin Access</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.ordersHeader}>
            <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={handleSeeAllPress}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={dashboardMetrics.recentOrders}
            renderItem={renderOrderItem}
            keyExtractor={keyExtractor}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={10}
            initialNumToRender={3}
            getItemLayout={(data, index) => ({
              length: 80, // Approximate height of each order item
              offset: 80 * index,
              index,
            })}
          />
        </View>
      </ScrollView>
      {/* <AdminFooter activeTab="home" />
      </View>
    </SafeAreaView> */}
    </PageLayout>
  );
};

export default AdminDashboard;
