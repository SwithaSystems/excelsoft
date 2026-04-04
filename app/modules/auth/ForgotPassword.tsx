import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
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
import { FIX_VALIDATION_ERRORS } from "../../../constants/customErrorMessages";
import styles from "./ForgotPasswordStyles";
import { isValidEmail } from "../../../utilities/validations";

const forgotPasswordScreen = () => {
  const isWeb = Platform.OS === "web";

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mode, setMode] = useState("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Partial<{ email: string; phone: string }>>({});

  const [modalState, setModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });

  // ─── Refs — always current, never stale in async calls ───────────────────────
  const phoneNumberRef = useRef(phoneNumber);
  const callingCodeRef = useRef(callingCode);
  const emailRef = useRef(email);
  const modeRef = useRef(mode);

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const showModal = (title: string, message: string, buttonLabel = "OK") => {
    setModalState({ isVisible: true, title, message, buttonLabel });
  };

  const closeModal = () => setModalState((prev) => ({ ...prev, isVisible: false }));

  const normalizePhone = (raw: string): string => {
    const trimmed = raw.trim();
    return trimmed.startsWith("0") ? trimmed.slice(1) : trimmed;
  };

  const normalizeEmail = (raw: string): string => raw.trim().toLowerCase();

  const buildFullPhone = (phone: string, code: string): string => {
    return `+${code}${normalizePhone(phone)}`;
  };

  // ─── Toggle ──────────────────────────────────────────────────────────────────

  const toggleMode = (selected: string) => {
    setMode(selected);
    modeRef.current = selected;
    setEmail("");
    emailRef.current = "";
    setPhoneNumber("");
    phoneNumberRef.current = "";
    setErrors({});
  };

  // ─── Synced setters ──────────────────────────────────────────────────────────

  const handleSetPhone = (text: string) => {
    setPhoneNumber(text);
    phoneNumberRef.current = text;
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const handleSetEmail = (text: string) => {
    setEmail(text);
    emailRef.current = text;
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleSetCallingCode = (code: string) => {
    setCallingCode(code);
    callingCodeRef.current = code;
  };

  // ─── Blur handlers — format validation only, NO API calls ────────────────────

  const handleEmailBlur = () => {
    const normalized = normalizeEmail(emailRef.current);
    if (!normalized) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
    } else if (!isValidEmail(normalized)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePhoneBlur = () => {
    setIsPhoneFocused(false);
    const normalized = normalizePhone(phoneNumberRef.current);
    if (!normalized) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required." }));
    } else if (!/^\d{10}$/.test(normalized)) {
      setErrors((prev) => ({ ...prev, phone: "Enter a valid 10-digit phone number." }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validateFields = (): boolean => {
    const currentMode = modeRef.current;

    if (currentMode === "email") {
      const normalized = normalizeEmail(emailRef.current);
      if (!normalized) {
        setErrors((prev) => ({ ...prev, email: "Email is required." }));
        return false;
      }
      if (!isValidEmail(normalized)) {
        setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
        return false;
      }
      setErrors((prev) => ({ ...prev, email: undefined }));
      return true;
    }

    if (currentMode === "phone") {
      const normalized = normalizePhone(phoneNumberRef.current);
      if (!normalized) {
        setErrors((prev) => ({ ...prev, phone: "Phone number is required." }));
        return false;
      }
      if (!/^\d{10}$/.test(normalized)) {
        setErrors((prev) => ({ ...prev, phone: "Enter a valid 10-digit phone number." }));
        return false;
      }
      setErrors((prev) => ({ ...prev, phone: undefined }));
      return true;
    }

    return false;
  };

  // ─── Check user exists — returns result directly, no state dependency ─────────

  const checkUserExists = async (): Promise<any | null> => {
    try {
      let response;
      if (modeRef.current === "phone") {
        const fullPhone = buildFullPhone(phoneNumberRef.current, callingCodeRef.current);
        response = await UserAPI.getUserByPhonenumber(fullPhone);
      } else {
        response = await UserAPI.getUserByEmail(normalizeEmail(emailRef.current));
      }
      return response?.data ?? null;
    } catch {
      // 404 = not found
      return null;
    }
  };

  // ─── Send Code — all logic happens here on button press ──────────────────────

  const handleSendCode = async () => {
    if (isLoading) return;

    // Step 1: validate format first
    const isValid = validateFields();
    if (!isValid) {
      showModal("Let's fix that", FIX_VALIDATION_ERRORS);
      return;
    }

    setIsLoading(true);

    try {
      // Step 2: check user exists — use returned value directly, never state
      const foundUser = await checkUserExists();

      if (!foundUser) {
        showModal(
          "Check Details",
          "Uh-oh! It seems the email/phone you entered doesn't exist. Please try again."
        );
        return;
      }

      // Step 3: send OTP
      if (modeRef.current === "phone") {
        const fullPhone = buildFullPhone(phoneNumberRef.current, callingCodeRef.current);
        const response = await TwilioApi.sendOtp({ phone: fullPhone });

        if (response?.status === 201) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_forgetPwd: fullPhone,
            from: "forgotPassword",
          });
        } else {
          showModal("Failed to Send Code", "Please try again later.");
        }
      } else if (modeRef.current === "email") {
        const normalizedEmail = normalizeEmail(emailRef.current);
        const response = await TwilioApi.sendOtp_Email({ email: normalizedEmail });

        if (response?.status === 201) {
          redirectToPage(containers.verificationScreen, {
            email_forgetPwd: normalizedEmail,
            from: "forgotPassword",
            verificationType: "email",
          });
        } else {
          showModal("Failed to Send Code", "Please try again later.");
        }
      }
    } catch (error: any) {
      const message = error?.message || "Please try again later.";
      showModal("Failed to Send Code", message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

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
        <View style={[styles.sectionContainer, isWeb && styles.sectionContainerWeb]}>
          <Text>Please enter your email/phone number to reset your password.</Text>

          {/* ── Toggle ── */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, mode === "phone" && styles.activeToggle]}
              onPress={() => toggleMode("phone")}
              disabled={isLoading}
            >
              <Text style={mode === "phone" ? styles.activeText : styles.inactiveText}>
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, mode === "email" && styles.activeToggle]}
              onPress={() => toggleMode("email")}
              disabled={isLoading}
            >
              <Text style={mode === "email" ? styles.activeText : styles.inactiveText}>
                Email
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Email Input ── */}
          {mode === "email" ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  errors.email && globalStyles.errorInput,
                  // isWeb && styles.inputDesktop,
                ]}
                placeholder="Enter your email address"
                value={email}
                onChangeText={handleSetEmail}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {errors.email && (
                <Text style={[globalStyles.errorText, isWeb && styles.errorTextDesktop]}>
                  {errors.email}
                </Text>
              )}
            </>
          ) : (
            /* ── Phone Input ── */
            <>
              <Text style={[styles.label]}>Phone Number</Text>
              <View
                style={[
                  styles.phoneInputContainer,
                  errors.phone && styles.phoneInputContainerError,
                  // isPhoneFocused && styles.phoneInputContainerFocused,
                  isWeb && styles.phoneInputContainerDesktop,
                ]}
              >
                <View style={[styles.countryPickerContainer, isWeb && styles.countryPickerContainerDesktop]}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withFlag={false}
                    withCallingCode
                    withCallingCodeButton
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      handleSetCallingCode(country.callingCode[0] || "44");
                    }}
                    containerButtonStyle={[
                      styles.countryPickerButton,
                      isWeb && styles.countryPickerButtonDesktop,
                    ]}
                  />
                  {/* ✅ No manual +callingCode Text — withCallingCodeButton renders it on all platforms */}
                </View>

                <TextInput
                  style={[styles.phoneInput, isWeb && styles.phoneInputDesktop]}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={handleSetPhone}
                  onFocus={() => setIsPhoneFocused(true)}
                  onBlur={handlePhoneBlur}
                  maxLength={11}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
              {errors.phone && (
                <Text style={[globalStyles.errorText, isWeb && styles.errorTextDesktop]}>
                  {errors.phone}
                </Text>
              )}
            </>
          )}

          <Button
            title={isLoading ? "Sending..." : "Send Verification Code"}
            style={styles.signInButton}
            onPress={handleSendCode}
            disabled={isLoading}
          />

          <Button
            title="Back to Sign In"
            style={styles.signInButton}
            onPress={() => { if (!isLoading) redirectToPage(containers.signInScreen); }}
            disabled={isLoading}
          />

          <ConfirmationModal
            isModalVisible={modalState.isVisible}
            onClose={closeModal}
            title={modalState.title}
            text={modalState.message}
            submitText={modalState.buttonLabel}
            handleSubmit={closeModal}
            handleCancel={closeModal}
          />
        </View>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default forgotPasswordScreen;
