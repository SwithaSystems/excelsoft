import { CHANGE_PASSWORD_SCREEN_TITLE } from "./../config/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import Header from "@/components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { Image } from "react-native-elements";
import { UserAPI } from "@/services/userService";
import Bcrypt from "react-native-bcrypt";
import { useSelector } from "react-redux";
import {
  INCORRECT_CURRENT_PASSWORD,
  PASSWORD_CHANGE_FAILED,
  PASSWORD_CHANGED,
} from "../config/customErrorMessages";
import { showErrorAlert } from "../config/showErrorAlert";
import PageLayout from "../pageLayoutProps";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";

const changePasswordScreen = () => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        console.log("user in change password", user);
        setPhoneNumber(user.phone);
        setExistingPassword(user.password);
      }
    };

    fetchUser();
  }, [user]);

  console.log("phone in change password", phoneNumber);

  const comparePasswords = async (
    currentPassword: any,
    existingPassword: any
  ) => {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(currentPassword, existingPassword, function (err, res) {
        if (err) reject(err);
        else resolve(res); 
      });
    });
  };

  const handleBlur = async (currentPassword: string) => {
    const isMatch = await comparePasswords(currPassword, existingPassword);
    console.log("isMatch", isMatch);
    if (!isMatch) {
      showErrorAlert({
        title: "Error",
        message: INCORRECT_CURRENT_PASSWORD,
      });
    }
  };

 
  const handleChangePassword = async () => {
    if (!currPassword || !newPassword || !confirmPassword) {
      showErrorAlert({
        title: "Validation Error",
        message: "All fields are required",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorAlert({
        title: "Validation Error",
        message: "New and Confirm passwords do not match",
      });
      return;
    }

    try {
      const response = await UserAPI.changePassword({ newPassword });
      console.log("response", response.data);
      if (response.data.message === "Password successfully changed") {
        showErrorAlert({
          title: "Success",
          message: PASSWORD_CHANGED,
        });

        redirectToPage(containers.signInScreen);
      } else {
        showErrorAlert({
          title: "Error",
          message: PASSWORD_CHANGE_FAILED,
        });
        redirectToPage(containers.userProfileScreenScreen);
      }
    } catch (err) {
      alert("Failed to change password");
      console.error(err);
      redirectToPage(containers.userProfileScreenScreen);
    }
  };

  return (
    <PageLayout
      scrollable={false}
      hasHeader
      hasFooter={false}
      headerComponent={<Header headerText={CHANGE_PASSWORD_SCREEN_TITLE} />}
    >
      <KeyBoardWrapper>
        <ScrollView>
          <View style={[globalStyles.pt_0]}>
            <View style={globalStyles.profileInputContainer}>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.userInputLabel}>
                  Current Password
                </Text>
                <CustomTextInput
                  secureTextEntry={true}
                  containerStyle={globalStyles.userInputContainer}
                  TextStyle={globalStyles.input}
                  placeholder="Enter your current Password"
                  value={currPassword}
                  onPress={() => {}}
                  setValue={setCurrPassword}
                  
                 
                  onblur={() => {
                    handleBlur(currPassword);
                  }}
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
            <Button onPress={handleChangePassword} title="Save Password" />
          </View>
        </ScrollView>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default changePasswordScreen;
