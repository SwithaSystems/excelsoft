import { CUSTOMER_SUPPORT_SCREEN_TITLE } from "../../config/stringLiterals";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./CustomerSupportStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../config/colors";
import Footer from "@/app/components/Footer";
import PageLayout from "../../pageLayoutProps";

const customerSupportScreen = () => {
  const handlePhonePress = () => {
    Linking.openURL("tel:+15551234567"); // Replace with your actual phone number
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:excelsoft@gmail.com"); // Replace with your actual email address
  };
  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText={CUSTOMER_SUPPORT_SCREEN_TITLE} />}
      footerComponent={<Footer />}
    >
      <View style={[globalStyles.pt_0]}>
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
    </PageLayout>
  );
};

export default customerSupportScreen;
