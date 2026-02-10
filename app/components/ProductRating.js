import colors from "@/constants/colors";
import React from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import LikeDisLike from "./LikeDisLike";
import ProductStars from "./ProductStars";

function ProductRating({ review }) {
  if (!review) {
    return null;
  }

  // Get images array - handle both array and single image cases
  // Filter out empty strings, null, undefined, and invalid URLs
  const reviewImages = review.images 
    ? (Array.isArray(review.images) 
        ? review.images.filter(img => img && typeof img === 'string' && img.trim() !== '')
        : (review.images && typeof review.images === 'string' && review.images.trim() !== '' 
            ? [review.images] 
            : []))
    : [];

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
      
      {/* Display review images as small squares */}
      {reviewImages.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
          contentContainerStyle={styles.imagesContentContainer}
        >
          {reviewImages.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={[
                styles.reviewImage,
                index < reviewImages.length - 1 && styles.reviewImageMargin
              ]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      )}
      
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
  imagesContainer: {
    marginBottom: 8,
  },
  imagesContentContainer: {
    flexDirection: "row",
  },
  reviewImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: colors.placeholdergrey || "#f0f0f0",
  },
  reviewImageMargin: {
    marginRight: 8,
  },
});
