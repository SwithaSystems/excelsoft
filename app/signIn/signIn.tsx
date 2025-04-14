import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../assets/styles/globalStyles";
import styles from "./signInStyles";
import { useAuth } from "@/context/AuthContext";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const signIn = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<{ email?: string; phone?: string; password?: string }>
  >({});
  const { login } = useAuth();

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
      try {
        // Use phone for JWT authentication
        await login(phone, password);
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
              setEmail("");
            } else {
              setEmail(text);
              setPhoneNumber("");
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
          <Text
            style={styles.forgotPassword}
            onPress={() =>
              redirectToPage(containers.forgotPasswordScreenScreen)
            }
          >
            Forgot Password?
          </Text>
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
  );
};

export default signIn;
