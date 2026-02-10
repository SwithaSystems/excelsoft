import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
// import styles from "./forgotPasswordStyles";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { TwilioApi } from "@/services/twilioService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { UserAPI } from "@/services/userService";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { FORGOT_PASSWORD_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import { FIX_VALIDATION_ERRORS } from "../../../constants/customErrorMessages";
import styles from "./ForgotPasswordStyles";

const forgotPasswordScreen = () => {
  const isWeb = Platform.OS === "web";
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");

  const [errors, setErrors] = useState<
    Partial<{ email?: string; phone?: string }>
  >({});

  const toggleMode = (selected: any) => {
    setMode(selected);
    setEmail("");
    setPhoneNumber("");
    setErrors({});
  };

  const validateFields = () => {
    const newErrors: { email?: string; phone?: string } = {};

    if (mode === "email") {
      if (!email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        newErrors.email = "Enter a valid email address.";
      }
    } else if (mode === "phone") {
      let cleanedPhone = phoneNumber.trim();
      if (cleanedPhone.startsWith("0")) cleanedPhone = cleanedPhone.slice(1);

      if (!cleanedPhone) {
        newErrors.phone = "Phone number is required.";
      } else if (!/^\d{10}$/.test(cleanedPhone)) {
        newErrors.phone = "Enter a valid 10-digit phone number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    const isValid = validateFields();
    if (!isValid) {
      showErrorAlert({
        title: "Let's fix that",
        message: FIX_VALIDATION_ERRORS,
      });
      return;
    }

    const fullPhone = `+${callingCode}${phoneNumber}`;

    if (mode === "phone") {
      if (user) {
        await TwilioApi.sendOtp({ phone: fullPhone });
        redirectToPage(containers.verificationScreen, {
          phoneNumber_forgetPwd: fullPhone,
          from: "forgotPassword",
        });
      } else {
        setModalOpen(true);
      }
    } else if (mode === "email") {
      try {
        await TwilioApi.sendOtp_Email({ email });
        redirectToPage(containers.verificationScreen, {
          email_forgetPwd: email,
          from: "forgotPassword",
          verificationType: "email",
        });
      } catch {
        showErrorAlert({
          title: "Failed to send OTP",
          message: "Please try again later.",
        });
      }
    }
  };

  useEffect(() => {
    if (mode === "phone" && phoneNumber) {
      UserAPI.getUserByPhonenumber(`+${callingCode}${phoneNumber}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          setUser(null);
        });
    } else if (mode === "email" && email) {
      UserAPI.getUserByEmail(email)
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, [phoneNumber]);

  return (
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable
      headerComponent={
        <Header 
          headerText={FORGOT_PASSWORD_SCREEN_TITLE}
          hideBackArrow={isWeb}
          headerStyle={isWeb ? styles.forgotPasswordHeaderStyle : undefined}
          headerTitleStyle={isWeb ? styles.forgotPasswordHeaderTitle : undefined}
        />
      }
    >
      <KeyBoardWrapper>
        <View style={[
          styles.sectionContainer,
          isWeb && styles.sectionContainerWeb
        ]}>
          <Text>
            Please enter your email/phone number to reset your password.
          </Text>

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
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter your email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setPhoneNumber("");
                }}
                onBlur={validateFields}
                keyboardType="email-address"
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
              <Text style={styles.label}>Phone Number</Text>
              <View style={[
                styles.phoneInputContainer,
                errors.phone && styles.phoneInputContainerError,
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
                    withCallingCode
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      setCallingCode(country.callingCode[0] || "44");
                    }}
                    containerButtonStyle={[
                      styles.countryPickerButton,
                      isWeb && styles.countryPickerButtonDesktop
                    ]}
                  />
                  {!isWeb && (
                    <Text style={styles.callingCode}>+{callingCode}</Text>
                  )}
                </View>

                <TextInput
                  style={[
                    styles.phoneInput,
                    isWeb && styles.phoneInputDesktop
                  ]}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setEmail("");
                  }}
                  onBlur={validateFields}
                  maxLength={11}
                  keyboardType="phone-pad"
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

          <Button
            title="Send Verification Code"
            style={styles.signInButton}
            onPress={handleSendCode}
          />
          <Button
            title="Back to Sign In"
            style={styles.signInButton}
            onPress={() => redirectToPage(containers.signInScreen)}
          />

          <ConfirmationModal
            onClose={() => setModalOpen(false)}
            isModalVisible={modalOpen}
            text="Uh-oh! It seems that you have entered the email/phone that doesn’t exist! Let’s try again."
            submitText="OK"
            handleSubmit={() => setModalOpen(false)}
            handleCancel={() => setModalOpen(false)}
            title="Check Details" 
          />
        </View>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default forgotPasswordScreen;
