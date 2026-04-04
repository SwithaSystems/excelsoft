import React, { useEffect, useState } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import styles from "./ReviewsStyles";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useLocalSearchParams, router } from "expo-router";
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
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import Footer from "@/app/components/Footer";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const ReviewsScreen = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const { setIsLoading } = useAppContext();
  const { productId, totalReviews, productRating } = useLocalSearchParams();

  const isWeb = Platform.OS === "web";
  const { isMobile, isTablet, isDesktop } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const isTabletWeb = isWeb && isTablet;

  const webScale = isTabletWeb ? 0.9 : isMobileWeb ? 0.85 : 1;
  const s = (value: number) => value * webScale;

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

  const normalizedRating = (() => {
    if (typeof productRating === "string") {
      try {
        const parsed = JSON.parse(productRating);
        return Number(parsed);
      } catch {
        return Number(productRating);
      }
    }
    return Number(productRating);
  })();

  const ratingToShow = Number.isFinite(normalizedRating) && normalizedRating > 0
    ? normalizedRating
    : Number(product?.rating || 0);

  const hasReviews =
    (soretedReviews?.length || 0) > 0 ||
    (reviewsArray?.length || 0) > 0 ||
    (product?.reviews?.length || 0) > 0;

  const user = useSelector((state: RootState) => state.user.user);

  const handleAddReviews = () => {
    if (!user) {
      showAlert("Login Required", "You need to log in to submit a review.", [
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

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={"Product Reviews"} />
  );
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer navigation={router} />
  );

  const content = (
    <>
      <View style={[globalStyles.sectionContent, isWeb && styles.webSectionContent, { paddingTop: 0 }]}>
        <Text style={[styles.pageHeading, isWeb && { fontSize: s(28), marginBottom: s(20) }]}>
          Reviews
        </Text>
        <View style={[styles.reviewsHeader, isWeb && styles.webReviewsHeader]}>
          <Text style={[styles.heading, isWeb && { fontSize: s(20) }]}>
            Overall Ratings
          </Text>
        </View>

        <View style={[styles.overAllRatingContainer, isWeb && styles.webOverAllRatingContainer]}>
          {ratingToShow > 0 ? (
            <ProductStars
              starsContainer={[styles.starsContainer, isWeb && styles.webStarsContainer]}
              rating={ratingToShow}
              size={isWeb ? s(32) : 32}
            />
          ) : !hasReviews ? (
            <View style={[styles.emptyStateContainer, isWeb && styles.webEmptyStateContainer]}>
              <Text style={[styles.emptyStateStar, isWeb && { fontSize: s(48) }]}>⭐</Text>
              <Text style={[styles.emptyStateHeading, isWeb && { fontSize: s(20) }]}>
                Be the first to review!
              </Text>
              <Text style={[styles.emptyStateSubText, isWeb && { fontSize: s(14) }]}>
                Share your thoughts about this product.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.reviewsContainer, isWeb && styles.webReviewsContainer]}>
          {isWeb ? (
            <View style={styles.reviewHeadingRow}>
              <Text style={[styles.reviewContainerHeading, { fontSize: s(24), marginBottom: 0 }]}>
                Reviews
              </Text>
              <TouchableOpacity onPress={handleAddReviews} activeOpacity={0.7}>
                <Text style={[styles.addReviewLink, { fontSize: s(16) }]}>Add your Review</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[styles.reviewContainerHeading, isWeb && { fontSize: s(24), marginBottom: s(16) }]}>
              Reviews
            </Text>
          )}
          {soretedReviews?.map((review: any, index: number) => (
            <ProductRating key={`${review.id}-${index}`} review={review} />
          ))}
        </View>
      </View>

      {!isWeb && (
      <View style={[styles.addReviewContainer]}>
        <Button
          title="Add your Review"
          onPress={handleAddReviews}
          style={[styles.addReviewBtn]}
        />
      </View>
      )}
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <LayoutComponent
        hasHeader
        hasFooter={isWeb}
        headerComponent={HeaderComponent}
        footerComponent={FooterComponent}
        scrollable
      >
        {isWeb ? (
          <View style={styles.webContainer}>
            <View style={styles.webContentWrapper}>{content}</View>
          </View>
        ) : (
          content
        )}
      </LayoutComponent>
      {confirmationModal}
    </View>
  );
};

export default ReviewsScreen;
