import colors from "@/app/config/colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LikeDisLike from "./LikeDisLike";
import ProductStars from "./ProductStars";

function ProductRating(props) {
  const review = props.review;
  const renderStars = (rating) => {
    return <ProductStars rating={rating} />;
  };
  return (
    <>
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Image
            source={require("../assets/teddy.png")}
            style={styles.reviewerImage}
          />
          <View>
            <Text style={styles.reviewerName}>{review.name}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.reviewTextShort}>{review.review}</Text>

          {renderStars(review.rating)}
        </View>
        <Text style={styles.reviewText}>{review.text}</Text>
        <LikeDisLike liked={true} />
      </View>
    </>
  );
}

export default ProductRating;
const styles = StyleSheet.create({
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 4,
  },
  reviewTextShort: {
    fontSize: 14,
    color: colors.black,
    fontWeight: "bold",
    lineHeight: 20,
  },
  reviewText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    marginBottom: 8,
  },
});
