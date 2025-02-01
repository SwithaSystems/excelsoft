import React from "react";
import Star from "./Star";
import { StyleSheet, View } from "react-native";

function ProductStars(props) {
  return (
    <View style={[styles.starsContainer, props?.starsContainer]}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star size={props.size} key={star} filled={star <= props.rating} />
      ))}
    </View>
  );
}

export default ProductStars;
const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 4,
  },
});
