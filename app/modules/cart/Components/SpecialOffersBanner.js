import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Or your preferred icon library
import colors from "../../../../constants/colors";
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const SpecialOffersBanner = () => {
  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="gift-outline" size={30} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.text, { marginBottom: 4 }]}>Special Offers</Text>
          <Text style={styles.text}>Save upto 50%!</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => {
              redirectToPage(containers.offersScreen);
            }}
          >
            <Text style={styles.checkButtonText}>Check</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 400,
  },
  buttonContainer: {
    marginLeft: "auto",
  },
  checkButton: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: 140,
  },
  checkButtonText: {
    color: colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
});

export default SpecialOffersBanner;
