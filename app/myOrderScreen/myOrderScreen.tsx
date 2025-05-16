import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import styles from "./myOrderScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import OrderItem from "./components/OrderItem";
import Footer from "@/components/Footer";
import { Order, orderService } from "@/services/orderService";
import colors from "../config/colors";
import { useLocalSearchParams } from "expo-router";

const myOrderScreen = () => {
  // const orderData = [
  //   {
  //     id: "1",
  //     date: "25th January, Sat, 10 A.M.- 11 A.M.",
  //     status: "Delivered Successfully!",
  //     orderId: "#ORD-2025-1234",
  //     totalItems: 7,
  //     subtotal: "$28",
  //   },
  //   {
  //     id: "2",
  //     date: "25th January, Sat, 10 A.M.- 11 A.M.",
  //     status: "Processed!!",
  //     orderId: "#ORD-2025-1235", // Changed order ID for demonstration
  //     totalItems: 3, // Changed total items for demonstration
  //     subtotal: "$15", // Changed subtotal for demonstration
  //   },
  // ];
  const [orders, setOrders] = useState<any[]>([]);
  const params = useLocalSearchParams();

  const userId = params.userId;

  console.log("userId in my orders", userId);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrdersByUserId(userId as string);
      console.log(" all my orders", response);
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={globalStyles.container}>
        <Header headerText="Your Orders" />
        {/* <ScrollView> */}
        <FlatList
          ListHeaderComponent={
            <>
              <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
                <Text style={styles.yourLastOrders}>Your last orders</Text>

                <FlatList
                  data={orders.map((order) => ({
                    orderId: `#ORD-${order.orderNumber}`,
                    date: new Date(order.createdAt).toLocaleString(), // or format however you like
                    status: order?.status,
                    totalItems: order.products?.length ?? 0,
                    subtotal: order.totalAmount.toFixed(2),
                    _id: order._id,
                  }))}
                  renderItem={({ item }) => (
                    <OrderItem item={item} from="myOrders" />
                  )}
                  keyExtractor={(item) => item._id}
                  nestedScrollEnabled={true}
                />
              </View>
            </>
          }
          data={[]}
          renderItem={() => null}
        />
        {/* </ScrollView> */}
        <Footer />
      </View>
    </SafeAreaView>
  );
};

export default myOrderScreen;
