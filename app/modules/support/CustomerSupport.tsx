import { CUSTOMER_SUPPORT_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import styles from "./CustomerSupportStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import Footer from "@/app/components/Footer";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const SUPPORT_PHONE = "+447594897670";
const SUPPORT_EMAIL = "mayur@weekesretail.co.uk";

const customerSupportScreen = () => {
  const isWeb = Platform.OS === "web";
  const { isMobile: isMobileWeb } = useWebMediaQuery();
  const isMobileWebView = isWeb && isMobileWeb;

  const handlePhonePress = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };

  const handleEmailPress = () => {
    if (Platform.OS === "web") {
      window.location.href = `mailto:${SUPPORT_EMAIL}`;
    } else {
      Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
    }
  };

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={CUSTOMER_SUPPORT_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <Footer />;

  const contentContainerStyle = [
    globalStyles.pt_0,
    styles.container,
    isWeb && styles.containerWeb,
    isMobileWebView && styles.containerMobileWeb,
    isWeb && !isMobileWebView && styles.contentWidthWeb,
  ];

  const Wrapper = isWeb ? ScrollView : View;
  const wrapperProps = isWeb
    ? { style: { flex: 1 }, contentContainerStyle: { flexGrow: 1 }, showsVerticalScrollIndicator: false }
    : {};

  return (
    <LayoutComponent
      hasFooter
      hasHeader
      scrollable={!isWeb}
      hasSidebar={isWeb}
      userSidebar={true}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
    >
      <Wrapper {...wrapperProps}>
        <View style={contentContainerStyle}>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>We're here to help</Text>
            <Text style={styles.heroSubtitle}>
              Get in touch with our team for orders, product questions, or
              feedback. We aim to respond as quickly as we can.
            </Text>
          </View>

          <Text style={styles.sectionLabel}>Contact options</Text>

          <View
            style={[
              styles.cardsRow,
              isWeb && !isMobileWebView && styles.cardsRowWeb,
            ]}
          >
            <TouchableOpacity
              style={[styles.card, isWeb && !isMobileWebView && styles.cardWeb]}
              onPress={handlePhonePress}
              activeOpacity={0.7}
            >
              <View style={styles.cardInner}>
                <View style={[styles.iconWrapper, styles.iconWrapperCall]}>
                  <Ionicons
                    name="call-outline"
                    size={26}
                    color={colors.primary}
                  />
                </View>
                <Text style={styles.optionTitle}>Call us</Text>
                <Text style={styles.optionDescription}>
                  Speak with our support team
                </Text>
                <Text style={styles.optionValue}>+44 7594 897670</Text>
                <View style={styles.availabilityRow}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.secondaryText}
                  />
                  <Text style={styles.availabilityText}>Sun – Sat</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, isWeb && !isMobileWebView && styles.cardWeb]}
              onPress={handleEmailPress}
              activeOpacity={0.7}
            >
              <View style={styles.cardInner}>
                <View style={[styles.iconWrapper, styles.iconWrapperEmail]}>
                  <Ionicons
                    name="mail-outline"
                    size={26}
                    color={colors.infoText}
                  />
                </View>
                <Text style={styles.optionTitle}>Email us</Text>
                <Text style={styles.optionDescription}>
                  Write to us and we'll get back to you
                </Text>
                <Text style={[styles.optionValue, { color: colors.infoText }]}>
                  {SUPPORT_EMAIL}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Wrapper>
    </LayoutComponent>
  );
};

export default customerSupportScreen;
