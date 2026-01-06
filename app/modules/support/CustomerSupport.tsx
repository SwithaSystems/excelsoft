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

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={CUSTOMER_SUPPORT_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : <Footer />;

  const handlePhonePress = () => {
    Linking.openURL("tel:+15551234567"); // Replace with your actual phone number
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:excelsoft@gmail.com"); // Replace with your actual email address
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

          {/*<TouchableOpacity
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
                  Speak with our team
                </Text>
                <Text style={styles.optionDescription}>+1 (555) 123-4567</Text>
                <View style={styles.availability}>
                  <Text>
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color={colors.black}
                    style={{ marginRight: 8 }}
                  />
                  Sun-Sat
                  </Text>
                </View>
              </View>
            </TouchableOpacity>*/}

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
              <Text style={styles.optionDescription}>excelsoft@gmail.com</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LayoutComponent>
  );
};

export default customerSupportScreen;
