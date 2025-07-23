import colors from "@/constants/colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import LikeDisLike from "./LikeDisLike";
import ProductStars from "./ProductStars";

function ProductRating({ review }) {
  if (!review) {
    return null;
  }

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image
          source={require("@/assets/teddy.png")}
          style={styles.reviewerImage}
        />
        <View>
          <Text style={styles.reviewerName}>{review.name || "Anonymous"}</Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <Text style={styles.reviewTextShort}>{review.review || ""}</Text>
        <ProductStars rating={review.rating || 0} />
      </View>
      <Text style={styles.reviewText}>{review.text || ""}</Text>
      <LikeDisLike liked={review.liked || false} />
    </View>
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
    marginRight: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewTextShort: {
    fontSize: 14,
    color: colors.reviewsColor,
    flex: 1,
    marginRight: 8,
  },
  reviewText: {
    fontSize: 14,
    color: colors.reviewsColor,
    marginBottom: 8,
  },
});
