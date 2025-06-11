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
import styles from "./signUpScreenStyles";
import { UserAPI } from "@/services/userService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { TwilioApi } from "@/services/twilioService";
import { authService } from "@/services/auth.service";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import colors from "../config/colors";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";

const signUpScreen = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");

  const [errors, setErrors] = useState<
    Partial<{
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    }>
  >({});

  const toggleMode = (selected: any) => {
    setMode(selected);
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
  };

  const checkIfUserExists = async () => {
    const trimmedPhone = phone.trim();
    if (!trimmedPhone || !callingCode) return;
    if (trimmedPhone) {
      const normalizedPhone = trimmedPhone.startsWith("0")
        ? trimmedPhone.slice(1)
        : trimmedPhone;
      const formattedPhone = `+${callingCode}${normalizedPhone}`;
      try {
        const response = await UserAPI.getUserByPhonenumber(formattedPhone);
        if (response?.data) {
          Alert.alert(
            "Already Registered",
            "This phone number is already in use."
          );
          setPhoneNumber("");
        }
      } catch (error) {
        console.error("Error checking phone number", error);
      }
    }
  };

  const validateFields = () => {
    const newErrors = {} as {
      phone?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    const trimmedPhone = phone.trim();

    if (!email.trim() && !trimmedPhone) {
      newErrors.email = "Email or Phone number is required.";
    }

    // Normalize phone by removing leading 0
    const normalizedPhone = trimmedPhone.startsWith("0")
      ? trimmedPhone.slice(1)
      : trimmedPhone;

    if (trimmedPhone) {
      if (!/^\d{10}$/.test(normalizedPhone)) {
        newErrors.phone = "Enter a valid 10-digit phone number.";
      }
    }

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

  const handleSignUp = async () => {
    if (validateFields()) {
      let normalizedPhone = phone.trim();
      if (normalizedPhone.startsWith("0")) {
        normalizedPhone = normalizedPhone.slice(1);
      }

      // Add country code
      const formattedPhone = `+${callingCode}${normalizedPhone}`;

      const userData = { phone: formattedPhone, email, password };

      try {
        // const response = await authService.register(userData);

        const responseFromTwilio = await TwilioApi.sendOtp({
          phone: userData.phone,
        });
        console.log("responseFromTwilio", responseFromTwilio);
        if (
          responseFromTwilio?.status === 201 &&
          responseFromTwilio.data?.status === "pending"
        ) {
          // OTP sent successfully, proceed to verification screen
          redirectToPage(containers.verifcationScreenScreen, {
            // phoneNumber: userData.phone,
            userData: JSON.stringify(userData),
            from: "signup",
          });
        } else {
          Alert.alert("Error", "Failed to send OTP. Please try again.");
        }
        // if (response && response.access_token) {
        //   console.log("Phone Number for OTP:", userData.phone);
        //   await TwilioApi.sendOtp({ phone: userData.phone });

        //   redirectToPage(containers.verifcationScreenScreen, {
        //     phoneNumber: userphone,
        //     from: "signup",
        //   });
        // } else {
        //   Alert.alert("Error", response?.message || "Sign-up failed.");
        // }
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
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <KeyBoardWrapper>
      <View style={styles.container}>
        <Header headerText={"Sign Up"} />

        <View style={styles.sectionContainer}>
          <View style={styles.toggleContainer}>
            {/* <Text style={styles.label}>Email Address/Phone Number</Text> */}
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "phone" && {backgroundColor: colors.primary},
              ]}
              onPress={() => toggleMode("phone")}
            >
              <Text
                style={
                  mode === "phone" ? styles.activeText : styles.inactiveText
                }
              >
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "email" && styles.activeToggle,
              ]}
              onPress={() => toggleMode("email")}
            >
              <Text
                style={
                  mode === "email" ? styles.activeText : styles.inactiveText
                }
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>
          {mode === "email" ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text); // Fallback for other text entries
                  setPhoneNumber("");
                }}
              />
              {errors.email && (
                <Text style={globalStyles.errorText}>{errors.email}</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.label}> Phone</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryPickerContainer}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withFlag={false}
                    withCallingCode
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      setCallingCode(country.callingCode[0] || "44");
                    }}
                    containerButtonStyle={styles.countryPickerButton}
                  />
                  <Text style={styles.callingCode}>+{callingCode}</Text>
                </View>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setEmail("");
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  onBlur={checkIfUserExists}
                  maxLength={11}
                  keyboardType="phone-pad"
                />

                {errors.phone && (
                  <Text style={globalStyles.errorText}>{errors.phone}</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.passwordContainer}>
          <Text style={styles.label}> Password</Text>
          <TextInput
            style={[
              globalStyles.input,
              errors.password && globalStyles.errorInput,
            ]}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onFocus={checkIfUserExists}
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
          </View>

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
      </KeyBoardWrapper>
    </SafeAreaView>
  );
};

export default signUpScreen;
