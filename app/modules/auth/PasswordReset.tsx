import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
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

const passwordResetScreen = () => {
  const isWeb = Platform.OS === "web";
  const { phoneNumber } = useLocalSearchParams();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<{
      password?: string;
      confirmPassword?: string;
    }>
  >({});
  const validateFields = () => {
    const newErrors = {} as {
      password?: string;
      confirmPassword?: string;
    };

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePress = async () => {
    if (validateFields()) {
      if (typeof phoneNumber === "string") {
        const response = await UserAPI.resetPassword({
          newPassword: password,
          phoneNumber: phoneNumber,
        });
        Alert.alert("Message", response.data.message, [
          {
            text: "OK",
            onPress: () => redirectToPage(containers.signInScreen),
          },
        ]);
      } else {
        console.error("phoneNumber is not a string");
      }
    }
  };
  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
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
      {" "}
      <KeyBoardWrapper>
        {/* <View style={styles.container}> */}
        {/* <Header headerText={" Reset Your Password"} /> */}
        <View style={[
          styles.sectionContainer,
          isWeb && styles.sectionContainerWeb
        ]}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.password && globalStyles.errorInput,
            ]}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errors.password && (
            <Text style={[
              globalStyles.errorText,
              isWeb && styles.errorTextDesktop
            ]}>{errors.password}</Text>
          )}
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.confirmPassword && globalStyles.errorInput,
            ]}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {errors.confirmPassword && (
            <Text style={[
              globalStyles.errorText,
              isWeb && styles.errorTextDesktop
            ]}>{errors.confirmPassword}</Text>
          )}
          <Button
            title="Reset Password"
            style={styles.signInButton}
            onPress={handlePress}
          />
        </View>
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default passwordResetScreen;
