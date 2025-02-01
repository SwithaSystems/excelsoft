import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "./reviewsScreenStyles";
import { ScrollView } from "react-native";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import products from "@/data/products";
import { useLocalSearchParams } from "expo-router";
import ProductStars from "@/components/ProductStars";
import NoContentFound from "../../components/NoContentFound";
import ProductRating from "@/components/ProductRating";
import Button from "@/components/commonComponents/Button";

const reviewsScreen = () => {
  const { productId } = useLocalSearchParams();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return <NoContentFound />;
  }
  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <Header headerText={"Product Reviews"} />
        <View style={[globalStyles.sectionContent, { paddingTop: 0 }]}>
          <Text style={styles.heading}>Overall Ratings</Text>
          <View style={styles.overAllRatingContainer}>
            <Text style={styles.rating}>{product.rating}</Text>
            <ProductStars
              starsContainer={styles.starsContainer}
              rating={product.rating}
              size={32}
            />
          </View>
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewContainerHeading}>Reviews</Text>
            {product.reviews.map((review) => (
              <ProductRating key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.addReviewContainer}>
        <Button
          title="Add your Review"
          onPress={() => {}}
          style={styles.addReviewBtn}
        />
      </View>
    </View>
  );
};

export default reviewsScreen;
