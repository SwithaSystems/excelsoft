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
  console.log("item", item);
  return (
    <TouchableOpacity
      onPress={() => {
        redirectToPage(containers.orderDetailsScreenScreen, {
          orderId: item._id,
          from: props.from,
        });
      }}
    >
      <View style={styles.orderContainer}>
        <View style={styles.OrderIdContainer}>
          <Text style={styles.orderSummaryItems}>
            <Text style={styles.prefix}>Order ID:</Text> {item.orderId}
          </Text>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              e.preventDefault();
              redirectToPage(containers.deliveryTrackingScreenScreen, {
                orderId: item._id,
              });
            }}
          >
            <Text style={styles.navigationText}>Track Order</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.dateTimeContainer]}>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <View style={styles.OrderStatusContainer}>
          <View style={styles.statusContainer}>
            <Ionicons name="bag-check" size={32} color={colors.primary} />
            <Text style={styles.status}>{item.status}</Text>
          </View>
          <Text style={styles.navigationText}>See More</Text>
        </View>
        {/* <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            redirectToPage(containers.deliveryTrackingScreenScreen, {
              orderId: item._id,
            });
          }}
        ></TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  orderContainer: {
    marginBottom: 24,
    backgroundColor: colors.paleBlue,
    padding: 12,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.primary,
  },
  OrderIdContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 16,
  },
  date: {
    fontSize: 12,
    fontWeight: "300",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    //marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  OrderStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderSummaryItems: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 500,
  },
  prefix: {
    fontWeight: "bold",
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
  navigationText: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: "bold"
  },
});

export default OrderItem;
