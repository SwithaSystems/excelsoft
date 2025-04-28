import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import styles from "./passwordResetScreenStyles";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { useLocalSearchParams } from "expo-router";
import { UserAPI } from "@/services/userService";
import axios from "axios";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const passwordResetScreen = () => {
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
      const response = await UserAPI.changePassword({ newPassword: password });
      Alert.alert("Message", response.data.message, [
        {
          text: "OK",
          onPress: () => redirectToPage(containers.signInScreen),
        },
      ]);
    }
  };
  return (
    <View style={styles.container}>
      <Header headerText={" Reset Your Password"} />
      <View style={styles.sectionContainer}>
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
          <Text style={globalStyles.errorText}>{errors.password}</Text>
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
        {errors.password && (
          <Text style={globalStyles.errorText}>{errors.confirmPassword}</Text>
        )}
        <Button
          title="Reset Password"
          style={styles.signInButton}
          onPress={handlePress}
        />
      </View>
    </View>
  );
};

export default passwordResetScreen;
