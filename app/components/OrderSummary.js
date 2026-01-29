import colors from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import CurrencySymbol from "@/constants/CurrencySymbol";
import globalSettingsAPI from "@/services/globalSettingsService";

function OrderSummary(props) {
  const cartItems = props.cartItems || [];
  const [shippingCharge, setShippingCharge] = useState(0);

  const VAT_RATE = 0.20; // 20% VAT

  // Calculate net price excluding VAT from RRP (netPrice)
  const calculateNetPriceExVAT = (item) => {
    if (!item.isVatApplicable) {
      return item.netPrice || 0;
    }
    // If VAT applicable, netPrice includes VAT, so we extract it
    return (item.netPrice || 0) / (1 + VAT_RATE);
  };

  // Calculate VAT amount for a single item
  const calculateItemVAT = (item) => {
    if (!item.isVatApplicable) {
      return 0;
    }
    const netPriceExVAT = calculateNetPriceExVAT(item);
    const vatAmount = (item.netPrice || 0) - netPriceExVAT;
    return vatAmount * (item.quantity || 1);
  };

  // Calculate item subtotal (excluding VAT)
  const calculateItemSubtotal = (item) => {
    const netPriceExVAT = calculateNetPriceExVAT(item);
    return netPriceExVAT * (item.quantity || 1);
  };

  // Calculate item total (this is just netPrice * quantity since netPrice is already RRP)
  const calculateItemTotal = (item) => {
    return (item.netPrice || 0) * (item.quantity || 1);
  };

  // Calculate totals for summary
  const subtotalExVAT = cartItems.reduce(
    (total, item) => total + calculateItemSubtotal(item),
    0
  );

  const totalVAT = cartItems.reduce(
    (total, item) => total + calculateItemVAT(item),
    0
  );

  const subtotalIncVAT = cartItems.reduce(
    (total, item) => total + calculateItemTotal(item),
    0
  );

  const fetchSettings = async () => {
    try {
      const response = await globalSettingsAPI.getSettings();
      console.log("globalsettings", response.data.shippingCharge);
      setShippingCharge(response.data.shippingCharge);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      Alert.alert("Error", "Failed to load settings. Please try again.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const deliveryCharge = props.mode === "Home Delivery" ? shippingCharge ?? 0 : 0;

  const grandTotal = subtotalIncVAT + deliveryCharge;

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
                  {itemTotal.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Summary Section */}
      <View style={styles.summarySection}>
        {/* VAT */}
        <View style={styles.tableRow}>
  <Text style={styles.summaryLabel}>
    VAT - {CurrencySymbol} {totalVAT.toFixed(2)}
  </Text>
</View>


        {/* Delivery Charges */}
        {props.mode === "Home Delivery" && (
          <View style={styles.tableRow}>
            <Text style={styles.summaryLabel}>Delivery Charges</Text>
            <Text style={styles.quantity}></Text>
            <Text style={styles.price}></Text>
            <Text style={styles.summaryValue}>
              {CurrencySymbol}
              {deliveryCharge.toFixed(2)}
            </Text>
          </View>
        )}

        {/* Grand Total */}
        <View style={styles.totalsContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>
              Grand Total
            </Text>
            <Text style={styles.quantity}></Text>
            <Text style={styles.price}></Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              {CurrencySymbol}
              {grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
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
    flex: 1,
    fontSize: 14,
    color: colors.text || "#000",
    paddingRight: 8,
  },
  quantity: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: colors.text || "#000",
  },
  price: {
    flex: 1,
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
    flex: 1,
    fontSize: 14,
    color: colors.text || "#000",
    paddingRight: 8,
  },
  summaryValue: {
    flex: 1,
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