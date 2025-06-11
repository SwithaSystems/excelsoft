import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
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
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "@/services/userService";
import { useSelector } from "react-redux";
import colors from "../config/colors";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";

const feedBackScreen = () => {
  const { productId, reviewsArrayLength } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showReviewconfirmationModal, setShowReviewconfirmationModal] =
    useState(false);
  const userData_redux = useSelector((state: any) => state.user.user);

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
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
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
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable
      headerComponent={
        <Header
          headerText="Add Your Review"
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
        {/* <View style={globalStyles.container}>
          <Header
            headerText="Add Your Review"
            secondaryBtnText="Discard"
            secondaryBtnCallBack={() => {
              redirectToPage(containers.productDetailScreenScreen, {
                productId: productId,
              });
            }}
          />
          <ScrollView> */}
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
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
                color={isSubmitting ? "#ccc" : "gray"}
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
        {/* </ScrollView> */}
        <View style={globalStyles.p_3}>
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
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default feedBackScreen;
