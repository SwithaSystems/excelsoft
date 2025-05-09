import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import styles from "./catagoryScreenStyles";
import colors from "../config/colors";

const catagoryScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={styles.container}>
      <Text style={styles.text}>catagoryScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default catagoryScreen;
