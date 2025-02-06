import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import styles from "./editAccountInformationscreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";

const editAccountInformationscreen = () => {
  return (
    <View style={globalStyles.container}>
      <Header headerText="Edit Account Information" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}></View>
      </ScrollView>
    </View>
  );
};

export default editAccountInformationscreen;
