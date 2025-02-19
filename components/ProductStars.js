import React from "react";
import Star from "./Star";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function ProductStars(props) {
  return (
    <View style={[styles.starsContainer, props?.starsContainer]}>
      {[1, 2, 3, 4, 5].map((star, index) => {
        return (
          <>
            {props.needAction ? (
              <>
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    alert(index + 1);
                  }}
                >
                  <Star
                    size={props.size}
                    key={star}
                    filled={star <= props.rating}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Star
                  size={props.size}
                  key={index}
                  filled={star <= props.rating}
                />
              </>
            )}
          </>
        );
      })}
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
