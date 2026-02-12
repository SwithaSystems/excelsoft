import { EDIT_ACCOUNT_INFORMATION_SCREEN_TITLE } from "../../../constants/stringLiterals";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { FontAwesome } from "@expo/vector-icons";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { Image } from "react-native-elements";
import Button from "@/app/components/commonComponents/Button";
import { 
  redirectToPage,
  clearNavigationStack,
} from "@/utilities/redirectionHelper";
import containers from "@/containers";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserAPI } from "@/services/userService";
import { TwilioApi } from "@/services/twilioService";
import * as SecureStore from "expo-secure-store";
import { setUserData } from "@/store/slices/userSlice";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { isValidEmail, isValidPhoneNumber } from "@/utilities/validations";
import colors from "@/constants/colors";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import { getAllCountries } from "react-native-country-picker-modal";

const EditAccountInformationScreen = () => {
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [newPhoneError, setNewPhoneError] = useState<string | null>(null);
  const [newEmailError, setNewEmailError] = useState<string | null>(null);

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [showChangePhone, setShowChangePhone] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);

  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [localPhone, setLocalPhone] = useState("");       
  const [newLocalPhone, setNewLocalPhone] = useState("");
  const [newCountryCode, setNewCountryCode] = useState<CountryCode>("GB");
  const [newCallingCode, setNewCallingCode] = useState("44"); 


  const userData = useSelector((state: RootState) => state.user.user);

  const isWeb = Platform.OS === "web";
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header 
      headerText={EDIT_ACCOUNT_INFORMATION_SCREEN_TITLE}
      onBackPress={() =>
        clearNavigationStack(containers.userProfileScreen)
      }
    />
  );
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  useEffect(() => {
  const loadUser = async () => {
    if (!userData) return;

    try {
      const user = await UserAPI.getUserById(userData._id || userData.id);

      if (user?.data) {
        setId(user.data._id);

   const fullPhone = user.data.phone || "";

        if (fullPhone.startsWith("+")) {
          const number = fullPhone.slice(1);

          // calling codes are max 3 digits
          const code1 = number.slice(0, 1);
          const code2 = number.slice(0, 2);
          const code3 = number.slice(0, 3);

          let code = "";

          // check manually for common lengths
          if (number.length > 10) {
            code = code2; // most countries (91,44,61)
          } else if (number.length > 9) {
            code = code1; // US (+1)
          } else {
            code = code3; // rare cases
          }

          setCallingCode(code);

          const local = number.slice(code.length);
          setLocalPhone(local);
          setPhone(fullPhone);
        }

        setEmail(user.data.email || "");
        setProfileImage(user.data.profileImageUrl || "");
        setIsPhoneVerified(!!user.data.isPhoneVerified);
        setIsEmailVerified(!!user.data.isEmailVerified);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  loadUser();
}, [userData]);


  const handlePhoneChange = (text: string) => {
    setLocalPhone(text);

    const full = `+${callingCode}${text}`;
    const error = isValidPhoneNumber(full);

    setPhoneError(text.trim() ? error : null);
  };


  const handleEmailChange = (value: string) => {
    setEmail(value);
    const isValid = isValidEmail(value);
    setEmailError(value.trim() && !isValid ? "Please enter a valid email address" : null);
  };

  const handleNewPhoneChange = (value: string) => {
    setNewPhone(value);
    const error = isValidPhoneNumber(value);
    setNewPhoneError(value.trim() ? error : null);
  };

  const handleNewEmailChange = (value: string) => {
    setNewEmail(value);
    const isValid = isValidEmail(value);
    setNewEmailError(value.trim() && !isValid ? "Please enter a valid email address" : null);
  };

  const handleVerifyPhone = async () => {
    try {
      const phoneToVerify = showChangePhone
        ? `+${newCallingCode}${newLocalPhone}`
        : `+${callingCode}${localPhone}`;
      const hasError = showChangePhone ? newPhoneError : phoneError;

      if (!phoneToVerify || hasError) {
        Alert.alert("Error", "Please enter a valid phone number");
        return;
      }

      if (!isPhoneVerified) {
        const res = await TwilioApi.sendOtp({ phone: phoneToVerify });
        // console.log("Send OTP response:", res);
        if (
          res?.status === 201 &&
          res.data?.status === "pending"
        ) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_editAccount: phoneToVerify,
            verificationType: "phone",
            from: "first_add_phone",
            userId: id,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          Alert.alert("Error", errorMsg);
        }
      } else if (showChangePhone) {
        if (!email || !isEmailVerified) {
          Alert.alert("Error", "You need a verified email to change your phone number");
          return;
        }
        const res = await TwilioApi.sendOtp_Email({ email });
        // console.log("Send OTP Email response:", res);
        if (res?.status === 201 && res?.data?.success) {
          redirectToPage(containers.verificationScreen, {
            email_editAccount: email,
            verificationType: "email",
            from: "change_phone",
            newPhone: phoneToVerify,
            userId: id,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          Alert.alert("Error", errorMsg);
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to send verification code. Please try again.";
      Alert.alert("Error", errorMsg);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const emailToVerify = showChangeEmail ? newEmail : email;
      const hasError = showChangeEmail ? newEmailError : emailError;

      if (!emailToVerify || hasError) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }
      if (!isEmailVerified) {
        const res = await TwilioApi.sendOtp_Email({ email: emailToVerify });
        // console.log("Send OTP Email response:", res);
        if (res?.status === 201 && res?.data?.success) {
          redirectToPage(containers.verificationScreen, {
            email_editAccount: emailToVerify,
            verificationType: "email",
            from: "first_add_email",
            userId: id,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          Alert.alert("Error", errorMsg);
        }
      } else if (showChangeEmail) {
        if (!phone || !isPhoneVerified) {
          Alert.alert("Error", "You need a verified phone to change your email");
          return;
        }
        const res = await TwilioApi.sendOtp({ phone });
        // console.log("Send OTP response:", res);
        if (
          res?.status === 201 &&
          res.data?.status === "pending"
        ) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_editAccount: phone,
            verificationType: "phone",
            from: "change_email",
            newEmail: emailToVerify,
            userId: id,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          Alert.alert("Error", errorMsg);
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to send verification code. Please try again.";
      Alert.alert("Error", errorMsg);
    }
  };

  const handleSave = async () => {
    // Clear previous errors
    setPhoneError(null);
    setEmailError(null);

    const formData = new FormData();
    let hasChanges = false;
    let phoneFieldChanged = false;
    let emailFieldChanged = false;

    if (!isPhoneVerified && phone && !phoneError) {
      formData.append("phone", phone);
      hasChanges = true;
      phoneFieldChanged = true;
    }

    if (!isEmailVerified && email && !emailError) {
      formData.append("email", email);
      hasChanges = true;
      emailFieldChanged = true;
    }

    if (!hasChanges) {
      Alert.alert("No Changes", "All contacts are verified or no changes made");
      return;
    }

    try {
      const response = await UserAPI.userEditContact(id, formData);
      if (response?.data?.user) {
        dispatch(setUserData(response.data.user));
        await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
        Alert.alert("Success", "Profile updated successfully", [
          { text: "OK", onPress: () => redirectToPage(containers.userProfileScreen) },
        ]);
      }
    } catch (error: any) {
      console.error("Save error:", error);
      
      // Parse backend error response
      const errorMessage = error?.response?.data?.message || error?.message || "";
      const errorMessageLower = errorMessage.toLowerCase();

      // Check for phone-related errors
      if (phoneFieldChanged && (
        errorMessageLower.includes("phone") ||
        errorMessageLower.includes("mobile") ||
        errorMessageLower.includes("number") ||
        errorMessageLower.includes("already exists") ||
        errorMessageLower.includes("duplicate")
      )) {
        // Check if it's specifically about phone
        if (errorMessageLower.includes("phone") || 
            errorMessageLower.includes("mobile") || 
            errorMessageLower.includes("number")) {
          setPhoneError(errorMessage || "This phone number is already in use. Please use a different number.");
        } else {
          // Generic duplicate error - check which field was changed
          if (phoneFieldChanged && !emailFieldChanged) {
            setPhoneError(errorMessage || "This phone number is already in use. Please use a different number.");
          }
        }
      }

      // Check for email-related errors
      if (emailFieldChanged && (
        errorMessageLower.includes("email") ||
        errorMessageLower.includes("already exists") ||
        errorMessageLower.includes("duplicate") ||
        errorMessageLower.includes("invalid email") ||
        errorMessageLower.includes("email format")
      )) {
        // Check if it's specifically about email
        if (errorMessageLower.includes("email")) {
          setEmailError(errorMessage || "This email is already in use. Please use a different email address.");
        } else {
          // Generic duplicate error - check which field was changed
          if (emailFieldChanged && !phoneFieldChanged) {
            setEmailError(errorMessage || "This email is already in use. Please use a different email address.");
          }
        }
      }

      // If no field-specific error was set, show generic error only for network/server errors
      if (!phoneError && !emailError) {
        // Only show alert for network/server errors, not validation errors
        if (error?.response?.status >= 500 || !error?.response) {
          Alert.alert("Error", errorMessage || "Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <LayoutComponent
      hasFooter={isWeb}
      hasHeader
      scrollable={!isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
    >
      <KeyBoardWrapper>
        <View style={[globalStyles.pt_0, isWeb && webStyles.contentWidth]}>
          <View style={globalStyles.profilePictureContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("@/assets/default_user_profile.png")
              }
              style={globalStyles.profileImage}
            />
          </View>
          {/* PHONE SECTION */}
          <View style={globalStyles.profileInputContainer}>
            <FontAwesome name="phone" size={32} style={globalStyles.userInputLabelIcon} />

            <View style={{ flex: 1, paddingLeft: 14 }}>
              <View style={styles.headingRow}>
                <View style={styles.labelWithTick}>
                  <Text style={globalStyles.userInputLabel}>Phone</Text>
                  {isPhoneVerified && (
                    <FontAwesome
                      name="check-circle"
                      size={18}
                      color={colors.primary}
                      style={styles.tickIcon}
                    />
                  )}
                </View>

                {!isPhoneVerified && localPhone && !phoneError && !showChangePhone && (
                  <TouchableOpacity onPress={handleVerifyPhone}>
                    <Text style={globalStyles.verify}>verify</Text>
                  </TouchableOpacity>
                )}

                {isPhoneVerified && (
                  <TouchableOpacity onPress={() => setShowChangePhone(!showChangePhone)}>
                    <Text style={globalStyles.verify}>
                      {showChangePhone ? "cancel" : "edit"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Current Phone */}
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryPickerContainer}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withCallingCode
                    withCallingCodeButton
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      setCallingCode(country.callingCode[0] || "44");
                    }}
                  />
                </View>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter phone number"
                  value={localPhone}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  editable={!isPhoneVerified && !showChangePhone}
                />
              </View>

              {phoneError && (
                <Text style={globalStyles.errorText}>{phoneError}</Text>
              )}

              {/* Change Phone */}
              {showChangePhone && (
                <>
                  <Text style={styles.changeLabel}>New Phone Number</Text>

                  <View style={styles.phoneInputContainer}>
                    <View style={styles.countryPickerContainer}>
                      <CountryPicker
                        countryCode={newCountryCode}
                        withFilter
                        withCallingCode
                        withCallingCodeButton
                        onSelect={(country) => {
                          setNewCountryCode(country.cca2 || "GB");
                          setNewCallingCode(country.callingCode[0] || "44");
                        }}
                      />
                    </View>

                    <TextInput
                      style={styles.phoneInput}
                      placeholder="New phone number"
                      value={newLocalPhone}
                      onChangeText={(text) => {
                        setNewLocalPhone(text);
                        handleNewPhoneChange(`+${newCallingCode}${text}`);
                      }}
                      keyboardType="phone-pad"
                    />
                  </View>

                  {newPhoneError && (
                    <Text style={globalStyles.errorText}>{newPhoneError}</Text>
                  )}

                  {newLocalPhone && !newPhoneError && (
                    <TouchableOpacity
                      onPress={handleVerifyPhone}
                      style={styles.primaryVerifyButton}
                    >
                      <Text style={styles.primaryVerifyText}>verify new phone</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>

          {/* EMAIL SECTION */}
          <View style={globalStyles.profileInputContainer}>
            <FontAwesome name="envelope-o" size={28} style={globalStyles.userInputLabelIcon} />

            <View style={{ flex: 1, paddingLeft: 14 }}>
              <View style={styles.headingRow}>
                <View style={styles.labelWithTick}>
                  <Text style={globalStyles.userInputLabel}>Email</Text>
                  {isEmailVerified && (
                    <FontAwesome
                      name="check-circle"
                      size={16}
                      color={colors.primary}
                      style={styles.tickIcon}
                    />
                  )}
                </View>

                {!isEmailVerified && email && !emailError && !showChangeEmail && (
                  <TouchableOpacity onPress={handleVerifyEmail}>
                    <Text style={globalStyles.verify}>verify</Text>
                  </TouchableOpacity>
                )}

                {isEmailVerified && (
                  <TouchableOpacity onPress={() => setShowChangeEmail(!showChangeEmail)}>
                    <Text style={globalStyles.verify}>
                      {showChangeEmail ? "cancel" : "edit"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <CustomTextInput
                          containerStyle={emailError
                            ? [globalStyles.userInputContainer, globalStyles.errorInput] as any
                            : globalStyles.userInputContainer}
                          TextStyle={emailError
                            ? [globalStyles.input, globalStyles.errorInput] as any
                            : globalStyles.input}
                          placeholder="email"
                          value={email}
                          onPress={() => {}}
                          setValue={(value) => {
                            handleEmailChange(value);
                            if (emailError) setEmailError(null);
                          } }
                          keyboardType="email-address"
                          editable={!isEmailVerified && !showChangeEmail}
                           />

              {emailError && (
                <Text style={globalStyles.errorText}>{emailError}</Text>
              )}

              {showChangeEmail && (
                <>
                  <Text style={styles.changeLabel}>New Email Address</Text>
                  <CustomTextInput
                              containerStyle={newEmailError
                                ? [globalStyles.userInputContainer, globalStyles.errorInput] as any
                                : globalStyles.userInputContainer}
                              TextStyle={newEmailError
                                ? [globalStyles.input, globalStyles.errorInput] as any
                                : globalStyles.input}
                              placeholder="new email"
                              value={newEmail}
                              onPress={() => {} }
                              setValue={(value) => {
                                handleNewEmailChange(value);
                                if (newEmailError) setNewEmailError(null);
                              } }
                              keyboardType="email-address" 
                                  />

                  {newEmailError && (
                    <Text style={globalStyles.errorText}>{newEmailError}</Text>
                  )}

                  {newEmail && !newEmailError && (
                    <TouchableOpacity
                      onPress={handleVerifyEmail}
                      style={styles.primaryVerifyButton}
                    >
                      <Text style={styles.primaryVerifyText}>verify new email</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>

          {isWeb ? (
            <View style={webStyles.buttonRow}>
              <Button
                primary={false}
                title="Cancel"
                onPress={() => redirectToPage(containers.userProfileScreen)}
                style={webStyles.buttonHalf}
              />
              <Button onPress={handleSave} title="Save" style={webStyles.buttonHalf} />
            </View>
          ) : (
            <View>
              {/* <Button onPress={handleSave} title="Save" /> */}
            </View>
          )}
        </View>
      
      </KeyBoardWrapper>
    </LayoutComponent>
  );
};

export default EditAccountInformationScreen;

const styles = StyleSheet.create({
  changeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  verifyButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
   primaryVerifyButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },

  primaryVerifyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
  },
  labelWithTick: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, 
  },

  tickIcon: {
    marginTop: 3, 
  },

  phoneInputContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  paddingHorizontal: 8,
  marginTop: 6,
},

phoneInput: {
  flex: 1,
  paddingVertical: 10,
  fontSize: 16,
},

countryPickerContainer: {
  marginRight: 8,
},

});

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "70%",
    alignSelf: "center",
  },
  buttonRow: {
    width: "70%",
    alignSelf: "center",
    flexDirection: "row",
    columnGap: 16,
  },
  buttonHalf: {
    flex: 1,
  },
 

});