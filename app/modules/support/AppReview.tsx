import { APP_REVIEW_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import styles from "./AppReviewStyles";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "@/app/components/ProductStars";
import colors from "../../../constants/colors";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

const AppReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const isWeb = Platform.OS === "web";

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={APP_REVIEW_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasHeader
      hasFooter={isWeb}
      scrollable={!isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
    >
      <KeyBoardWrapper>
        <View style={[styles.reviewContainer, isWeb && styles.reviewContainerWeb]}>
          
          {/* Rating */}
          <View style={styles.ratingCategory}>
            <Text style={styles.label}>Tell us about your experience</Text>
            <Text style={styles.label}>Rate your site experience</Text>
            <ProductStars
              starsContainer={{ justifyContent: "space-between" }}
              rating={rating}
              needAction={true}
              size={60}
              onChangeRating={setRating}
            />
          </View>

          {/* Category */}
          <View style={styles.selectCategory}>
            <Text style={styles.label}>Tell us your feedback about</Text>
            <View style={styles.chooseCategory}>
              <TextInput
                placeholder="Choose your category"
                style={styles.categoryText}
                placeholderTextColor={colors.placeholdergrey}
              />
              <Ionicons
                name="chevron-down-outline"
                size={22}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Radio */}
          <View style={styles.radioContainer}>
            <Text style={styles.label}>Did anything stop your shopping?</Text>

            <TouchableOpacity style={styles.radioOption}>
              <Ionicons name="radio-button-off" size={20} color={colors.primary} />
              <Text style={styles.radioLabel}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioOption}>
              <Ionicons name="radio-button-off" size={20} color={colors.primary} />
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>
          </View>

          {/* Review */}
          <View style={styles.addYourReview}>
            <Text style={styles.label}>
              Do you want to talk about your experience?
            </Text>
            <TextInput
              style={styles.reviewText}
              placeholder="Add your experience"
              placeholderTextColor={colors.placeholdergrey}
              multiline
              numberOfLines={8}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitText}>Submit Feedback</Text>
          </TouchableOpacity>

        </View>
      </KeyBoardWrapper>
    </LayoutComponent>
  );
};

export default AppReviewScreen;
