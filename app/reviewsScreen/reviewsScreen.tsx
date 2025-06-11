import React, { useEffect, useId, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import styles from "./reviewsScreenStyles";
import { ScrollView, SafeAreaView } from "react-native";
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
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import colors from "../config/colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const reviewsScreen = () => {
  const { setIsLoading } = useAppContext();
  const idForReview = useId();
  const { productId, totalReviews, productRating } = useLocalSearchParams();
  const reviewsArray =
    typeof totalReviews === "string" && totalReviews
      ? JSON.parse(totalReviews)
      : [];
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    console.log("ProductId", productId);
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);
  const fetchProductDetails = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    setProduct(response.data);
    setIsLoading(false);
  };
  console.log("product", product);
  const soretedReviews = product?.reviews?.sort(
    (a: any, b: any) => b.id - a.id
  );
  console.log("soretedReviews", soretedReviews);

  const user = useSelector((state: RootState) => state.user.user);

  const handleAddReviews = () => {
    if (!user) {
      Alert.alert("Login Required", "You need to log in to submit a review.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Login",
          onPress: () => redirectToPage(containers.signInScreen),
        },
      ]);
      return;
    }

    redirectToPage(containers.feedBackScreenScreen, {
      productId: productId,
      reviewsArrayLength: reviewsArray.length,
    });
  };

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
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
              {soretedReviews?.map((review: any, index: number) => (
                <ProductRating key={`${review.id}-${index}`} review={review} />
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.addReviewContainer}>
          <Button
            title="Add your Review"
            onPress={
              handleAddReviews
              // redirectToPage(containers.feedBackScreenScreen, {
              //   productId: productId,
              //   reviewsArrayLength: reviewsArray.length,
              // })
            }
            style={styles.addReviewBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default reviewsScreen;
