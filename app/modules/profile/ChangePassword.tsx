import { CHANGE_PASSWORD_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import Header from "../../components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { UserAPI } from "@/services/userService";
import Bcrypt from "react-native-bcrypt";
import { useSelector } from "react-redux";
import {
  INCORRECT_CURRENT_PASSWORD,
  PASSWORD_CHANGE_FAILED,
  PASSWORD_CHANGED,
} from "../../../constants/customErrorMessages";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import { isValidPassword } from "../../../utilities/validations";

const changePasswordScreen = () => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const user = useSelector((state: any) => state.user.user);
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={CHANGE_PASSWORD_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        // console.log("user in change password", user);
        setPhoneNumber(user.phone);
        
        // Fetch user data from API to get password hash
        try {
          const userId = user._id || user.id;
          if (userId) {
            const response = await UserAPI.getUserById(userId);
            // console.log("User data from API:", response?.data);
            if (response?.data?.password) {
              setExistingPassword(response.data.password);
            } else {
              console.warn("Password not found in user data");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUser();
  }, [user]);

  // console.log("phone in change password", phoneNumber);

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

  const handleBlur = async () => {
    if (!currPassword || !existingPassword) {
      return;
    }
    try {
      const isMatch = await comparePasswords(currPassword, existingPassword);
      // console.log("isMatch", isMatch);
      if (!isMatch) {
        setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
      } else {
        setCurrentPasswordError("");
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
    }
  };

  const handleChangePassword = async () => {
    setCurrentPasswordError("");
    
    if (!currPassword || !newPassword || !confirmPassword) {
      // console.log("Validation failed: Missing fields");
      showErrorAlert({
        title: "Validation Error",
        message: "All fields are required",
      });
      return;
    }

    // Validate current password before proceeding (if we have the password hash)
    if (existingPassword) {
      try {
        // console.log("Validating current password...");
        const isCurrentPasswordValid = await comparePasswords(currPassword, existingPassword);
        // console.log("Current password validation result:", isCurrentPasswordValid);
        if (!isCurrentPasswordValid) {
          setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
          showErrorAlert({
            title: "Error",
            message: INCORRECT_CURRENT_PASSWORD,
          });
          return;
        }
        // console.log("Current password validated successfully");
      } catch (error) {
        console.error("Error validating current password:", error);
        showErrorAlert({
          title: "Error",
          message: "Failed to verify current password. Please try again.",
        });
        return;
      }
    } else {
      // If password hash not available, backend will validate it
      // console.log("Password hash not available, backend will validate current password");
    }

    // console.log("Validating new password format...");
    const newPasswordError = isValidPassword(newPassword);
    if (newPasswordError) {
      // console.log("New password validation failed:", newPasswordError);
      showErrorAlert({
        title: "Validation Error",
        message: newPasswordError,
      });
      return;
    }
    // console.log("New password format validated successfully");
    
    if (newPassword !== confirmPassword) {
      // console.log("Password mismatch validation failed");
      showErrorAlert({
        title: "Validation Error",
        message: "New and Confirm passwords do not match",
      });
      return;
    }
    // console.log("Password match validated successfully");

    try {
      // console.log("Calling API to change password...");
      const response = await UserAPI.changePassword({ 
        newPassword,
        currentPassword: currPassword 
      });
      // console.log("API response:", response);
      // console.log("API response data:", response.data);
      
      if (response.data.message === "Password successfully changed") {
        // console.log("Password changed successfully");
        showErrorAlert({
          title: "Success",
          message: PASSWORD_CHANGED,
        });

        redirectToPage(containers.signInScreen);
      } else {
        // console.log("Password change failed - unexpected response:", response.data);
        showErrorAlert({
          title: "Error",
          message: PASSWORD_CHANGE_FAILED,
        });
        redirectToPage(containers.userProfileScreen);
      }
    } catch (err: any) {
      console.error("API call error:", err);
      console.error("Error response:", err?.response);
      console.error("Error response data:", err?.response?.data);
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to change password";
      
      if (errorMessage.toLowerCase().includes("current password") || 
          errorMessage.toLowerCase().includes("incorrect password")) {
        setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
      }
      
      showErrorAlert({
        title: "Error",
        message: errorMessage,
      });
      // Don't redirect on error, let user try again
    }
  };

  return (
    <LayoutComponent
      scrollable={false}
      hasHeader
      hasFooter={isTabOrDesktop}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isTabOrDesktop}
      userSidebar={true}
    >
      <KeyBoardWrapper>
        <ScrollView>
          <View
            style={[
              globalStyles.pt_0,
              isTabOrDesktop && webStyles.contentWidth,
            ]}
          >
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
                  setValue={(value) => {
                    setCurrPassword(value);
                    setCurrentPasswordError("");
                  }}
                  onblur={handleBlur}
                />
                {currentPasswordError && (
                  <Text style={[globalStyles.errorText, { marginTop: 4 }]}>
                    {currentPasswordError}
                  </Text>
                )}
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
    </LayoutComponent>
  );
};

export default changePasswordScreen;

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "70%",
    alignSelf: "center",
  },
});