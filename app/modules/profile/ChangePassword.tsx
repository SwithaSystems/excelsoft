import { CHANGE_PASSWORD_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import Header from "../../components/Header";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, Platform } from "react-native";
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
import colors from "@/constants/colors";

const changePasswordScreen = () => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  // Web-only validation states
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const isWeb = Platform.OS === "web";

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={CHANGE_PASSWORD_SCREEN_TITLE} />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

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
      if (isWeb) {
        setCurrentPasswordError("Failed to verify current password. Please try again.");
      }
    }
  };

  const handleChangePassword = async () => {
    // Web-only: Set submit attempted flag and validate fields
    if (isWeb) {
      setSubmitAttempted(true);
      
      // Reset web-specific errors (but keep currentPasswordError for now, will validate below)
      setNewPasswordError("");
      setConfirmPasswordError("");
      
      // Validate all fields for web
      let hasErrors = false;
      
      // Validate current password
      if (!currPassword.trim()) {
        setCurrentPasswordError("Current password is required");
        hasErrors = true;
      } else {
        // Clear any previous "required" error if field is now filled
        if (currentPasswordError === "Current password is required") {
          setCurrentPasswordError("");
        }
      }
      
      // Validate new password
      if (!newPassword.trim()) {
        setNewPasswordError("New password is required");
        hasErrors = true;
      } else {
        const passwordValidationError = isValidPassword(newPassword);
        if (passwordValidationError) {
          setNewPasswordError(passwordValidationError);
          hasErrors = true;
        }
      }
      
      // Validate confirm password
      if (!confirmPassword.trim()) {
        setConfirmPasswordError("Confirm password is required");
        hasErrors = true;
      } else if (newPassword !== confirmPassword) {
        setConfirmPasswordError("New and Confirm passwords do not match");
        hasErrors = true;
      }
      
      // If there are validation errors, stop here (don't proceed to API call)
      if (hasErrors) {
        return;
      }
    }
    
    // Mobile validation (existing behavior)
    if (!isWeb) {
      // Clear current password error for mobile
      setCurrentPasswordError("");
      
      if (!currPassword || !newPassword || !confirmPassword) {
        // console.log("Validation failed: Missing fields");
        showErrorAlert({
          title: "Validation Error",
          message: "All fields are required",
        });
        return;
      }
    }

    // Validate current password before proceeding (if we have the password hash)
    if (existingPassword) {
      try {
        // console.log("Validating current password...");
        const isCurrentPasswordValid = await comparePasswords(currPassword, existingPassword);
        // console.log("Current password validation result:", isCurrentPasswordValid);
        if (!isCurrentPasswordValid) {
          setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
          if (isWeb) {
            // Web: error already shown inline, no need for alert
          } else {
            // Mobile: show alert (existing behavior)
            showErrorAlert({
              title: "Error",
              message: INCORRECT_CURRENT_PASSWORD,
            });
          }
          return;
        }
        // console.log("Current password validated successfully");
      } catch (error) {
        console.error("Error validating current password:", error);
        if (isWeb) {
          setCurrentPasswordError("Failed to verify current password. Please try again.");
        } else {
          showErrorAlert({
            title: "Error",
            message: "Failed to verify current password. Please try again.",
          });
        }
        return;
      }
    } else {
      // If password hash not available, backend will validate it
      // console.log("Password hash not available, backend will validate current password");
    }

    // Mobile-only: Additional validation (web validation already done above)
    if (!isWeb) {
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
    }

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
        // Web: show inline error, also show alert for visibility
        // Mobile: show alert (existing behavior)
        showErrorAlert({
          title: "Error",
          message: errorMessage,
        });
      } else {
        // Other errors: show alert for both web and mobile
        showErrorAlert({
          title: "Error",
          message: errorMessage,
        });
      }
    }
  };

  return (
    <LayoutComponent
      scrollable={false}
      hasHeader
      hasFooter={isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <KeyBoardWrapper>
        <ScrollView>
          <View
            style={[
              globalStyles.pt_0,
              isWeb && webStyles.contentWidth,
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
                    // Web-only: Clear "required" error when user types, but keep bcrypt validation errors until blur/submit
                    if (isWeb && submitAttempted) {
                      // Only clear if it's a "required" error, not a bcrypt validation error
                      if (currentPasswordError === "Current password is required") {
                        setCurrentPasswordError("");
                      }
                    } else {
                      // Mobile: always clear on type
                      setCurrentPasswordError("");
                    }
                  }}
                  onblur={handleBlur}
                />
                {((isWeb && submitAttempted && !currPassword.trim()) || currentPasswordError) && (
                  <Text style={[globalStyles.errorText, isWeb && { marginTop: -8, marginBottom: 0 }]}>
                    {currentPasswordError || (isWeb && submitAttempted && !currPassword.trim() ? "Current password is required" : "")}
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
                  setValue={(value) => {
                    setNewPassword(value);
                    // Web-only: Clear error when user types
                    if (isWeb && submitAttempted) {
                      if (value.trim()) {
                        const passwordValidationError = isValidPassword(value);
                        if (passwordValidationError) {
                          setNewPasswordError(passwordValidationError);
                        } else {
                          setNewPasswordError("");
                        }
                        // Re-validate confirm password match
                        if (confirmPassword && value !== confirmPassword) {
                          setConfirmPasswordError("New and Confirm passwords do not match");
                        } else if (confirmPassword && value === confirmPassword) {
                          setConfirmPasswordError("");
                        }
                      } else {
                        setNewPasswordError("");
                      }
                    }
                  }}
                />
                {isWeb && submitAttempted && newPasswordError && (
                  <Text style={[globalStyles.errorText, isWeb && { marginTop: -8, marginBottom: 0 }]}>
                    {newPasswordError}
                  </Text>
                )}
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
                  setValue={(value) => {
                    setConfirmPassword(value);
                    // Web-only: Clear error when user types
                    if (isWeb && submitAttempted) {
                      if (value.trim()) {
                        if (newPassword && value !== newPassword) {
                          setConfirmPasswordError("New and Confirm passwords do not match");
                        } else {
                          setConfirmPasswordError("");
                        }
                      } else {
                        setConfirmPasswordError("");
                      }
                    }
                  }}
                />
                {isWeb && submitAttempted && confirmPasswordError && (
                  <Text style={[globalStyles.errorText, isWeb && { marginTop: -8, marginBottom: 0 }]}>
                    {confirmPasswordError}
                  </Text>
                )}
              </View>
            </View>
            {isWeb ? (
              <View style={webStyles.inlineButtonRow}>
                <Button
                  primary={false}
                  title="Cancel"
                  onPress={() => redirectToPage(containers.userProfileScreen)}
                  style={webStyles.cancelButton}
                  textStyle={webStyles.cancelButtonText}
                />
                <Button
                  title="Save Password"
                  onPress={handleChangePassword}
                  style={webStyles.saveButton}
                  textStyle={webStyles.saveButtonText}
                />
              </View>
            ) : (
              <Button onPress={handleChangePassword} title="Save Password" />
            )}

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

  inlineButtonRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },

  /* SAVE (Primary) */
  saveButton: {
    minWidth: 160,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  cancelButton: {
    minWidth: 140,
    height: 44,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
  },
});
