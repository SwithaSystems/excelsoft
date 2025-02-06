import React from "react";
import { View, Text, StyleSheet } from "react-native";
import styles from "./editProfileScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { ScrollView } from "react-native";

const editProfileScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Header headerText="Edit Profile" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}></View>
      </ScrollView>
    </View>
  );
};

export default editProfileScreen;
