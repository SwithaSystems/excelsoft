import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "./reviewsScreenStyles";
import { ScrollView } from "react-native";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
// import products from "@/data/products";
import { useLocalSearchParams } from "expo-router";
import ProductStars from "@/components/ProductStars";
import NoContentFound from "../../components/NoContentFound";
import ProductRating from "@/components/ProductRating";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const reviewsScreen = () => {
  const { productId,totalReviews ,productRating} = useLocalSearchParams();
  const reviewsArray = typeof totalReviews === "string" && totalReviews ? JSON.parse(totalReviews) : [];
  //const product = products.find((p) => p.id === productId);
  // const product = products[0];
  // if (!product) {
    // return <NoContentFound />;
  // }
  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <Header headerText={"Product Reviews"} />
        <View style={[globalStyles.sectionContent, { paddingTop: 0 }]}>
          <Text style={styles.heading}>Overall Ratings</Text>
          <View style={styles.overAllRatingContainer}>
            <Text style={styles.rating}>{productRating}</Text>
            <ProductStars
              starsContainer={styles.starsContainer}
              rating={productRating}
              size={32}
            />
          </View>
          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewContainerHeading}>Reviews</Text>
            {reviewsArray.map((review:any) => (
              <ProductRating key={review.id} review={review} />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.addReviewContainer}>
        <Button
          title="Add your Review"
          onPress={() => redirectToPage(containers.feedBackScreenScreen,{productId:productId,reviewsArrayLength:reviewsArray.length})}
          style={styles.addReviewBtn}
        />
      </View>
    </View>
  );
};

export default reviewsScreen;
