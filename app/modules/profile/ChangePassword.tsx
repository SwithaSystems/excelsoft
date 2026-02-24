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
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import { isValidPassword } from "../../../utilities/validations";
import colors from "@/constants/colors";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";

const changePasswordScreen = () => {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [existingPassword, setExistingPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModalState, setErrorModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });
  const user = useSelector((state: any) => state.user.user);
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

  const showErrorAlert = ({
    title,
    message,
    buttonLabel = "OK",
  }: {
    title: string;
    message: string;
    buttonLabel?: string;
  }) => {
    setErrorModalState({
      isVisible: true,
      title,
      message,
      buttonLabel,
    });
  };

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
        setPhoneNumber(user.phone);
        try {
          const userId = user._id || user.id;
          if (userId) {
            const response = await UserAPI.getUserById(userId);
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

  const comparePasswords = async (
    currentPassword: string,
    existingPassword: string
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Bcrypt.compare(currentPassword, existingPassword, function (err, res) {
        if (err) reject(err);
        else resolve(res);
      });
    });
  };

  // Handle current password blur validation
  const handleCurrentPasswordBlur = async () => {
    if (!currPassword || !existingPassword) {
      return;
    }
    try {
      const isMatch = await comparePasswords(currPassword, existingPassword);
      if (!isMatch) {
        setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
      } else {
        setCurrentPasswordError("");
      }
    } catch (error) {
      console.error("Error comparing passwords:", error);
      setCurrentPasswordError("Failed to verify current password. Please try again.");
    }
  };

  // Handle new password blur validation
  const handleNewPasswordBlur = () => {
    if (submitAttempted || newPassword.trim()) {
      if (!newPassword.trim()) {
        setNewPasswordError("New password is required");
      } else {
        const passwordValidationError = isValidPassword(newPassword);
        if (passwordValidationError) {
          setNewPasswordError(passwordValidationError);
        } else {
          setNewPasswordError("");
          // Re-validate confirm password match if it has a value
          if (confirmPassword.trim()) {
            validateConfirmPasswordMatch(newPassword, confirmPassword);
          }
        }
      }
    }
  };

  // Handle confirm password blur validation — always validate mismatch on blur
  const handleConfirmPasswordBlur = () => {
    if (!confirmPassword.trim()) {
      // Only show "required" error on blur if submit was already attempted
      if (submitAttempted) {
        setConfirmPasswordError("Confirm password is required");
      }
    } else {
      // Always validate mismatch on blur regardless of submitAttempted
      validateConfirmPasswordMatch(newPassword, confirmPassword);
    }
  };

  // Helper function to validate confirm password match
  const validateConfirmPasswordMatch = (newPwd: string, confirmPwd: string) => {
    if (!confirmPwd.trim()) {
      setConfirmPasswordError("Confirm password is required");
    } else if (newPwd !== confirmPwd) {
      setConfirmPasswordError("New and Confirm passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleChangePassword = async () => {
    setSubmitAttempted(true);
    setIsLoading(true);

    try {
      let hasErrors = false;

      // Validate current password
      if (!currPassword.trim()) {
        setCurrentPasswordError("Current password is required");
        hasErrors = true;
      } else if (currentPasswordError) {
        hasErrors = true;
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

      if (hasErrors) {
        setIsLoading(false);
        if (!isWeb) {
          if (currentPasswordError) {
            showErrorAlert({ title: "Validation Error", message: currentPasswordError });
          } else if (!currPassword.trim()) {
            showErrorAlert({ title: "Validation Error", message: "Current password is required" });
          } else if (newPasswordError) {
            showErrorAlert({ title: "Validation Error", message: newPasswordError });
          } else if (!newPassword.trim()) {
            showErrorAlert({ title: "Validation Error", message: "New password is required" });
          } else if (confirmPasswordError) {
            showErrorAlert({ title: "Validation Error", message: confirmPasswordError });
          } else if (!confirmPassword.trim()) {
            showErrorAlert({ title: "Validation Error", message: "Confirm password is required" });
          }
        }
        return;
      }

      // Validate current password with bcrypt before API call
      if (existingPassword) {
        try {
          const isCurrentPasswordValid = await comparePasswords(currPassword, existingPassword);
          if (!isCurrentPasswordValid) {
            setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
            setIsLoading(false);
            if (!isWeb) {
              showErrorAlert({ title: "Error", message: INCORRECT_CURRENT_PASSWORD });
            }
            return;
          }
        } catch (error) {
          console.error("Error validating current password:", error);
          const errorMsg = "Failed to verify current password. Please try again.";
          setCurrentPasswordError(errorMsg);
          setIsLoading(false);
          if (!isWeb) {
            showErrorAlert({ title: "Error", message: errorMsg });
          }
          return;
        }
      }

      // Call API to change password
      const response = await UserAPI.changePassword({
        newPassword,
        currentPassword: currPassword,
      });

      setIsLoading(false);

      if (response?.data?.message === "Password successfully changed" || response?.status === 200) {
        showErrorAlert({ title: "Success", message: PASSWORD_CHANGED });
        redirectToPage(containers.signInScreen);
      } else {
        showErrorAlert({ title: "Error", message: PASSWORD_CHANGE_FAILED });
        if (!isWeb) {
          redirectToPage(containers.userProfileScreen);
        }
      }
    } catch (err: any) {
      console.error("API call error:", err);
      setIsLoading(false);

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to change password";

      if (
        errorMessage.toLowerCase().includes("current password") ||
        errorMessage.toLowerCase().includes("incorrect password")
      ) {
        setCurrentPasswordError(INCORRECT_CURRENT_PASSWORD);
      }

      showErrorAlert({ title: "Error", message: errorMessage });
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
              webStyles.contentWidth,
              isMobileWeb && webStyles.mobileWebContentWidth,
            ]}
          >
            {/* Current Password */}
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
                  setValue={(value) => {
                    setCurrPassword(value);
                    // Clear "required" error when user starts typing
                    if (currentPasswordError === "Current password is required") {
                      setCurrentPasswordError("");
                    }
                  }}
                  onblur={handleCurrentPasswordBlur}
                />
                {currentPasswordError ? (
                  <Text style={[globalStyles.errorText, isWeb && { marginTop: -8, marginBottom: 0 }]}>
                    {currentPasswordError}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* New Password */}
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

                    // Validate new password format in real-time after first submit attempt
                    if (submitAttempted) {
                      if (value.trim()) {
                        const passwordValidationError = isValidPassword(value);
                        setNewPasswordError(passwordValidationError || "");
                      } else {
                        setNewPasswordError("");
                      }
                    }

                    // Always re-validate confirm password match in real-time
                    // if the user has already typed something in confirm field
                    if (confirmPassword.trim()) {
                      if (value !== confirmPassword) {
                        setConfirmPasswordError("New and Confirm passwords do not match");
                      } else {
                        setConfirmPasswordError("");
                      }
                    }
                  }}
                  onblur={handleNewPasswordBlur}
                />
                {newPasswordError ? (
                  <Text style={[globalStyles.errorText, isWeb && { marginTop: -8, marginBottom: 0 }]}>
                    {newPasswordError}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Confirm New Password */}
            <View style={globalStyles.profileInputContainer}>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.userInputLabel}>Confirm New Password</Text>
                <CustomTextInput
                  secureTextEntry={true}
                  containerStyle={globalStyles.userInputContainer}
                  TextStyle={globalStyles.input}
                  placeholder="Re-enter your new Password"
                  value={confirmPassword}
                  onPress={() => {}}
                  setValue={(value) => {
                    setConfirmPassword(value);

                    // Always show/clear mismatch error in real-time while retyping
                    // Don't gate on submitAttempted — user expects immediate feedback
                    if (!value.trim()) {
                      // Don't show "required" while actively clearing the field, just remove error
                      setConfirmPasswordError("");
                    } else if (newPassword && value !== newPassword) {
                      setConfirmPasswordError("New and Confirm passwords do not match");
                    } else {
                      setConfirmPasswordError("");
                    }
                  }}
                  onblur={handleConfirmPasswordBlur}
                />
                {confirmPasswordError ? (
                  <Text style={[globalStyles.errorText, isWeb && { marginTop: -8, marginBottom: 0 }]}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Buttons */}
            {isWeb ? (
              <View
                style={[
                  webStyles.inlineButtonRow,
                  isMobileWeb && webStyles.mobileWebInlineButtonRow,
                ]}
              >
                <Button
                  primary={false}
                  title="Cancel"
                  onPress={() => redirectToPage(containers.userProfileScreen)}
                  style={[webStyles.cancelButton, isMobileWeb && webStyles.mobileWebButton]}
                  textStyle={webStyles.cancelButtonText}
                  disabled={isLoading}
                />
                <Button
                  title={isLoading ? "Saving..." : "Save Password"}
                  onPress={handleChangePassword}
                  style={[webStyles.saveButton, isMobileWeb && webStyles.mobileWebButton]}
                  textStyle={webStyles.saveButtonText}
                  disabled={isLoading}
                />
              </View>
            ) : (
              <Button
                onPress={handleChangePassword}
                title={isLoading ? "Saving..." : "Save Password"}
                disabled={isLoading}
              />
            )}
          </View>
        </ScrollView>
      </KeyBoardWrapper>

      <ConfirmationModal
        isModalVisible={errorModalState.isVisible}
        onClose={() => setErrorModalState((prev) => ({ ...prev, isVisible: false }))}
        title={errorModalState.title}
        text={errorModalState.message}
        submitText={errorModalState.buttonLabel}
        handleSubmit={() => setErrorModalState((prev) => ({ ...prev, isVisible: false }))}
      />
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
  mobileWebContentWidth: {
    width: "94%",
    alignSelf: "center",
  },
  mobileWebInlineButtonRow: {
    flexDirection: "column",
    gap: 12,
  },
  mobileWebButton: {
    width: "100%",
    minWidth: undefined,
  },
});