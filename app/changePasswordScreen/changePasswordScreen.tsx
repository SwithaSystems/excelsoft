import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React from "react";
import { ScrollView, View } from "react-native";

const changePasswordScreen = () => {
  return (
    <View style={globalStyles.container}>
      <Header headerText="Change Password" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}></View>
      </ScrollView>
    </View>
  );
};

export default changePasswordScreen;
