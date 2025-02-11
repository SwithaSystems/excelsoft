import colors from "@/app/config/colors";
import { globalStyles } from "@/assets/styles/globalStyles";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function OrderItem(props) {
  const item = props.item;
  return (
    <TouchableOpacity
      onPress={() => {
        redirectToPage(containers.orderDetailsScreenScreen);
      }}
    >
      <View style={styles.orderContainer}>
        <View style={[styles.dateTimeContainer]}>
          <Text style={styles.date}>{item.date}</Text>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </View>
        <View style={styles.statusContainer}>
          <Ionicons name="bag-check" size={32} color={colors.primary} />
          <Text style={styles.status}>{item.status}</Text>
        </View>
        <Text style={styles.orderSummaryItems}>
          <Text style={globalStyles.fontWeight500}>Order ID:</Text>{" "}
          {item.orderId}
        </Text>
        <Text style={styles.orderSummaryItems}>
          <Text style={globalStyles.fontWeight500}>Total Items:</Text>{" "}
          {item.totalItems}
        </Text>
        <Text style={styles.orderSummaryItems}>
          <Text style={globalStyles.fontWeight500}>Subtotal:</Text> $
          {item.subtotal}
        </Text>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            redirectToPage(containers.deliveryTrackingScreenScreen);
          }}
        >
          <Text style={globalStyles.btnSmUnderLine}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  orderContainer: {
    marginBottom: 24,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: 500,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 500,
  },
  orderSummaryItems: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemsSubtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  trackButton: {
    backgroundColor: "lightblue", // Or your preferred color for the button
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  trackButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OrderItem;
