import { APP_REVIEW_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import styles from "./AppReviewStyles";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import ProductStars from "@/app/components/ProductStars";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import colors from "../../../constants/colors";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

const appReviewScreen = () => {
  const [rating, setRating] = useState(0);
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={APP_REVIEW_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : null;

  return (
    <LayoutComponent
      hasHeader
      hasFooter={isTabOrDesktop}
      scrollable={!isTabOrDesktop}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
    >
      <KeyBoardWrapper>
        <View
          style={[
            styles.reviewContainer,
            isTabOrDesktop && styles.reviewContainerWeb,
          ]}
        >
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
        </View>
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </LayoutComponent>
  );
};

export default appReviewScreen;
