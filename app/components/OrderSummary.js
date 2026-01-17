import colors from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CurrencySymbol from "@/constants/CurrencySymbol";

function OrderSummary(props) {
  const cartItems = props.cartItems || [];

  const calculateItemSubtotal = (item) => {
    const basePrice = (item.netPrice || 0) - (item.discount || 0);
    return basePrice * (item?.quantity || 1);
  };

  // Calculate totals
  const calculateItemTotal = (item) => {
    const basePrice = (item.netPrice || 0) - (item.discount || 0);

    let vatAmount = 0;
    if (item.isVatApplicable && item.vatRate) {
      vatAmount = (basePrice * item.vatRate) / 100;
    }

    return (basePrice + vatAmount) * (item.quantity || 1);
  };

  const calculateItemVAT = (item) => {
    const subtotal = calculateItemSubtotal(item);
    const vatRate = item.vatRate || 0;
    return item.isVatApplicable ? (subtotal * vatRate) / 100 : 0;
  };

  const subtotalExVAT = cartItems.reduce(
    (total, item) => total + calculateItemSubtotal(item),
    0
  );

  const totalVAT = cartItems.reduce(
    (total, item) => total + calculateItemVAT(item),
    0
  );

  const totalDiscount = cartItems.reduce((total, item) => {
    const baseDiscount = item?.discount || 0;

    const discountWithVAT = item.isVatApplicable
      ? baseDiscount + (baseDiscount * (item.vatRate || 0)) / 100
      : baseDiscount;

    return total + discountWithVAT * item.quantity;
  }, 0);

  const deliveryCharge = props?.shipping || 0;
  const totalIncVAT = subtotalExVAT + totalVAT + deliveryCharge;

  return (
    <View style={[styles.orderSummary, props?.containerStyle]}>
      {!props?.hideHeading && (
        <Text style={props.sectionHeadingStyle || styles.summaryHeading}>
          Order Summary
        </Text>
      )}

      {/* Table Header */}
      <View style={[styles.tableRow, styles.headerRow]}>
        <Text style={[styles.itemName, styles.headerText]}>Item</Text>
        <Text style={[styles.quantity, styles.headerText]}>Qty</Text>
        <Text style={[styles.price, styles.headerText]}>Price</Text>
        {/* <Text style={[styles.vatamount, styles.headerText]}>VAT</Text> */}
        {/* <Text style={[styles.total, styles.headerText]}>Total</Text> */}
      </View>

      {/* Items */}
      {!props.hideItems && (
        <View style={styles.itemsSection}>
          {cartItems.map((item) => {
            const itemTotal = calculateItemTotal(item);
            return (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Text style={styles.price}>
                  {CurrencySymbol}
                  {(item.netPrice - (item.discount || 0)).toFixed(2)}
                </Text>
                {/* {item.isVatApplicable ? (
                  <Text style={styles.vatamount}>
                    {CurrencySymbol}
                    {(
                      (item.vatRate *
                        (item.netPrice - item.discount) *
                        item.quantity) /
                      100
                    ).toFixed(2)}
                  </Text>
                ) : (
                  <Text style={styles.vatamount}>
                    {CurrencySymbol}
                    {0}
                  </Text>
                )}
                <Text style={styles.total}>
                  {CurrencySymbol}
                  {itemTotal.toFixed(2)}
                </Text> */}
              </View>
            );
          })}
        </View>
      )}

      {/* Summary Section */}
      <View style={styles.summarySection}>
        {/* Subtotal excluding VAT */}
        {/* <View style={styles.tableRow}>
          <Text style={styles.summaryLabel}>Total (excl. VAT)</Text>
          <Text style={styles.quantity}></Text>
          <Text style={styles.price}></Text>
          <Text style={styles.summaryValue}>
            {CurrencySymbol}
            {subtotalExVAT.toFixed(2)}
          </Text>
        </View> */}
        <View style={styles.tableRow}>
          <Text style={styles.summaryLabel}>Total VAT</Text>
          <Text style={styles.quantity}></Text>
          <Text style={styles.price}></Text>
          <Text style={styles.summaryValue}>
            {CurrencySymbol}
            {totalVAT.toFixed(2)}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.summaryLabel}>Delivary Charges</Text>
          <Text style={styles.quantity}></Text>
          <Text style={styles.price}></Text>
          <Text style={styles.summaryValue}>
            {CurrencySymbol}
            {deliveryCharge.toFixed(2)}
          </Text>
        </View>
        {/* Totals Section with shared border */}
        <View style={styles.totalsContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>
              Grand Total
            </Text>
            <Text style={styles.quantity}></Text>
            <Text style={styles.price}></Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              {CurrencySymbol}
              {totalIncVAT.toFixed(2)}
            </Text>
          </View>
        </View>
        {/* {totalDiscount > 0 && (
          <View style={styles.tableRow}>
            <Text style={[styles.summaryLabel, styles.discountText]}>
              Saved on this Order
            </Text>
            <Text style={styles.quantity}></Text>
            <Text style={styles.price}></Text>
            <Text style={[styles.summaryValue, styles.discountText]}>
              {CurrencySymbol}
              {totalDiscount.toFixed(2)}
            </Text>
          </View>
        )} */}
      </View>

      {/* VAT Notice */}
      {/* <Text style={styles.vatNotice}> */}
        {/* Prices include VAT where applicable •  */}
        {/* VAT Reg: GB123456789 */}
      {/* </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  orderSummary: {
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  summaryHeading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.primary || "#000",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerRow: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary || "#000",
    marginBottom: 8,
  },
  headerText: {
    fontWeight: "600",
    fontSize: 14,
    color: colors.primary || "#000",
  },
  itemsSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 12,
    paddingBottom: 12,
  },
  summarySection: {
    marginBottom: 12,
  },
  itemName: {
    width: "30%",
    fontSize: 14,
    color: colors.text || "#000",
    paddingRight: 8,
  },
  quantity: {
    width: "15%",
    textAlign: "center",
    fontSize: 14,
    color: colors.text || "#000",
  },
  price: {
    width: "15%",
    textAlign: "right",
    fontSize: 14,
    color: colors.text || "#000",
  },
  vatamount: {
    width: "20%",
    textAlign: "right",
    fontSize: 14,
    color: colors.text || "#000",
  },
  total: {
    width: "20%",
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    color: colors.text || "#000",
  },
  summaryLabel: {
    width: "40%",
    fontSize: 14,
    color: colors.text || "#000",
    paddingRight: 8,
  },
  summaryValue: {
    width: "25%",
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    color: colors.text || "#000",
  },
  discountText: {
    color: "#22c55e",
  },
  totalsContainer: {
    borderTopWidth: 2,
    borderTopColor: colors.primary || "#000",
    marginTop: 8,
    paddingTop: 12,
  },
  totalRow: {
    // Removed borderTopWidth, borderTopColor, marginTop, paddingTop
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary || "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary || "#000",
  },
  vatNotice: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default OrderSummary;
