import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import styles from "./myOrderScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import OrderItem from "./components/OrderItem";
import Footer from "@/components/Footer";
import { Order, orderService } from "@/services/orderService";

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
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders();
        console.log(" all my orders", response);
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
  return (
    <View style={globalStyles.container}>
      <Header headerText="Your Orders" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.yourLastOrders}>Your last orders</Text>

          <FlatList
            data={orders}
            renderItem={({ item }) => <OrderItem item={item} />}
            keyExtractor={(item) => item._id}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default myOrderScreen;
