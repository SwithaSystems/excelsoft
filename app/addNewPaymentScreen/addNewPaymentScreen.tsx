import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import styles from "./addNewPaymentScreenStyles";
import colors from "../config/colors";
import { globalStyles } from "@/assets/styles/globalStyles";

const addNewPaymentScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>addNewPaymentScreen Component</Text>
      </View>
    </SafeAreaView>
  );
};

export default addNewPaymentScreen;
