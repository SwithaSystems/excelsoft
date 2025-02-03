import React from "react";
import { Text } from "react-native";

function DisplayPrice(props) {
  return (
    <>
      <Text style={props.priceStyle}>${props?.price.toFixed(2)}</Text>
      {props?.price.toFixed(2) - props?.originalPrice.toFixed(2) != 0 && (
        <Text style={props.strikeOffPriceStyle}>
          {props.originalPrice.toFixed(2)}
        </Text>
      )}
    </>
  );
}

export default DisplayPrice;
