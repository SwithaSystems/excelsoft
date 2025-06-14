import colors from "@/app/config/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CurrencySymbol from "@/constants/CurrencySymbol";

function OrderSummary(props) {
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  const cartItems = props.cartItems;
  const total = calculateTotal();
  // const discount = props?.discount || 0;
  const discount = typeof props?.discount === "number" ? props.discount : 0;
  const shipping = props?.shipping || 0;
  const subTotal = total - discount + shipping;
  return (
    <View style={[styles.orderSummary, props?.containerStyle]}>
      {!props?.hideHeading && (
        <Text style={props.sectionHeadingStyle || styles.summaryText}>
          Order Details
        </Text>
      )}
      <View style={styles.summaryItem}>
        <Text style={styles.summaryName}>Item Name</Text>
        <Text style={styles.summaryQuantity}>Total Items</Text>
        <Text style={styles.summaryPrice}>Price</Text>
      </View>
      <View style={{ 
          // paddingHorizontal: 5 
        }}>
        {!props.hideItems &&
          cartItems.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.summaryName}>{item.name}</Text>
              <Text style={styles.summaryQuantity}>{item.quantity}</Text>
              <Text style={styles.summaryPrice}>
                {CurrencySymbol}
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryName, { color: colors.primary }]}>
            Total Price
          </Text>
          <Text style={styles.summaryQuantity}></Text>
          <Text style={[styles.summaryPrice, { color: colors.primary }]}>
            {CurrencySymbol}
            {total.toFixed(2)}
          </Text>
        </View>

        {discount > 0 && (
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryName, { color: colors.primary }]}>
              Discount
            </Text>
            <Text style={styles.summaryQuantity}></Text>
            <Text style={[styles.summaryPrice, { color: colors.primary }]}>
              -{CurrencySymbol}
              {discount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryName, { color: colors.primary }]}>
            Shipping
          </Text>
          <Text style={styles.summaryQuantity}></Text>
          <Text style={[styles.summaryPrice, { color: colors.primary }]}>
            +{CurrencySymbol}
            {shipping.toFixed(2)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={[styles.summaryName, { color: colors.primary }]}>
            SubTotal
          </Text>
          <Text style={styles.summaryQuantity}></Text>
          <Text style={[styles.summaryPrice, { color: colors.primary }]}>
            {CurrencySymbol}
            {subTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  summaryName: {
    width: "33.33%",
    flexWrap: "wrap",
  },
  summaryPrice: {
    width: "33.33%",
    textAlign: "right",
  },
  summaryQuantity: {
    width: "33.33%",
    textAlign: "center",
  },
  orderSummary: {
    // paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 16,
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
    borderTopColor: colors.borderGrey,
    paddingTop: 10,
  },
});
export default OrderSummary;
