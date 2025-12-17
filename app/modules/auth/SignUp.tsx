import { SIGN_UP_SCREEN_TITLE } from "../../../constants/stringLiterals";
import Header from "../../components/Header";
import Button from "@/app/components/commonComponents/Button";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { UserAPI } from "@/services/userService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { TwilioApi } from "@/services/twilioService";
import { authService } from "@/services/auth.service";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import colors from "../../../constants/colors";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import {
  FIX_VALIDATION_ERRORS,
  REGISTRATION_FAILED,
  OTP_SEND_FAILED,
  PHONE_ALREADY_REGISTERED,
  EMAIL_ALREADY_REGISTERED,
  ACCOUNT_CREATION_FAILED,
} from "../../../constants/customErrorMessages";

import { showErrorAlert } from "../../../utilities/showErrorAlert";
import styles from "./SignUpStyles";
import { globalStyles } from "@/assets/styles/globalStyles";

import {
  isValidEmail,
  isValidPhoneNumber,
  isValidPassword,
} from "@/utilities/validations";

const signUpScreen = () => {
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);

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
    if (mode === "phone") {
      await checkIfPhoneExists();
    } else if (mode === "email") {
      await checkIfEmailExists();
    }
  };

  const checkIfPhoneExists = async () => {
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
          showErrorAlert({
            title: "Phone Number Already exists!",
            message: PHONE_ALREADY_REGISTERED,
          });
          setPhoneNumber("");
        }
      } catch (error) {
        console.error("Error checking phone number", error);
      }
    }
  };

  const checkIfEmailExists = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    try {
      const response = await UserAPI.getUserByEmail(trimmedEmail);
      if (response?.data) {
        showErrorAlert({
          title: "Email Already exists!",
          message: EMAIL_ALREADY_REGISTERED,
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Error checking email", error);
    }
  };

  const validateFields = () => {
    const newErrors = {} as {
      phone?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (mode === "email") {
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        newErrors.email = "Email is required.";
      } else if (!isValidEmail(trimmedEmail)) {
        newErrors.email = "Enter a valid email address.";
      }
    }
    if (mode === "phone") {
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) {
        newErrors.phone = "Phone number is required.";
      } else {
        let normalizedPhone = trimmedPhone;
        if (normalizedPhone.startsWith("0")) {
          normalizedPhone = normalizedPhone.slice(1);
        }
        const fullPhoneNumber = `+${callingCode}${normalizedPhone}`;
        // console.log("DEBUG: Validating", fullPhoneNumber);
        // console.log("DEBUG: Digits:", fullPhoneNumber.replace(/\D/g, "").length);
        const validationResult = isValidPhoneNumber(fullPhoneNumber);
        // console.log("DEBUG: Validation result:", validationResult);
        
        if (validationResult !== null) {
          newErrors.phone = validationResult;
        }
      }
    }

    const passwordError = isValidPassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // console.log("DEBUG: All validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validateFields()) {
    try {
      if (mode === "phone") {
        await handlePhoneSignUp();
      } else if (mode === "email") {
        await handleEmailSignUp();
      }
    } catch (error) {
      console.error("Registration error:", error);
      showErrorAlert({
        title: "Registration Failed",
        message: ACCOUNT_CREATION_FAILED,
      });
    }
    } else {
      showErrorAlert({
        title: "Validation Error",
        message: FIX_VALIDATION_ERRORS,
      });
    }
  };
  const handlePhoneSignUp = async () => {
    if (validateFields()) {
    let normalizedPhone = phone.trim();
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = normalizedPhone.slice(1);
    }

    // Add country code
    const formattedPhone = `+${callingCode}${normalizedPhone}`;

    const userData = { phone: formattedPhone, email, password };

    try {
      const responseFromTwilio = await TwilioApi.sendOtp({
        phone: userData.phone,
      });
      // console.log("responseFromTwilio", responseFromTwilio);
      if (
        responseFromTwilio?.status === 201 &&
        responseFromTwilio.data?.status === "pending"
      ) {
        // OTP sent successfully, proceed to verification screen
        redirectToPage(containers.verificationScreen, {
          // phoneNumber: userData.phone,
          userData: JSON.stringify(userData),
          from: "signup",
        });
      } else {
        showErrorAlert({
          title: "Failed to send OTP",
          message: OTP_SEND_FAILED,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      showErrorAlert({
        title: "Registration Failed",
        message: ACCOUNT_CREATION_FAILED,
      });
    }
    } else {
      showErrorAlert({
        title: "Validation Error",
        message: FIX_VALIDATION_ERRORS,
      });
    }
  };

  const handleEmailSignUp = async () => {
    const userData = { phone: "", email: email.trim(), password };

    try {
      // Send email verification using your auth service
      const response = await TwilioApi.sendOtp_Email({
        email: userData.email,
      });

      // console.log("Email verification response:", response);

      if (response?.status === 201 && response?.data?.success) {
        // Email verification sent successfully, proceed to verification screen
        redirectToPage(containers.verificationScreen, {
          userData: JSON.stringify(userData),
          from: "signup",
          verificationType: "email",
        });
      } else {
        showErrorAlert({
          title: "Failed to send verification email",
          message: response?.message || "Please try again later.",
        });
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      showErrorAlert({
        title: "Failed to send verification email",
        message: error?.message || "Please try again later.",
      });
    }
  };

  return (
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable={false}
      headerComponent={
        <Header 
          headerText={SIGN_UP_SCREEN_TITLE}
          hideBackArrow={isTabOrDesktop}
          headerStyle={isTabOrDesktop ? styles.signUpHeaderStyle : undefined}
          headerTitleStyle={isTabOrDesktop ? styles.signUpHeaderTitle : undefined}
        />
      }
    >
      <KeyBoardWrapper>
        <View style={[
          styles.sectionContainer,
          isTabOrDesktop && styles.sectionContainerWeb
        ]}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "phone" && { backgroundColor: colors.primary },
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
              <Text style={[styles.label, { marginLeft: 8 }]}>Email</Text>

              <TextInput
                style={[
                  styles.input,
                  isTabOrDesktop && styles.inputDesktop
                ]}
                placeholder="Enter your email address"
                placeholderTextColor={isTabOrDesktop ? colors.slateGrey : undefined}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setPhoneNumber("");
                }}
              />
              {errors.email && (
                <Text style={[
                  globalStyles.errorText,
                  isTabOrDesktop && styles.errorTextDesktop
                ]}>{errors.email}</Text>
              )}
            </>
          ) : (
            <>
              <Text style={[
                styles.label,
                isTabOrDesktop && styles.labelDesktop
              ]}> Phone</Text>
              <View style={[
                styles.phoneInputContainer,
                errors.phone && styles.phoneInputContainerError,
                isPhoneFocused && styles.phoneInputContainerFocused,
                isTabOrDesktop && styles.phoneInputContainerDesktop
              ]}>
                <View style={[
                  styles.countryPickerContainer,
                  isTabOrDesktop && styles.countryPickerContainerDesktop
                ]}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withFlag={false}
                    withFlagButton={false}
                    withCallingCode
                    withCallingCodeButton = {true}
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      setCallingCode(country.callingCode[0] || "44");
                    }}
                    containerButtonStyle={[
                      styles.countryPickerButton,
                      isTabOrDesktop && styles.countryPickerButtonDesktop
                    ]}
                  />
                  {/* {!isTabOrDesktop && (
                    <Text style={styles.callingCode}>+{callingCode}</Text>
                  )} */}
                </View>

                <TextInput
                  style={[
                    styles.phoneInput,
                    isTabOrDesktop && styles.phoneInputDesktop
                  ]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={isTabOrDesktop ? colors.slateGrey : undefined}
                  value={phone}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setEmail("");
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => {
                    setIsPhoneFocused(false);
                    checkIfUserExists();
                  }}
                  maxLength={11}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && (
                <Text style={[
                  globalStyles.errorText,
                  isTabOrDesktop && styles.errorTextDesktop
                ]}>{errors.phone}</Text>
              )}
            </>
          )}

          <View style={styles.passwordContainer}>
            <Text style={[
              styles.label,
              isTabOrDesktop && styles.labelDesktop
            ]}> Password</Text>
            <TextInput
              style={[
                globalStyles.input,
                errors.password && globalStyles.errorInput,
                isTabOrDesktop && { fontSize: 16 },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={isTabOrDesktop ? colors.slateGrey : undefined}
              secureTextEntry
              value={password}
              onFocus={checkIfUserExists}
              onChangeText={setPassword}
            />
            {errors.password && (
              <Text style={[
                globalStyles.errorText,
                isTabOrDesktop && styles.errorTextDesktop
              ]}>{errors.password}</Text>
            )}
            <Text style={[
              styles.label,
              isTabOrDesktop && styles.labelDesktop
            ]}> Confirm Password</Text>
            <TextInput
              style={[
                globalStyles.input,
                errors.confirmPassword && globalStyles.errorInput,
                isTabOrDesktop && { fontSize: 16 },
              ]}
              placeholder="Confirm Password"
              placeholderTextColor={isTabOrDesktop ? colors.slateGrey : undefined}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            {errors.confirmPassword && (
              <Text style={[
                globalStyles.errorText,
                isTabOrDesktop && styles.errorTextDesktop
              ]}>
                {errors.confirmPassword}
              </Text>
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
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default signUpScreen;
