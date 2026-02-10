import { CUSTOMER_SUPPORT_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React from "react";
import { View, Text, Linking, TouchableOpacity, Platform } from "react-native";
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

const customerSupportScreen = () => {
  const isWeb = Platform.OS === "web";

  const SUPPORT_PHONE = "+447594897670";

  const handlePhonePress = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };


  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={CUSTOMER_SUPPORT_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <Footer />;

  // const handlePhonePress = () => {
  //   Linking.openURL("tel:+15551234567"); // Replace with your actual phone number
  // };

  const SUPPORT_EMAIL = "mayur@weekesretail.co.uk";

  const handleEmailPress = () => {
  if (Platform.OS === "web") {
    window.location.href = `mailto:${SUPPORT_EMAIL}`;
  } else {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  }
};
  return (
    <LayoutComponent
      hasFooter
      hasHeader
      scrollable={!isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
    >
      <View
        style={[
          globalStyles.pt_0,
          isWeb && styles.contentWidthWeb,
        ]}
      >
        <View>
          <Text style={styles.subtitle}>Please contact us at</Text>

          <TouchableOpacity
            style={styles.contactOption}
            onPress={handlePhonePress}
          >
            <View style={styles.textContainer}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="call-outline"
                    size={24}
                    color={colors.black}
                  />
                </View>
                <Text style={styles.optionTitle}>Call Us</Text>
              </View>

              <Text style={styles.optionDescription}>
                Speak with our support team
              </Text>

              <Text style={styles.optionDescription}>
                +44 7594 897670
              </Text>

              <View style={styles.availability}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.black}
                  style={{ marginRight: 6 }}
                />
                <Text>Sun – Sat</Text>
              </View>
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.contactOption}
            onPress={handleEmailPress}
          >
            <View style={styles.textContainer}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.iconContainer}>
                  <Ionicons name="mail-outline" size={24} color="black" />
                </View>
                <Text style={styles.optionTitle}>Mail Us</Text>
              </View>
              <Text style={styles.optionDescription}>Write to us here...</Text>
              <Text style={styles.optionDescription}> mayur@weekesretail.co.uk</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LayoutComponent>
  );
};

export default customerSupportScreen;
