import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../assets/styles/globalStyles";
import styles from "./signInStyles";
import { UserAPI } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const signIn = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<{ email?: string; phone?: string; password?: string }>
  >({});

  const validateFields = () => {
    const newErrors = {} as {
      phone?: string;
      email?: string;
      password?: string;
    };
    if (!email && !phone) {
      newErrors.email = "Email or Phone number is required.";
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    } else if (phone && !/^(\+91\d{10})$/.test(phone)) {
      console.log(phone);
      newErrors.phone = "Enter a valid 10-digit phone number.";
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
      const data = {
        ...(email ? { email } : { phone }),
        password,
      };

      const response = await UserAPI.userSignIn(data);
      console.log("response", response);
      if (response && response.data.message === "Sign-in successful.") {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        const storedData = await AsyncStorage.getItem("user");
        console.log(
          "Stored User Data:",
          storedData ? JSON.parse(storedData) : "No data found"
        );
        Alert.alert("Success", "You have successfully signed in.");
        redirectToPage(containers.homeScreen);
      } else {
        Alert.alert("Error", response?.message || "Sign-in failed.");
      }
    } else {
      Alert.alert(
        "Validation Error",
        "Please fix the errors before submitting."
      );
    }
  };

  const handleBlur = (fieldName: string) => {
    validateFields();
  };
  return (
    <View style={styles.container}>
      <Header headerText={"Sign In"} />

      <View style={styles.sectionContainer}>
        <Text style={styles.label}>Email Address/Phone Number</Text>
        <TextInput
          style={[globalStyles.input, errors.email && globalStyles.errorInput]}
          placeholder="Enter your email or phone number"
          value={email || phone}
          onChangeText={(text) => {
            if (/^(\+91\d{10})$/.test(text)) {
              setPhoneNumber(text);
              setEmail(""); // Clear email if phone is detected
            } else {
              setEmail(text);
              setPhoneNumber(""); // Clear phone if email is detected
            }
          }}
          onBlur={() => handleBlur("email")}
        />
        {errors.email && (
          <Text style={globalStyles.errorText}>{errors.email}</Text>
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
          onBlur={() => handleBlur("password")}
        />
        {errors.password && (
          <Text style={globalStyles.errorText}>{errors.password}</Text>
        )}

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Forgot Password?", "Feature not implemented yet.")
          }
        >
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          style={styles.signInButton}
          onPress={handleSignIn}
        />

        <Text style={styles.signUpText}>
          Don’t have an account? <Text style={styles.signUpLink}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

export default signIn;
