import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "./feedBackScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { ScrollView } from "react-native";

const feedBackScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Header headerText="Feedback" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}></View>
      </ScrollView>
    </View>
  );
};

export default feedBackScreen;
