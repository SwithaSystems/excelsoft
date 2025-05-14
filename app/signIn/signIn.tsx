import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { globalStyles } from "../../assets/styles/globalStyles";
import styles from "./signInStyles";
import { useAuth } from "@/context/AuthContext";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";

const signIn = () => {
  const [inputValue, setInputValue] = useState(""); // Combined input field value
  const [isEmail, setIsEmail] = useState(true); // Track if input is email or phone
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<{ input?: string; password?: string }>
  >({});
  const { login } = useAuth();

  const validateFields = () => {
    const newErrors = {} as {
      input?: string;
      password?: string;
    };

    // Check if input is empty
    if (!inputValue) {
      newErrors.input = "Email or Phone number is required.";
    } else {
      // Check if input is a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if input is a valid 10-digit phone number
      const phoneRegex = /^\d{10}$/;

      // Determine if input is email or phone and validate accordingly
      if (emailRegex.test(inputValue)) {
        setIsEmail(true);
      } else if (phoneRegex.test(inputValue)) {
        setIsEmail(false);
      } else {
        newErrors.input =
          "Enter a valid email address or 10-digit phone number.";
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (validateFields()) {
      try {
        // Format phone number with +91 prefix if it's a phone number
        const loginId = isEmail ? inputValue : `+91${inputValue}`;

        await login(loginId, password);
        Alert.alert("Success", "You have successfully signed in.");
        redirectToPage(containers.homeScreen);
      } catch (error) {
        Alert.alert("Error", "Invalid credentials. Please try again.");
      }
    } else {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting."
      );
    }
  };

  const handleBlur = () => {
    validateFields();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.container}>
        <Header headerText={"Sign In"} needResetNavigation={true} />

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Email Address/Phone Number</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.input && globalStyles.errorInput,
            ]}
            placeholder="Enter your email or 10-digit phone number"
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              if (/^\d+$/.test(text)) {
                setIsEmail(false);
              } else {
                setIsEmail(true);
              }
            }}
            onBlur={handleBlur}
            keyboardType={isEmail ? "email-address" : "phone-pad"}
          />
          {errors.input && (
            <Text style={globalStyles.errorText}>{errors.input}</Text>
          )}

          <Text style={styles.label}>Enter your Password</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.password && globalStyles.errorInput,
            ]}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onBlur={handleBlur}
          />
          {errors.password && (
            <Text style={globalStyles.errorText}>{errors.password}</Text>
          )}

          <TouchableOpacity
            onPress={() =>
              redirectToPage(containers.forgotPasswordScreenScreen)
            }
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            style={styles.signInButton}
            onPress={handleSignIn}
          />

          <TouchableOpacity
            onPress={() => redirectToPage(containers.signUpScreenScreen)}
          >
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default signIn;
