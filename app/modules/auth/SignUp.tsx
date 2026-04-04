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
  Platform,
  ActivityIndicator,
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
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import {
  FIX_VALIDATION_ERRORS,
  REGISTRATION_FAILED,
  OTP_SEND_FAILED,
  PHONE_ALREADY_REGISTERED,
  EMAIL_ALREADY_REGISTERED,
  ACCOUNT_CREATION_FAILED,
} from "../../../constants/customErrorMessages";

import styles from "./SignUpStyles";
import { globalStyles } from "@/assets/styles/globalStyles";

import {
  isValidEmail,
  isValidPhoneNumber,
  isValidPassword,
} from "@/utilities/validations";

const signUpScreen = () => {
  const isWeb = Platform.OS === "web";
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mode, setMode] = useState("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupIntent, setSignupIntent] = useState<"register" | "recover">(
    "register"
  );
  const [errorModalState, setErrorModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });

  const [errors, setErrors] = useState<
    Partial<{
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    }>
  >({});

  const normalizeEmail = (value: string) => value.trim().toLowerCase();

  const showErrorAlert = ({
    title,
    message,
    buttonLabel = "OK",
  }: {
    title: string;
    message: string;
    buttonLabel?: string;
  }) => {
    setErrorModalState({
      isVisible: true,
      title,
      message,
      buttonLabel,
    });
  };

  const toggleMode = (selected: any) => {
    setMode(selected);
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setErrors({}); // Clear all errors when switching modes
  };

const handleEmailBlur = async () => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    setErrors((prev) => ({ ...prev, email: "Email is required." }));
    return;
  }
  if (!isValidEmail(normalizedEmail)) {
    setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
    return;
  }
  // Format is valid — now check existence
  await checkIfEmailExists();
};

const handlePhoneBlur = async () => {
  const trimmedPhone = phone.trim();
  if (!trimmedPhone) {
    setErrors((prev) => ({ ...prev, phone: "Phone number is required." }));
    return;
  }
  const normalized = trimmedPhone.startsWith("0")
    ? trimmedPhone.slice(1)
    : trimmedPhone;
  const fullPhone = `+${callingCode}${normalized}`;
  const formatError = isValidPhoneNumber(fullPhone);
  if (formatError) {
    setErrors((prev) => ({ ...prev, phone: formatError }));
    return;
  }
  // Format is valid — now check existence
  await checkIfPhoneExists();
};

const handlePasswordBlur = () => {
  const passwordError = isValidPassword(password);
  if (passwordError) {
    setErrors((prev) => ({ ...prev, password: passwordError }));
  } else {
    setErrors((prev) => ({ ...prev, password: undefined }));
  }
};

const handleConfirmPasswordBlur = () => {
  if (!confirmPassword) {
    setErrors((prev) => ({ ...prev, confirmPassword: "Please confirm your password." }));
  } else if (confirmPassword !== password) {
    setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
  } else {
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  }
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
    
    const normalizedPhone = trimmedPhone.startsWith("0")
      ? trimmedPhone.slice(1)
      : trimmedPhone;
    const formattedPhone = `+${callingCode}${normalizedPhone}`;
    
    try {
      const response = await UserAPI.checkPhoneStatus(formattedPhone);
      const exists = !!response?.data?.exists;
      const isDeleted = !!response?.data?.isDeleted;

      // If it's a soft-deleted account, don't block the form and don't show the alert yet.
      // We'll show the recover alert only when user taps "Sign Up".
      if (exists && isDeleted) {
        setSignupIntent("register");
        setErrors((prev) => ({ ...prev, phone: undefined }));
        return;
      }

      if (exists) {
        showErrorAlert({
          title: "Phone Number Already Exists!",
          message: PHONE_ALREADY_REGISTERED,
        });
        setErrors((prev) => ({
          ...prev,
          phone: "This phone number is already registered",
        }));
        return;
      }

      setSignupIntent("register");
      setErrors((prev) => ({ ...prev, phone: undefined }));
    } catch (error) {
      console.error("Error checking phone number", error);
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const checkIfEmailExists = async () => {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return;
    
    // Validate email format before checking existence
    if (!isValidEmail(normalizedEmail)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
      return;
    }

    try {
      const response = await UserAPI.checkEmailStatus(normalizedEmail);
      const exists = !!response?.data?.exists;
      const isDeleted = !!response?.data?.isDeleted;

      // If it's a soft-deleted account, don't block the form and don't show the alert yet.
      // We'll show the recover alert only when user taps "Sign Up".
      if (exists && isDeleted) {
        setSignupIntent("register");
        setErrors((prev) => ({ ...prev, email: undefined }));
        return;
      }

      if (exists) {
        showErrorAlert({
          title: "Email Already Exists!",
          message: EMAIL_ALREADY_REGISTERED,
        });
        setErrors((prev) => ({
          ...prev,
          email: "This email is already registered.",
        }));
        return;
      }

      setSignupIntent("register");
      setErrors((prev) => ({ ...prev, email: undefined }));
    } catch (error) {
      console.error("Error checking email", error);
      setErrors((prev) => ({ ...prev, email: undefined }));
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
      const normalizedEmail = normalizeEmail(email);

      if (!normalizedEmail) {
        newErrors.email = "Email is required.";
      } else if (!isValidEmail(normalizedEmail)) {
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
        const validationResult = isValidPhoneNumber(fullPhoneNumber);
        
        if (validationResult !== null) {
          newErrors.phone = validationResult;
        }
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else {
      const passwordError = isValidPassword(password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) {
      showErrorAlert({
        title: "Validation Error",
        message: FIX_VALIDATION_ERRORS,
      });
      return;
    }

    try {
      if (mode === "phone") {
        let normalizedPhone = phone.trim();
        if (normalizedPhone.startsWith("0")) {
          normalizedPhone = normalizedPhone.slice(1);
        }
        const formattedPhone = `+${callingCode}${normalizedPhone}`;

        // If account exists but is soft-deleted, ask to recover ONLY on button tap.
        const statusRes = await UserAPI.checkPhoneStatus(formattedPhone);
        const exists = !!statusRes?.data?.exists;
        const isDeleted = !!statusRes?.data?.isDeleted;

        if (exists && isDeleted) {
          setIsLoading(false);
          Alert.alert(
            "Recover account?",
            "You have deleted this account previously. Do you want to recover it?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setSignupIntent("register"),
              },
              {
                text: "Recover",
                onPress: async () => {
                  setIsLoading(true);
                  try {
                    await handlePhoneSignUp("recover");
                  } finally {
                    setIsLoading(false);
                  }
                },
              },
            ]
          );
          return;
        }

        setIsLoading(true);
        await handlePhoneSignUp("register");
      } else if (mode === "email") {
        const normalizedEmail = normalizeEmail(email);
        const statusRes = await UserAPI.checkEmailStatus(normalizedEmail);
        const exists = !!statusRes?.data?.exists;
        const isDeleted = !!statusRes?.data?.isDeleted;

        if (exists && isDeleted) {
          setIsLoading(false);
          Alert.alert(
            "Recover account?",
            "You have deleted this account previously. Do you want to recover it?",
            [
              {
                text: "Cancel",
                style: "cancel",
                onPress: () => setSignupIntent("register"),
              },
              {
                text: "Recover",
                onPress: async () => {
                  setIsLoading(true);
                  try {
                    await handleEmailSignUp("recover");
                  } finally {
                    setIsLoading(false);
                  }
                },
              },
            ]
          );
          return;
        }

        setIsLoading(true);
        await handleEmailSignUp("register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showErrorAlert({
        title: "Registration Failed",
        message: ACCOUNT_CREATION_FAILED,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignUp = async (intentOverride?: "register" | "recover") => {
    let normalizedPhone = phone.trim();
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = normalizedPhone.slice(1);
    }

    const formattedPhone = `+${callingCode}${normalizedPhone}`;
    const userData = { phone: formattedPhone, email: "", password };

    try {
      const responseFromTwilio = await TwilioApi.sendOtp({
        phone: userData.phone,
        intent: intentOverride ?? signupIntent,
      });
      
      if (
        responseFromTwilio?.status === 201 &&
        responseFromTwilio.data?.status === "pending"
      ) {
        redirectToPage(containers.verificationScreen, {
          userData: JSON.stringify(userData),
          from: "signup",
          verificationType: "phone",
          intent: intentOverride ?? signupIntent,
        });
      } else {
        showErrorAlert({
          title: "Failed to Send OTP",
          message: OTP_SEND_FAILED,
        });
      }
    } catch (error: any) {
      console.error("Phone signup error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || ACCOUNT_CREATION_FAILED;
      showErrorAlert({
        title: "Failed to Send OTP",
        message: errorMessage,
      });
    }
  };

  const handleEmailSignUp = async (intentOverride?: "register" | "recover") => {
    const userData = { phone: "", email: normalizeEmail(email), password };

    try {
      const response = await TwilioApi.sendOtp_Email({
        email: userData.email,
        intent: intentOverride ?? signupIntent,
      });

      if (response?.status === 201 && response?.data?.success) {
        redirectToPage(containers.verificationScreen, {
          userData: JSON.stringify(userData),
          from: "signup",
          verificationType: "email",
          intent: intentOverride ?? signupIntent,
        });
      } else {
        showErrorAlert({
          title: "Failed to Send Verification Email",
          message: response?.message || "Please try again later.",
        });
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Please try again later.";
      showErrorAlert({
        title: "Failed to Send Verification Email",
        message: errorMessage,
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
          hideBackArrow={isWeb}
          headerStyle={isWeb ? styles.signUpHeaderStyle : undefined}
          headerTitleStyle={isWeb ? styles.signUpHeaderTitle : undefined}
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
                mode === "phone" && { backgroundColor: colors.primary },
              ]}
              onPress={() => toggleMode("phone")}
              disabled={isLoading}
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
              disabled={isLoading}
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
                  isWeb && styles.inputDesktop,
                  errors.email && globalStyles.errorInput,
                ]}
                placeholder="Enter your email address"
                placeholderTextColor={isWeb ? colors.slateGrey : undefined}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setPhoneNumber("");
                  // Clear error as user types
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && (
                <Text style={[
                  globalStyles.errorText,
                  isWeb && styles.errorTextDesktop
                ]}>{errors.email}</Text>
              )}
            </>
          ) : (
            <>
              <Text style={[
                styles.label,
                isWeb && styles.labelDesktop
              ]}>Phone</Text>
              <View style={[
                styles.phoneInputContainer,
                errors.phone && styles.phoneInputContainerError,
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
                    // Clear error as user types
                    if (errors.phone) {
                      setErrors((prev) => ({ ...prev, phone: undefined }));
                    }
                  }}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={() => {
                    setIsPhoneFocused(false);
                    handlePhoneBlur();
                  }}
                  maxLength={11}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
              {errors.phone && (
                <Text style={[
                  globalStyles.errorText,
                  isWeb && styles.errorTextDesktop
                ]}>{errors.phone}</Text>
              )}
            </>
          )}

          <View style={styles.passwordContainer}>
            <Text style={[
              styles.label,
              isWeb && styles.labelDesktop
            ]}>Password</Text>
            <TextInput
              style={[
                globalStyles.input,
                errors.password && globalStyles.errorInput,
                isWeb && { fontSize: 16 },
              ]}
              placeholder="Enter your password"
              placeholderTextColor={isWeb ? colors.slateGrey : undefined}
              secureTextEntry
              value={password}
               onBlur={handlePasswordBlur}  
              onChangeText={(text) => {
                setPassword(text);
                // Clear error as user types
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
                // Also check confirm password match if it's already filled
                if (confirmPassword && text !== confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
                } else if (confirmPassword && text === confirmPassword) {
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }
              }}
              editable={!isLoading}
            />
            {errors.password && (
              <Text style={[
                globalStyles.errorText,
                isWeb && styles.errorTextDesktop
              ]}>{errors.password}</Text>
            )}
            
            <Text style={[
              styles.label,
              isWeb && styles.labelDesktop
            ]}>Confirm Password</Text>
            <TextInput
              style={[
                globalStyles.input,
                errors.confirmPassword && globalStyles.errorInput,
                isWeb && { fontSize: 16 },
              ]}
              onBlur={handleConfirmPasswordBlur} 
              placeholder="Confirm Password"
              placeholderTextColor={isWeb ? colors.slateGrey : undefined}
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                // Clear error as user types and check match
               if (text === password) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
              }}
              editable={!isLoading}
            />
            {errors.confirmPassword && (
              <Text style={[
                globalStyles.errorText,
                isWeb && styles.errorTextDesktop
              ]}>
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          <Button
            title={isLoading ? "Signing Up..." : "Sign Up"}
            style={styles.signInButton}
            onPress={handleSignUp}
            disabled={isLoading}
          />

          {isLoading && (
            <ActivityIndicator 
              size="small" 
              color={colors.primary} 
              style={{ marginTop: 10 }}
            />
          )}

          <Text style={styles.signUpText}>
            Already have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => {
                if (!isLoading) {
                  redirectToPage(containers.signInScreen);
                }
              }}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </KeyBoardWrapper>
      <ConfirmationModal
        isModalVisible={errorModalState.isVisible}
        onClose={() =>
          setErrorModalState((prev) => ({ ...prev, isVisible: false }))
        }
        title={errorModalState.title}
        text={errorModalState.message}
        submitText={errorModalState.buttonLabel}
        handleSubmit={() =>
          setErrorModalState((prev) => ({ ...prev, isVisible: false }))
        }
      />
    </PageLayout>
  );
};

export default signUpScreen;
