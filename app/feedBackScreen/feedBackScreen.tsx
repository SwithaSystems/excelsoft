import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import styles from "./feedBackScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "@/components/ProductStars";
import Button from "@/components/commonComponents/Button";
import * as ImagePicker from "expo-image-picker";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { ProductsAPI } from "@/services/productService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "@/services/userService";
import { useSelector } from "react-redux";
import colors from "../config/colors";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";
import { FEEDBACK_SCREEN2_TITLE } from "../config/stringLiterals";

type Media = {
  uri: string;
  type?: string;
};

const feedBackScreen = () => {
  const { productId, reviewsArrayLength } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showReviewconfirmationModal, setShowReviewconfirmationModal] =
    useState(false);
  const userData_redux = useSelector((state: any) => state.user.user);
  const [mediaAssets, setMediaAssets] = useState<Media[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    if(mediaAssets.length >= 5){
      alert("You can only upload up to 5 media.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      // aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const selected = result.assets;
      console.log("Image picker result", result);
      const total = mediaAssets.length + selected.length;

      if (total > 5) {
        alert("You can only upload up to 5 media.");
        return;
      }

      setMediaAssets([...mediaAssets, ...selected]);
      // setImage(result.assets[0].uri);
    }
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
      const userphone = userData_redux.phone;
      const user = await UserAPI.getUserByPhonenumber(userphone);
      const UserParsed = user.data;

      const review = {
        id: (Number(reviewsArrayLength) + 1).toString(),
        rating: rating,
        name: UserParsed?.firstName,
        review: reviewText,
      };

      await ProductsAPI.addReview(Number(productId), review);
      setShowReviewconfirmationModal(true);

      // setTimeout(() => {
      redirectToPage(containers.productDetailScreenScreen, {
        productId: productId,
      });
      // }, 1500);
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
          secondaryBtnText="Discard"
          secondaryBtnCallBack={() => {
            redirectToPage(containers.productDetailScreenScreen, {
              productId: productId,
            });
          }}
        />
      }
    >
      <KeyBoardWrapper>
        <ScrollView>
        <View
          style={[
            globalStyles.pt_0,
          ]}
        >
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
                color={isSubmitting ? colors.borderGrey : colors.darkGray}
              />
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              />
            )}
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
          visible={showReviewconfirmationModal}
          message="Review Added Successfully"
          onClose={() => setShowReviewconfirmationModal(false)}
        />
        </ScrollView>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default feedBackScreen;
