import React, { useState } from "react";
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
  const [isLookingUp, setIsLookingUp] = useState(false); // ✅ tracks API lookup in progress
  const [user, setUser] = useState<any>(null);
  const [userChecked, setUserChecked] = useState(false); // ✅ tracks whether a lookup has completed — fixes race condition

  const [errors, setErrors] = useState<Partial<{ email: string; phone: string }>>({});

  const [modalState, setModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const showModal = (title: string, message: string, buttonLabel = "OK") => {
    setModalState({ isVisible: true, title, message, buttonLabel });
  };

  const closeModal = () => setModalState((prev) => ({ ...prev, isVisible: false }));

  // ✅ Shared normalizer — used consistently for both validation and API calls
  const normalizePhone = (raw: string): string => {
    const trimmed = raw.trim();
    return trimmed.startsWith("0") ? trimmed.slice(1) : trimmed;
  };

  const getFullPhone = (): string => `+${callingCode}${normalizePhone(phoneNumber)}`;

  // ─── Toggle ──────────────────────────────────────────────────────────────────

  const toggleMode = (selected: string) => {
    setMode(selected);
    setEmail("");
    setPhoneNumber("");
    setErrors({});
    setUser(null);
    setUserChecked(false); // ✅ reset on mode switch
  };

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validateEmailFormat = (): boolean => {
    const trimmed = email.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      return false;
    }
    if (!isValidEmail(trimmed)) { // ✅ shared utility instead of inline regex
      setErrors((prev) => ({ ...prev, email: "Enter a valid email address." }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePhoneFormat = (): boolean => {
    const normalized = normalizePhone(phoneNumber); // ✅ consistent normalization
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
  };

  const validateFields = (): boolean => {
    if (mode === "email") return validateEmailFormat();
    if (mode === "phone") return validatePhoneFormat();
    return false;
  };

  // ─── User Existence Check ─────────────────────────────────────────────────────
  // ✅ Called only from blur handlers (never useEffect) — only runs after format is valid

  const checkUserExists = async () => {
    setIsLookingUp(true);
    setUser(null);
    setUserChecked(false);

    try {
      let response;
      if (mode === "phone") {
        response = await UserAPI.getUserByPhonenumber(getFullPhone()); // ✅ normalized phone
      } else {
        response = await UserAPI.getUserByEmail(email.trim());
      }
      setUser(response?.data ?? null);
    } catch {
      // 404 = user not found — user stays null
      setUser(null);
    } finally {
      setUserChecked(true);  // ✅ marks lookup as done regardless of result
      setIsLookingUp(false);
    }
  };

  // ─── Blur Handlers ────────────────────────────────────────────────────────────
  // ✅ Format validate first → only call API if format passes

  const handleEmailBlur = async () => {
    const isFormatValid = validateEmailFormat();
    if (!isFormatValid) return;
    await checkUserExists();
  };

  const handlePhoneBlur = async () => {
    setIsPhoneFocused(false);
    const isFormatValid = validatePhoneFormat();
    if (!isFormatValid) return;
    await checkUserExists();
  };

  // ─── Send Code ────────────────────────────────────────────────────────────────

  const handleSendCode = async () => {
    if (isLoading || isLookingUp) return;

    const isValid = validateFields();
    if (!isValid) {
      showModal("Let's fix that", FIX_VALIDATION_ERRORS);
      return;
    }

    // ✅ Edge case: user used autofill or never blurred the field before tapping submit
    // Run the lookup now before proceeding
    if (!userChecked) {
      await checkUserExists();
    }

    if (!user) {
      showModal(
        "Check Details",
        "Uh-oh! It seems the email/phone you entered doesn't exist. Please try again."
      );
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "phone") {
        // ✅ try/catch added — previously phone had none while email did
        const fullPhone = getFullPhone();
        const response = await TwilioApi.sendOtp({ phone: fullPhone });

        if (response?.status === 201) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_forgetPwd: fullPhone,
            from: "forgotPassword",
          });
        } else {
          showModal("Failed to Send Code", "Please try again later.");
        }
      } else if (mode === "email") {
        const response = await TwilioApi.sendOtp_Email({ email: email.trim() });

        if (response?.status === 201) {
          redirectToPage(containers.verificationScreen, {
            email_forgetPwd: email.trim(),
            from: "forgotPassword",
            verificationType: "email",
          });
        } else {
          showModal("Failed to Send Code", "Please try again later.");
        }
      }
    } catch {
      showModal("Failed to Send Code", "Please try again later.");
    } finally {
      // ✅ Single finally covers both phone and email — previously only email had this
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
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  // ✅ Field edited — previous lookup is stale, reset it
                  setUser(null);
                  setUserChecked(false);
                }}
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
              {isLookingUp && <ActivityIndicator size="small" style={{ marginTop: 4 }} />}
            </>
          ) : (
            /* ── Phone Input ── */
            <>
              <Text style={[styles.label ]}>Phone Number</Text>
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
                      setCallingCode(country.callingCode[0] || "44");
                      // ✅ Country changed — previous lookup result no longer valid
                      setUser(null);
                      setUserChecked(false);
                    }}
                    containerButtonStyle={[
                      styles.countryPickerButton,
                      isWeb && styles.countryPickerButtonDesktop,
                    ]}
                  />
                  {!isWeb && <Text style={styles.callingCode}>+{callingCode}</Text>}
                </View>

                <TextInput
                  style={[styles.phoneInput, isWeb && styles.phoneInputDesktop]}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                    // ✅ Field edited — previous lookup is stale, reset it
                    setUser(null);
                    setUserChecked(false);
                  }}
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
              {isLookingUp && <ActivityIndicator size="small" style={{ marginTop: 4 }} />}
            </>
          )}

          {/* ✅ Disabled while lookup or send is in progress — prevents double submission */}
          <Button
            title={isLoading ? "Sending..." : "Send Verification Code"}
            style={styles.signInButton}
            onPress={handleSendCode}
            disabled={isLoading || isLookingUp}
          />

          <Button
            title="Back to Sign In"
            style={styles.signInButton}
            onPress={() => { if (!isLoading) redirectToPage(containers.signInScreen); }}
            disabled={isLoading}
          />

          {/* ✅ Single ConfirmationModal handles all cases — no more two modals stacking */}
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