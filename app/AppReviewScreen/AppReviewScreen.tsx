import { APP_REVIEW_SCREEN_TITLE } from './../config/stringLiterals';
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
import { globalStyles } from "@/assets/styles/globalStyles";
import styles from "./AppReviewScreenStyles";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "@/components/ProductStars";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import colors from "../config/colors";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";

const appReviewScreen = () => {
  const [rating, setRating] = useState(0);

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable
      headerComponent={<Header headerText={APP_REVIEW_SCREEN_TITLE} />}
    >
      <KeyBoardWrapper>
        {/* <View style={styles.container}>
          <Header
            headerText="Feedback"
            // secondaryBtnText="Discard"
            // secondaryBtnCallBack={() => {
            // redirectToPage(containers.userProfileScreenScreen);
            // }}
          /> */}

        {/* <ScrollView style={styles.reviewContainer}> */}
        <View style={styles.ratingCategory}>
          <Text style={styles.label}>Tell us about your expereince!</Text>
          <Text style={styles.label}>Rate your site Experience</Text>
          <ProductStars
            starsContainer={{
              justifyContent: "space-between",
              //backgroundColor: colors.placeholdergrey,
            }}
            rating={rating}
            needAction={true}
            size={60}
            onChangeRating={setRating}
          />
        </View>
        <View style={styles.selectCategory}>
          <Text style={styles.label}>Tell us your feedback about</Text>
          <View style={styles.chooseCategory}>
            <TextInput
              placeholder="Choose your category"
              style={styles.categoryText}
            />
            <Ionicons
              name="chevron-down-outline"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>
        <View style={styles.radioContainer}>
          <Text style={styles.label}>Did any thing stop your shopping?</Text>
          <TouchableOpacity style={styles.radioOption}>
            <Ionicons
              name="radio-button-off"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.radioLabel}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption}>
            <Ionicons
              name="radio-button-off"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.radioLabel}>No</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addYourReview}>
          <Text style={styles.label}>
            Do you want to talk about your experience?
          </Text>
          <TextInput
            style={[styles.reviewText]}
            placeholder="Add your experience"
            multiline
            numberOfLines={8}
          />
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit Feedback</Text>
        </TouchableOpacity>
        {/* </ScrollView> */}
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default appReviewScreen;
