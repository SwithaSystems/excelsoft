import React, { useEffect, useId, useState } from "react";
import { View, Text, Alert } from "react-native";
import styles from "./ReviewsStyles";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useLocalSearchParams } from "expo-router";
import ProductStars from "@/app/components/ProductStars";
import ProductRating from "@/app/components/ProductRating";
import Button from "@/app/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const ReviewsScreen = () => {
  const { setIsLoading } = useAppContext();
  const idForReview = useId();
  const { productId, totalReviews, productRating } = useLocalSearchParams();

  const reviewsArray =
    typeof totalReviews === "string" && totalReviews
      ? JSON.parse(totalReviews)
      : [];

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    setProduct(response.data);
    setIsLoading(false);
  };

  const soretedReviews = product?.reviews?.sort(
    (a: any, b: any) => b.id - a.id
  );

  const user = useSelector((state: RootState) => state.user.user);

  const handleAddReviews = () => {
    if (!user) {
      Alert.alert("Login Required", "You need to log in to submit a review.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => redirectToPage(containers.signInScreen),
        },
      ]);
      return;
    }

    redirectToPage(containers.feedbackScreen, {
      productId: productId,
      reviewsArrayLength: reviewsArray.length,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <PageLayout
        hasHeader
        headerComponent={<Header headerText={"Product Reviews"} />}
        hasFooter={false}
        scrollable
      >
        <View style={[globalStyles.sectionContent, { paddingTop: 0 }]}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.heading}>Overall Ratings</Text>
          </View>

          <View style={styles.overAllRatingContainer}>
            {Number(productRating) > 0 ? (
              <ProductStars
                starsContainer={styles.starsContainer}
                rating={productRating}
                size={32}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateStar}>⭐</Text>
                <Text style={styles.emptyStateHeading}>
                  Be the first to review!
                </Text>
                <Text style={styles.emptyStateSubText}>
                  Share your thoughts about this product.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.reviewsContainer}>
            <Text style={styles.reviewContainerHeading}>Reviews</Text>
            {soretedReviews?.map((review: any, index: number) => (
              <ProductRating key={`${review.id}-${index}`} review={review} />
            ))}
          </View>
        </View>
      </PageLayout>

      <View style={styles.addReviewContainer}>
        <Button
          title="Add your Review"
          onPress={handleAddReviews}
          style={styles.addReviewBtn}
        />
      </View>
    </View>
  );
};

export default ReviewsScreen;
