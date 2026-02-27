import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Platform } from "react-native";
import styles from "./FeedBackStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "../../components/ProductStars";
import Button from "@/app/components/commonComponents/Button";
import * as ImagePicker from "expo-image-picker";
import ConfirmationModal from "../../components/commonComponents/ConfirmationModal";
import { ProductsAPI } from "@/services/productService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { UserAPI } from "@/services/userService";
import { useSelector } from "react-redux";
import colors from "../../../constants/colors";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { FEEDBACK_SCREEN2_TITLE } from "../../../constants/stringLiterals";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import * as SecureStore from "expo-secure-store";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";


const MAX_IMAGES = 5;

const feedBackScreen = () => {
  const isWeb = Platform.OS === "web";
  const { isMobile, isTablet, isDesktop } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const isTabletWeb = isWeb && isTablet;

  const webScale = isTabletWeb ? 0.9 : isMobileWeb ? 0.85 : 1;
  const s = (value: number) => value * webScale;

  const params = useLocalSearchParams();
  const productId = params.productId as string;
  const reviewsArrayLength = params.reviewsArrayLength as string;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImages, setSelectedImages] = useState
    <{ uri: string; name: string; type: string }[]
  >([]);

  const [showReviewconfirmationModal, setShowReviewconfirmationModal] = useState(false);
  const userData_redux = useSelector((state: any) => state.user.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    if (selectedImages.length >= MAX_IMAGES) {
      alert(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName ?? `image-${Date.now()}.jpg`,
        type: asset.type ?? "image/jpeg",
      }));
      const totalImages = [...selectedImages, ...newImages].slice(0, MAX_IMAGES);
      setSelectedImages(totalImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleAddReview = async () => {
  if (isSubmitting) return;

  if (!rating || reviewText.trim() === "") {
    alert("Please enter both a rating and review text.");
    return;
  }

  setIsSubmitting(true);
  const token = await SecureStore.getItemAsync("token");
console.log("Token exists:", !!token);
  try {
    const userID = userData_redux._id ? userData_redux._id : userData_redux.id;
    const user = await UserAPI.getUserById(userID);
    const UserParsed = user.data;

    const formData = new FormData();
    formData.append("rating", rating.toString());
    formData.append("name", UserParsed?.firstName || "");
    formData.append("review", reviewText);

    // Append images correctly for React Native
    for (let i = 0; i < selectedImages.length; i++) {
      const img = selectedImages[i];
      
      if (Platform.OS === 'web') {
        // For web platform
        try {
          const response = await fetch(img.uri);
          const blob = await response.blob();
          formData.append("images", blob, img.name);
        } catch (error) {
          console.error("Error converting image to blob:", error);
        }
      } else {
        // For mobile (iOS/Android) - React Native format
        const file: any = {
          uri: img.uri,
          type: img.type,
          name: img.name,
        };
        formData.append("images", file);
      }
    }

    console.log("FormData prepared, sending request...");
    await ProductsAPI.addReview(Number(productId), formData);

    setShowReviewconfirmationModal(true);
    setTimeout(() => {
      setShowReviewconfirmationModal(false);
      redirectToPage(containers.productDetailScreen, { productId });
    }, 1500);
  } catch (error) {
    console.error("Failed to add review:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={FEEDBACK_SCREEN2_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasHeader
      hasFooter={isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      userSidebar={true}
      scrollable
    >
      <KeyBoardWrapper>
        <ScrollView
          contentContainerStyle={isMobileWeb ? styles.webScrollContent : undefined}
          style={isMobileWeb ? styles.webScroll : undefined}
        >
          {/* Mobile web: structured layout with heading and full-width form */}
          {isMobileWeb ? (
            <View style={[styles.contentWrapper, styles.webContentWrapper]}>
              <Text style={[styles.pageHeading, { fontSize: s(28), marginBottom: s(24) }]}>
                Feedback
              </Text>
              <View style={[styles.formContainer, styles.webFormMobile]}>
                <View style={[globalStyles.pt_0]}>
                  <View style={[styles.ratingContainer, { marginBottom: s(20) }]}>
                    <Text style={[styles.ratingTitle, { fontSize: s(18), marginBottom: s(12) }]}>
                      What is your Rating?
                    </Text>
                    <ProductStars
                      starsContainer={{ justifyContent: "space-between" }}
                      rating={rating}
                      needAction={true}
                      size={s(44)}
                      onChangeRating={setRating}
                    />
                  </View>
                  <View style={[styles.reviewInputContainer, { marginBottom: s(20) }]}>
                    <TextInput
                      style={[
                        styles.reviewInput,
                        {
                          height: 140,
                          fontSize: s(16),
                          padding: s(12),
                          borderRadius: 8,
                        },
                      ]}
                      placeholder="Add Your Review"
                      multiline
                      value={reviewText}
                      onChangeText={setReviewText}
                      editable={!isSubmitting}
                    />
                  </View>
                  <View style={[styles.imagePickerContainer, { marginBottom: s(20) }]}>
                    <Text style={[styles.ratingTitle, { fontSize: s(18), marginBottom: s(12) }]}>
                      Would you like to add some pictures? ({selectedImages.length}/{MAX_IMAGES})
                    </Text>
                    <TouchableOpacity
                      style={[styles.addImageButton, styles.webAddImageButton]}
                      onPress={pickImage}
                      disabled={isSubmitting || selectedImages.length >= MAX_IMAGES}
                    >
                      <Ionicons
                        name="add"
                        size={s(28)}
                        color={
                          isSubmitting || selectedImages.length >= MAX_IMAGES
                            ? colors.placeholdergrey
                            : colors.darkGray
                        }
                      />
                    </TouchableOpacity>
                    <View style={[styles.selectedImagesContainer, styles.webSelectedImagesContainer]}>
                      {selectedImages.map((image, index) => (
                        <View key={index} style={[styles.imgContainer, styles.webImgContainer]}>
                          <Image source={{ uri: image.uri }} style={[styles.selectedImage, styles.webSelectedImage]} />
                          <TouchableOpacity
                            onPress={() => removeImage(index)}
                            style={styles.removeImageButton}
                            disabled={isSubmitting}
                          >
                            <Ionicons
                              name="close"
                              size={s(18)}
                              color={isSubmitting ? colors.placeholdergrey : colors.darkGray}
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
                <View style={[styles.submitSection, { marginTop: s(8) }]}>
                  <Button
                    title={isSubmitting ? "Submitting..." : "Submit Review"}
                    onPress={handleAddReview}
                    disabled={isSubmitting || !rating || reviewText.trim() === ""}
                    loading={isSubmitting}
                    style={styles.webSubmitButton}
                  />
                </View>
              </View>
              <ConfirmationModal
                isModalVisible={showReviewconfirmationModal}
                text="Review Added Successfully"
                onClose={() => setShowReviewconfirmationModal(false)}
              />
            </View>
          ) : (
            /* Desktop web + native: original layout unchanged */
            <View
              style={{
                width: isWeb ? "60%" : "100%",
                alignSelf: "center",
              }}
            >
              <View style={[globalStyles.pt_0]}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingTitle}>What is your Rating?</Text>
                  <ProductStars
                    starsContainer={{ justifyContent: "space-between" }}
                    rating={rating}
                    needAction={true}
                    size={60}
                    onChangeRating={setRating}
                  />
                </View>
                <View style={styles.reviewInputContainer}>
                  <TextInput
                    style={[styles.reviewInput, { height: 333 }]}
                    placeholder="Add Your Review"
                    multiline
                    value={reviewText}
                    onChangeText={setReviewText}
                    editable={!isSubmitting}
                  />
                </View>
                <View style={styles.imagePickerContainer}>
                  <Text style={styles.ratingTitle}>
                    Would you like to add some pictures? ({selectedImages.length}/{MAX_IMAGES})
                  </Text>
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={pickImage}
                    disabled={isSubmitting || selectedImages.length >= MAX_IMAGES}
                  >
                    <Ionicons
                      name="add"
                      size={30}
                      color={
                        isSubmitting || selectedImages.length >= MAX_IMAGES
                          ? colors.placeholdergrey
                          : colors.darkGray
                      }
                    />
                  </TouchableOpacity>
                  <View style={styles.selectedImagesContainer}>
                    {selectedImages.map((image, index) => (
                      <View key={index} style={styles.imgContainer}>
                        <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          style={styles.removeImageButton}
                          disabled={isSubmitting}
                        >
                          <Ionicons
                            name="close"
                            size={20}
                            color={
                              isSubmitting ? colors.placeholdergrey : colors.darkGray
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              <View>
                <Button
                  title={isSubmitting ? "Submitting..." : "Submit Review"}
                  onPress={handleAddReview}
                  disabled={isSubmitting || !rating || reviewText.trim() === ""}
                  loading={isSubmitting}
                />
              </View>
              <ConfirmationModal
                isModalVisible={showReviewconfirmationModal}
                text="Review Added Successfully"
                onClose={() => setShowReviewconfirmationModal(false)}
              />
            </View>
          )}
        </ScrollView>
      </KeyBoardWrapper>
    </LayoutComponent>
  );
};

export default feedBackScreen;