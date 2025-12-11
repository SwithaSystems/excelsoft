import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, useWindowDimensions } from "react-native";
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

const MAX_IMAGES = 5;

const feedBackScreen = () => {
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const { productId, reviewsArrayLength } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImages, setSelectedImages] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  // const [image, setImage] = useState<string | null>(null);
  const [showReviewconfirmationModal, setShowReviewconfirmationModal] =
    useState(false);
  const userData_redux = useSelector((state: any) => state.user.user);
  // const [mediaAssets, setMediaAssets] = useState<Media[]>([]);
  console.log("userData_redux", userData_redux);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
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
      const totalImages = [...selectedImages, ...newImages].slice(
        0,
        MAX_IMAGES
      );
      setSelectedImages(totalImages);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const handleAddReview = async () => {
    if (isSubmitting) {
      return;
    }

    if (!rating || reviewText.trim() === "") {
      alert("Please enter both a rating and review text.");
      return;
    }
    setIsSubmitting(true);
    try {
      const userID = userData_redux._id
        ? userData_redux._id
        : userData_redux.id;
      const user = await UserAPI.getUserById(userID);
      const UserParsed = user.data;
      console.log("user in addreview", UserParsed);

      // const review = {
      //   id: (Number(reviewsArrayLength) + 1).toString(),
      //   rating: rating,
      //   name: UserParsed?.firstName,
      //   review: reviewText,
      // };

      const formData = new FormData();
      formData.append("id", (Number(reviewsArrayLength) + 1).toString());
      formData.append("rating", rating.toString());
      formData.append("name", UserParsed?.firstName);
      formData.append("review", reviewText);

      selectedImages.forEach((img) => {
        formData.append("images", {
          uri: img.uri,
          name: img.name,
          type: img.type,
        } as any);
      });
      await ProductsAPI.addReview(Number(productId), formData);
      setShowReviewconfirmationModal(true);

      setTimeout(() => {
        setShowReviewconfirmationModal(false);
        redirectToPage(containers.productDetailScreen, {
          productId: productId,
        });
      }, 1500);
    } catch (error) {
      console.error("Failed to add review:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable
      headerComponent={
        <Header
          headerText={FEEDBACK_SCREEN2_TITLE}
          hideBackArrow={isTabOrDesktop}
          secondaryBtnText="Discard"
          secondaryBtnCallBack={() => {
            redirectToPage(containers.productDetailScreen, {
              productId: productId,
            });
          }}
        />
      }
    >
      <KeyBoardWrapper>
        <ScrollView>
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
                Would you like to add some pictures?
              </Text>
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={pickImage}
                disabled={isSubmitting}
              >
                <Ionicons
                  name="add"
                  size={30}
                  color={
                    isSubmitting ? colors.placeholdergrey : colors.darkGray
                  }
                />
              </TouchableOpacity>
              {/* {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              />
            )} */}

              <View style={styles.selectedImagesContainer}>
                {selectedImages.map((image, index) => (
                  <View key={index} style={styles.imgContainer}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      onPress={() => removeImage(index)}
                      style={styles.removeImageButton}
                      disabled={isSubmitting}
                    >
                      <Ionicons
                        name="close"
                        size={20}
                        color={
                          isSubmitting
                            ? colors.placeholdergrey
                            : colors.darkGray
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
        </ScrollView>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default feedBackScreen;
