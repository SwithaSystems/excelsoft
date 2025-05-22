import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
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

const AdminDashboard = () => {
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
    return (
      <TouchableOpacity
        onPress={() => {
          redirectToPage(containers.AdminOrderDetailScreen);
        }}
      >
        <View style={styles.orderContainer}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.customerName}>{item.customer}</Text>
            <Text style={styles.orderTime}>{item.time}</Text>
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
      <View style={styles.container}>
        <BrandHeader hideUserGreeting={true}/>
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
                    <Text style={styles.metricValue}>1,248</Text>
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
                    <Text style={styles.metricValue}>26</Text>
                    <View style={styles.salesRaiseSection}>
                      <Ionicons
                        name="trending-up-outline"
                        size={24}
                        color={colors.primary}
                        style={{ paddingRight: 8 }}
                      />
                      <Text style={styles.metricChange}>5 new</Text>
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
                    <Text style={styles.metricTitle}>Today's Revenue</Text>
                  </View>
                  <View>
                    <Text style={styles.metricValue}>8,459</Text>
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
              data={ordersData}
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
