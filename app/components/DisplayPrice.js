import colors from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CurrencySymbol from "@/constants/CurrencySymbol";

function DisplayPrice(props) {
  const { discount, netPrice } = props;
  return (
    <>
      <View style={props?.priceContainerStyle || styles.priceContainerStyle}>
        <Text style={props?.priceStyle || styles.netPrice}>
          {CurrencySymbol}
          {netPrice?.toFixed(2) - discount?.toFixed(2)}
        </Text>
        {props?.discount &&
          props?.netPrice.toFixed(2) - props?.discount.toFixed(2) != 0 && (
            <Text style={props?.strikeOffPriceStyle || styles.discount}>
              {CurrencySymbol}
              {netPrice.toFixed(2)}
            </Text>
          )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  priceContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  netPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  discount: {
    fontSize: 14,
    color: colors.secondaryText,
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
});
export default DisplayPrice;
