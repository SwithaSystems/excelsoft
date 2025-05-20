import colors from "@/app/config/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CurrencySymbol from "@/constants/CurrencySymbol";

function DisplayPrice(props) {
  return (
    <>
      <View style={props?.priceContainerStyle || styles.priceContainerStyle}>
        <Text style={props?.priceStyle || styles.price}>
          {CurrencySymbol}
          {props?.price?.toFixed(2)}
        </Text>
        {props?.originalPrice &&
          props?.price.toFixed(2) - props?.originalPrice.toFixed(2) != 0 && (
            <Text style={props?.strikeOffPriceStyle || styles.originalPrice}>
              {CurrencySymbol}
              {props.originalPrice.toFixed(2)}
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
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.secondaryText,
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
});
export default DisplayPrice;
