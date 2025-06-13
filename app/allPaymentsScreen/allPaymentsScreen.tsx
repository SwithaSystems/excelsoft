import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import styles from "./allPaymentsScreenStyles";
import colors from "../config/colors";
import { globalStyles } from "@/assets/styles/globalStyles";

const allPaymentsScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>allPaymentsScreen Component</Text>
      </View>
    </SafeAreaView>
  );
};

export default allPaymentsScreen;
