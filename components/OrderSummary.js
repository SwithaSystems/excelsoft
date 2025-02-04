import colors from "@/app/config/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function OrderSummary(props) {
  const cartItems = props.cartItems;
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  return (
    <>
      <View style={styles.orderSummary}>
        <Text style={props.sectionHeadingStyle || styles.summaryText}>
          Order Details
        </Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryName}>Item Name</Text>
          <Text style={styles.summaryQuantity}>Total Items</Text>
          <Text style={styles.summaryPrice}>Price</Text>
        </View>
        <View style={{ paddingHorizontal: 5 }}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryName}>{item.name}</Text>
              <Text style={styles.summaryQuantity}>{item.quantity}</Text>
              <Text style={styles.summaryPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={[styles.summaryItem]}>
            <Text style={[styles.summaryName, { color: colors.primary }]}>
              Total Price
            </Text>
            <Text
              style={[styles.summaryQuantity, { color: colors.primary }]}
            ></Text>
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>
              $38
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryName, { color: colors.primary }]}>
              Discount
            </Text>
            <Text
              style={[styles.summaryQuantity, { color: colors.primary }]}
            ></Text>
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>
              $38
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryName, { color: colors.primary }]}>
              Shipping
            </Text>
            <Text
              style={[styles.summaryQuantity, { color: colors.primary }]}
            ></Text>
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>
              $38
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryName, { color: colors.primary }]}>
              SubTotal
            </Text>
            <Text
              style={[styles.summaryQuantity, { color: colors.primary }]}
            ></Text>
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>
              $38
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  summaryName: {
    width: "60%",
  },
  summaryPrice: {
    width: "20%",
    textAlign: "right",
  },
  summaryQuantity: {
    width: "20%",
    textAlign: "center",
  },
  orderSummary: {
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 24,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 20,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
});
export default OrderSummary;
