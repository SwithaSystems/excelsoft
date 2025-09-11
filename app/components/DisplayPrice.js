import colors from "@/constants/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CurrencySymbol from "@/constants/CurrencySymbol";

function DisplayPrice(props) {
  const { discount = 0, netPrice = 0 } = props;

  const finalPrice = (Number(netPrice) - Number(discount)).toFixed(2);

  return (
    <View style={props?.priceContainerStyle || styles.priceContainerStyle}>
      <Text style={props?.priceStyle || styles.netPrice}>
        {CurrencySymbol}
        {finalPrice}
      </Text>

      {discount > 0 && Number(netPrice) > Number(discount) && (
        <Text style={props?.strikeOffPriceStyle || styles.discount}>
          {CurrencySymbol}
          {Number(netPrice).toFixed(2)}
        </Text>
      )}
    </View>
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
