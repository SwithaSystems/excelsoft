import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "./AdminDashboardStyles";
import AdminBrandHeader from "@/components/AdminBrandHeader";
import { globalStyles } from "@/assets/styles/globalStyles";
import Footer from "@/components/Footer";
import ordersData from "../../data/ordersData";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import AdminFooter from "../AdminFooter/AdminFooter";

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
  const renderOrder = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          redirectToPage(containers.AdminSeeAllOrdersScreen);
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
              justifyContent: "space-between",
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
      <View style={globalStyles.container}>
        <AdminBrandHeader />
        <ScrollView>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
            <Text style={styles.title}>Dashboard</Text>

            <View style={styles.metricsContainer}>
              <View style={styles.metricBox}>
                <View style={styles.metricIconContainer}>
                  <MaterialIcons
                    name="shopping-bag"
                    size={24}
                    color="#2563EB"
                  />
                  <Text style={styles.metricTitle}>Total Orders</Text>
                </View>
                <View>
                  <Text style={styles.metricValue}>1,248</Text>
                  <Text style={styles.metricChange}>+12.5%</Text>
                </View>
              </View>
              <View style={styles.metricBox}>
                <View style={styles.metricIconContainer}>
                  <MaterialIcons
                    name="shopping-bag"
                    size={24}
                    color="#2563EB"
                  />
                  <Text style={styles.metricTitle}>Pending Orders</Text>
                </View>
                <View>
                  <Text style={styles.metricValue}>26</Text>
                  <Text style={styles.metricChange}>5 new</Text>
                </View>
              </View>
              <View style={styles.metricBox}>
                <View style={styles.metricIconContainer}>
                  <MaterialIcons
                    name="shopping-bag"
                    size={24}
                    color="#2563EB"
                  />
                  <Text style={styles.metricTitle}>Today's Revenue</Text>
                </View>
                <View>
                  <Text style={styles.metricValue}>8,459</Text>
                  <Text style={styles.metricChange}>+14.5%</Text>
                </View>
              </View>
            </View>

            <View style={styles.ordersHeader}>
              <Text style={styles.recentOrdersTitle}>Recent Orders</Text>
              <TouchableOpacity
                onPress={() => {
                  redirectToPage(containers.adminUserOrderDisplayScreen);
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
    </>
  );
};

export default AdminDashboard;
