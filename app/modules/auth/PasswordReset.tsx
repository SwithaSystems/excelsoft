import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
} from "react-native";
import styles from "./PasswordResetStyles";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { useLocalSearchParams } from "expo-router";
import { UserAPI } from "@/services/userService";
import axios from "axios";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { CHANGE_PASSWORD_SCREEN_TITLE } from "../../../constants/stringLiterals";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import { isValidPassword } from "../../../utilities/validations";

const passwordResetScreen = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const isWeb = Platform.OS === "web";
const { phoneNumber, email } = useLocalSearchParams<{ phoneNumber: string; email: string }>();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 const [errors, setErrors] = useState<{
  password?: string;
  confirmPassword?: string;
}>({});

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const validatePassword = (value: string): string => {
    if (!value.trim()) return "Password is required.";
    const validationError = isValidPassword(value);
    if (validationError) return validationError;
    return "";
  };

  const validateConfirmPassword = (confirmValue: string, passwordValue: string): string => {
    if (!confirmValue.trim()) return "Please confirm your password.";
    if (confirmValue !== passwordValue) return "Passwords do not match.";
    return "";
  };

  // ─── Blur Handlers ──────────────────────────────────────────────────────────

  const handlePasswordBlur = () => {
    // Always validate password format on blur
    const error = validatePassword(password);
    setErrors((prev:any) => ({ ...prev, password: error || undefined }));

    // If confirm already has a value, re-validate match in case new password changed
    if (confirmPassword.trim()) {
      const confirmError = validateConfirmPassword(confirmPassword, password);
      setErrors((prev:any) => ({ ...prev, confirmPassword: confirmError || undefined }));
    }
  };

  const handleConfirmPasswordBlur = () => {
    // Only show mismatch/required on blur if field has value, or submit was attempted
    if (confirmPassword.trim()) {
      const error = validateConfirmPassword(confirmPassword, password);
      setErrors((prev:any) => ({ ...prev, confirmPassword: error || undefined }));
    } else if (submitAttempted) {
      setErrors((prev:any) => ({ ...prev, confirmPassword: "Please confirm your password." }));
    }
  };

  // ─── Full Validation (on submit) ────────────────────────────────────────────

  const validateFields = (): boolean => {
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    const newErrors: Partial<{ password?: string; confirmPassword?: string }> = {};
    if (passwordError) newErrors.password = passwordError;
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────

 const handlePress = async () => {
  setSubmitAttempted(true);
  if (!validateFields()) return;

  const isPhoneReset = typeof phoneNumber === "string" && phoneNumber.trim();
  const isEmailReset = typeof email === "string" && email.trim();

  if (!isPhoneReset && !isEmailReset) {
    showAlert("Error", "Missing identifier. Please restart the reset flow.");
    return;
  }

  setIsLoading(true);
  try {
    const response = await UserAPI.resetPassword({
      newPassword: password,
      ...(isPhoneReset ? { phoneNumber } : { email }),
    });

    showAlert(
      "Success",
      response.data.message || "Password reset successfully",
      [{ text: "OK", onPress: () => redirectToPage(containers.signInScreen) }],
      { cancelable: false }
    );
  } catch (error: any) {
    showAlert(
      "Error",
      error?.response?.data?.message || "Failed to reset password. Please try again."
    );
  } finally {
    setIsLoading(false);
  }
};
  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable={false}
      headerComponent={
        <Header
          headerText={CHANGE_PASSWORD_SCREEN_TITLE}
          headerStyle={isWeb ? styles.passwordResetHeaderStyle : undefined}
          headerTitleStyle={isWeb ? styles.passwordResetHeaderTitle : undefined}
        />
      }
    >
      <KeyBoardWrapper>
        <View style={[styles.sectionContainer, isWeb && styles.sectionContainerWeb]}>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[globalStyles.input, errors.password ? globalStyles.errorInput : undefined]}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={(value) => {
              setPassword(value);

              // Clear/update password error in real-time after first submit attempt
              if (submitAttempted) {
                const error = validatePassword(value);
                setErrors((prev:any) => ({ ...prev, password: error || undefined }));
              }

              // Always re-validate confirm match in real-time if confirm has a value
              if (confirmPassword.trim()) {
                const confirmError = validateConfirmPassword(confirmPassword, value);
                setErrors((prev:any) => ({
                  ...prev,
                  confirmPassword: confirmError || undefined,
                }));
              }
            }}
            onBlur={handlePasswordBlur}
          />
          {errors.password ? (
            <Text style={[globalStyles.errorText, isWeb && styles.errorTextDesktop]}>
              {errors.password}
            </Text>
          ) : null}

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.confirmPassword ? globalStyles.errorInput : undefined,
            ]}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);

              // Always validate mismatch in real-time — no submitAttempted gate
              if (!value.trim()) {
                // Don't show "required" while actively clearing — just remove error
                setErrors((prev:any) => ({ ...prev, confirmPassword: undefined }));
              } else {
                const error = validateConfirmPassword(value, password);
                setErrors((prev:any) => ({
                  ...prev,
                  confirmPassword: error || undefined,
                }));
              }
            }}
            onBlur={handleConfirmPasswordBlur}
          />
          {errors.confirmPassword ? (
            <Text style={[globalStyles.errorText, isWeb && styles.errorTextDesktop]}>
              {errors.confirmPassword}
            </Text>
          ) : null}

          <Button
            title={isLoading ? "Resetting..." : "Reset Password"}
            style={styles.signInButton}
            onPress={handlePress}
            disabled={isLoading}
          />
        </View>
      </KeyBoardWrapper>
      {confirmationModal}
    </PageLayout>
  );
};

export default passwordResetScreen;