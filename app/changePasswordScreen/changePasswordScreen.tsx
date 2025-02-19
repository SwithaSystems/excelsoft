import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import Header from "@/components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from "react-native-elements";

const changePasswordScreen = () => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <View style={globalStyles.container}>
      <Header headerText="Change Password" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={globalStyles.profileImage}
            />
          </View>
          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>Current Password</Text>
              <CustomTextInput
                secureTextEntry={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Enter your current Password"
                value={currPassword}
                onPress={() => {}}
                setValue={setCurrPassword}
              />
            </View>
          </View>
          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>New Password</Text>
              <CustomTextInput
                secureTextEntry={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Enter your new Password"
                value={newPassword}
                onPress={() => {}}
                setValue={setNewPassword}
              />
            </View>
          </View>
          <View style={globalStyles.profileInputContainer}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>
                Confirm New Password
              </Text>
              <CustomTextInput
                secureTextEntry={true}
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Re-enter your new Password"
                value={confirmPassword}
                onPress={() => {}}
                setValue={setConfirmPassword}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={globalStyles.p_3}>
        <Button
          onPress={() => {
            redirectToPage(containers.userProfileScreenScreen);
          }}
          title="Save Password"
        />
      </View>
    </View>
  );
};

export default changePasswordScreen;
