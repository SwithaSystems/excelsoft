import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "./reviewsScreenStyles";
import { ScrollView } from "react-native";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import ProductStars from "@/components/ProductStars";
import NoContentFound from "../../components/NoContentFound";
import ProductRating from "@/components/ProductRating";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { ProductsAPI } from "@/services/productService";

const reviewsScreen = () => {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await ProductsAPI.getProductBYID(Number(productId));
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <NoContentFound />;
  }

  // Sort reviews to show newest first
  const sortedReviews = [...product.reviews].sort((a, b) => Number(b.id) - Number(a.id));

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
            {sortedReviews.map((review:any) => (
              <ProductRating key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.addReviewContainer}>
        <Button
          title="Add your Review"
          onPress={() => redirectToPage(containers.feedBackScreenScreen,{
            productId: productId,
            reviewsArrayLength: product.reviews.length
          })}
          style={styles.addReviewBtn}
        />
      </View>
    </View>
  );
};

export default reviewsScreen;
