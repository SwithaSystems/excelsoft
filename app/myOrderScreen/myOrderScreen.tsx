import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import styles from "./myOrderScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import OrderItem from "./components/OrderItem";
import Footer from "@/components/Footer";

const myOrderScreen = () => {
  const orderData = [
    {
      id: "1",
      date: "25th January, Sat, 10 A.M.- 11 A.M.",
      status: "Delivered Successfully!",
      orderId: "#ORD-2025-1234",
      totalItems: 7,
      subtotal: "$28",
    },
    {
      id: "2",
      date: "25th January, Sat, 10 A.M.- 11 A.M.",
      status: "Processed!!",
      orderId: "#ORD-2025-1235", // Changed order ID for demonstration
      totalItems: 3, // Changed total items for demonstration
      subtotal: "$15", // Changed subtotal for demonstration
    },
  ];

  return (
    <View style={globalStyles.container}>
      <Header headerText="Your Orders" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.yourLastOrders}>Your last orders</Text>

          <FlatList
            data={orderData}
            renderItem={({ item }) => <OrderItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default myOrderScreen;
