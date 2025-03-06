import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const feedBackScreen = () => {
  const { productId, reviewsArrayLength } = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showReviewconfirmationModal, setShowReviewconfirmationModal] =
    useState(false);

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    // Open the image picker
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
    if (!rating || reviewText.trim() === "") {
      alert("Please enter both a rating and review text.");
      return;
    }

    const review = {
      id: (Number(reviewsArrayLength) + 1).toString(),
      rating: rating,
      name: "User",
      review: reviewText,
    };

    try {
      await ProductsAPI.addReview(Number(productId), review);
      setShowReviewconfirmationModal(true);

      // Navigate to product detail page after a short delay
      setTimeout(() => {
        redirectToPage(containers.productDetailScreenScreen, {
          productId: productId,
        });
      }, 1500);
    } catch (error) {
      console.error("Failed to add review:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Header
        headerText="Feedback"
        secondaryBtnText="Discard"
        secondaryBtnCallBack={() => {
          redirectToPage(containers.productDetailScreenScreen, {
            productId: productId,
          });
        }}
      />
      <ScrollView>
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
            />
          </View>
          <View style={styles.imagePickerContainer}>
            <Text style={styles.ratingTitle}>
              Would you like to add some pictures?
            </Text>
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Ionicons name="add" size={30} color="gray" />
            </TouchableOpacity>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200, marginTop: 10 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <View style={globalStyles.p_3}>
        <Button
          title="Submit Review"
          onPress={handleAddReview}
          // style={styles.submitButton}
        />
      </View>
      <ConfirmationModal
        visible={showReviewconfirmationModal}
        message="Review Added Successfully"
        onClose={() => setShowReviewconfirmationModal(false)}
      />
    </View>
  );
};

export default feedBackScreen;
