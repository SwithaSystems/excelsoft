import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import styles from "./customerSupportScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import Footer from "@/components/Footer";

const customerSupportScreen = () => {
  const handlePhonePress = () => {
    Linking.openURL("tel:+15551234567"); // Replace with your actual phone number
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:excelsoft@gmail.com"); // Replace with your actual email address
  };
  return (
    <View style={globalStyles.container}>
      <Header headerText="Customer Support" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <View>
            <Text style={styles.subtitle}>
              Choose the way you prefer to contact us
            </Text>

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
                  Speak with our team
                </Text>
                <Text style={styles.optionDescription}>+1 (555) 123-4567</Text>
                <Text style={styles.availability}>
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color={colors.black}
                    style={{ marginRight: 8 }}
                  />
                  Sun-Sat
                </Text>
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
                <Text style={styles.optionDescription}>
                  Write to us here...
                </Text>
                <Text style={styles.optionDescription}>
                  excelsoft@gmail.com
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default customerSupportScreen;
