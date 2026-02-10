import Header from "../../components/Header";
import Button from "@/app/components/commonComponents/Button";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import styles from "./SignInStyles";
import { useAuth } from "@/context/AuthContext";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import {
  FIX_VALIDATION_ERRORS,
  INVALID_CREDENTIALS,
  PHONE_NUMBER_VALIDATION,
} from "../../../constants/customErrorMessages";
import { globalStyles } from "@/assets/styles/globalStyles";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import {
  isValidEmail,
  isValidPhoneNumber,
  isValidPassword
} from "../../../utilities/validations";
import colors from "../../../constants/colors";

const signIn = () => {
  const isWeb = Platform.OS === "web";
  const [inputValue, setInputValue] = useState(""); // Combined input field value
  const [isEmail, setIsEmail] = useState(true); // Track if input is email or phone
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("phone");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [phone, setPhoneNumber] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [errors, setErrors] = useState<
    Partial<{ input?: string; password?: string }>
  >({});
  const { login } = useAuth();

  const toggleMode = (selected: any) => {
    setMode(selected);
    setEmail("");
    setPhoneNumber("");
    setPassword("");
  };

  const validateFields = () => {
    const newErrors: {
      input?: string;
      password?: string;
    } = {};

    if (mode === "email") {
      if (!email.trim()) {
        newErrors.input = "Email is required.";
      } else if (!isValidEmail(email)) {
        newErrors.input = "Enter a valid email address.";
      }
    } else if (mode === "phone") {
      const phoneError = isValidPhoneNumber(phone);
      // Remove leading 0 if present
      if (phoneError) {
        newErrors.input = phoneError;
      }
    }
    const passwordError = isValidPassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateFields()) {
      showErrorAlert({
        title: "Let's fix that",
        message: FIX_VALIDATION_ERRORS,
      });

      return;
    }

    try {
      let loginId = "";

      if (mode === "phone") {
        let normalizedPhone = phone.trim();
        
        // Remove leading zero if present
        if (normalizedPhone.startsWith("0")) {
          normalizedPhone = normalizedPhone.slice(1);
        }

        // After removing leading zero, should be exactly 10 digits
        if (normalizedPhone.length !== 10) {
          showErrorAlert({
            title: "Phone Number Error",
            message: PHONE_NUMBER_VALIDATION,
          });
          return;
        }

        loginId = `+${callingCode}${normalizedPhone}`;
      } else {
        loginId = email.trim().toLowerCase();
      }

      await login(loginId, password);
      redirectToPage(containers.homeScreen);
    } catch (error) {
      showErrorAlert({
        title: "Oops!",
        message: INVALID_CREDENTIALS,
      });
    }
  };

  const handleBlur = () => {
    validateFields();
  };

  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable={false}
      headerComponent={
        <Header 
          headerText={"Sign In"} 
          needResetNavigation={false}
          hideBackArrow={isWeb}
          headerStyle={isWeb ? styles.signInHeaderStyle : undefined}
          headerTitleStyle={isWeb ? styles.signInHeaderTitle : undefined}
        />
      }
    >
      <KeyBoardWrapper>
        <View style={[
          styles.sectionContainer,
          isWeb && styles.sectionContainerWeb
        ]}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "phone" && styles.activeToggle,
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
              <View style={styles.emailContainer}>
                <Text style={[
                  styles.label,
                  isWeb && styles.labelDesktop
                ]}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    isWeb && styles.inputDesktop
                  ]}
                  placeholder="Enter your email address"
                  placeholderTextColor={isWeb ? colors.slateGrey : undefined}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setPhoneNumber("");
                  }}
                />
                {errors.input && (
                  <Text style={[
                    globalStyles.errorText,
                    isWeb && styles.errorTextDesktop
                  ]}>{errors.input}</Text>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={[
                styles.label,
                isWeb && styles.labelDesktop
              ]}> Phone</Text>
              <View style={[
                styles.phoneInputContainer,
                errors.input && styles.phoneInputContainerError,
                isPhoneFocused && styles.phoneInputContainerFocused,
                isWeb && styles.phoneInputContainerDesktop
              ]}>
                <View style={[
                  styles.countryPickerContainer,
                  isWeb && styles.countryPickerContainerDesktop
                ]}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withFlag={false}
                    withFlagButton={false}
                    withCallingCode
                    withCallingCodeButton={true}
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      setCallingCode(country.callingCode[0] || "44");
                    }}
                    containerButtonStyle={[
                      styles.countryPickerButton,
                      isWeb && styles.countryPickerButtonDesktop
                    ]}
                  />
                  {/* {!isWeb && (
                    <Text style={styles.callingCode}>+{callingCode}</Text>
                  )} */}
                </View>

                <TextInput
                  style={[
                    styles.phoneInput,
                    isWeb && styles.phoneInputDesktop
                  ]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={isWeb ? colors.slateGrey : undefined}
                  value={phone}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setEmail("");
                  }}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => setIsPhoneFocused(false)}
                  maxLength={11}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.input && (
                <Text style={[
                  globalStyles.errorText,
                  isWeb && styles.errorTextDesktop
                ]}>{errors.input}</Text>
              )}
            </>
          )}

          <View style={styles.passwordContainer}>
            <Text style={[
              styles.label,
              isWeb && styles.labelDesktop
            ]}>Enter your Password</Text>
            <TextInput
              style={[
                globalStyles.input,
                styles.passwordInput,
                errors.password && globalStyles.errorInput,
                isWeb && { fontSize: 16 },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={isWeb ? colors.slateGrey : undefined}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onBlur={handleBlur}
            />
            {errors.password && (
              <Text style={[
                globalStyles.errorText,
                isWeb && styles.errorTextDesktop
              ]}>{errors.password}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => redirectToPage(containers.forgotPasswordScreen)}
          >
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            style={styles.signInButton}
            onPress={handleSignIn}
          />

          <TouchableOpacity
            onPress={() => redirectToPage(containers.signUpScreen)}
          >
            <Text style={styles.signUpText}>
              Don't have an account?{" "}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default signIn;