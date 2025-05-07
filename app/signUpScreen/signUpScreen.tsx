import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../assets/styles/globalStyles";
import styles from "./signUpScreenStyles";
import { UserAPI } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { TwilioApi } from "@/services/twilioService";
import { authService } from "@/services/auth.service";
import { useLocalSearchParams } from "expo-router";

const signUpScreen = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<
    Partial<{
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    }>
  >({});

  const validateFields = () => {
    const newErrors = {} as {
      phone?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (!email.trim() && !phone.trim()) {
      newErrors.email = "Email or Phone number is required.";
    }

    // if (phone && !/^(\+91\d{10})$/.test(phone.trim())) {
    //   newErrors.phone = "Enter a valid phone number with country code.";
    // }

    if (phone && !/^(\+91\d{10}|\d{10})$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit number or with +91.";
    }
    // if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    //   newErrors.email = "Enter a valid email address.";
    // }

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

  // const handleSignUp = async () => {
  //   if (validateFields()) {
  //     const data = { phone, email, password };
  //     console.log("Phone Number:", data.phone);

  //     const response = await UserAPI.userSignUp(data);

  //     if (
  //       response &&
  //       response.data.message === "User registered successfully."
  //     ) {
  //       await AsyncStorage.setItem(
  //         "user",
  //         JSON.stringify(response?.data?.user)
  //       );

  //       console.log("Phone Number for OTP:", data?.phone);

  //       if (data?.phone.trim()) {
  //         // 🔥 Added .trim() to avoid accidental empty spaces
  //         console.log("Sending OTP to:", data?.phone);
  //         await TwilioApi.sendOtp({ phone: data?.phone });
  //       } else {
  //         console.error("Phone number is missing.");
  //       }

  //       redirectToPage(containers.verifcationScreenScreen);
  //     } else {
  //       Alert.alert("Error", response?.data?.message || "Sign-up failed.");
  //     }
  //   } else {
  //     Alert.alert(
  //       "Validation Error",
  //       "Please fix the errors before submitting."
  //     );
  //   }
  // };

  const handleSignUp = async () => {
    if (validateFields()) {
      let formattedPhone = phone.trim();

      // If phone is 10 digits, prepend +91
      if (/^\d{10}$/.test(formattedPhone)) {
        formattedPhone = `+91${formattedPhone}`;
      }
      const userData = { phone: formattedPhone, email, password };
      const userphone = userData.phone;
      try {
        const response = await authService.register(userData);

        if (response && response.access_token) {
          console.log("Phone Number for OTP:", userData.phone);

          // if (userData.phone.trim()) {
          console.log("Sending OTP to:", userData.phone);
          await TwilioApi.sendOtp({ phone: userData.phone });
          // } else {
          // console.error("Phone number is missing.");
          // }

          redirectToPage(containers.verifcationScreenScreen, {
            phoneNumber: userphone,
            from: "signup",
          });
        } else {
          Alert.alert("Error", response?.message || "Sign-up failed.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        Alert.alert("Error", "Something went wrong during registration.");
      }
    } else {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Header headerText={"Sign Up"} />

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Email Address/Phone Number</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your email or phone number"
          value={email || phone}
          onChangeText={(text) => {
            if (text.startsWith("+") && /^\+91\d{10}$/.test(text)) {
              setPhoneNumber(text);
              setEmail(""); // Clear email if phone is detected
            } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
              setEmail(text);
              setPhoneNumber(""); // Clear phone if email is detected
            } else {
              setEmail(text); // Fallback for other text entries
              setPhoneNumber("");
            }
          }}
        />
        {/* {errors.email && (
          <Text style={globalStyles.errorText}>{errors.email}</Text>
        )} */}

        <Text style={styles.label}> Password</Text>
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
        <Text style={styles.label}> Confirm Password</Text>
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
          title="Sign Up"
          style={styles.signInButton}
          onPress={handleSignUp}
        />

        <Text style={styles.signUpText}>
          Already have an account?{" "}
          <Text
            style={styles.signUpLink}
            onPress={() => {
              redirectToPage(containers.signInScreen);
            }}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default signUpScreen;
