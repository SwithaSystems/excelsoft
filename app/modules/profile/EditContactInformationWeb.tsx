import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, Platform, Alert, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import { UserAPI } from "@/services/userService";
import { TwilioApi } from "@/services/twilioService";
import { showErrorAlert } from "@/utilities/showErrorAlert";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import { isValidEmail, isValidPhoneNumber } from "@/utilities/validations";
import colors from "@/constants/colors";
import { setUserData } from "@/store/slices/userSlice";
import * as SecureStore from "expo-secure-store";
import { FontAwesome } from "@expo/vector-icons";

const EDIT_CONTACT_INFORMATION_WEB_SCREEN_TITLE = "Edit Contact Information";

const editContactInformationWebScreen = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const isWeb = Platform.OS === "web";

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

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
  const [loading, setLoading] = useState(false);

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : null;
  const FooterComponent = isWeb ? <FooterWeb /> : null;

  // Web-only enforcement: redirect if not web
  useEffect(() => {
    if (!isWeb) {
      redirectToPage(containers.userProfileScreen);
    }
  }, [isWeb]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userData) return;

      try {
        const userId = userData._id || userData.id;
        if (!userId) return;

        setUserId(userId);
        const response = await UserAPI.getUserById(userId);
        
        if (response?.data) {
          setPhone(response.data.phone || "");
          setEmail(response.data.email || "");
          setIsPhoneVerified(!!response.data.isPhoneVerified);
          setIsEmailVerified(!!response.data.isEmailVerified);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, [userData]);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    const error = isValidPhoneNumber(value);
    setPhoneError(value.trim() ? error : null);
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
      const phoneToVerify = showChangePhone ? newPhone : phone;
      const hasError = showChangePhone ? newPhoneError : phoneError;

      if (!phoneToVerify || hasError) {
        showErrorAlert({
          title: "Error",
          message: "Please enter a valid phone number",
        });
        return;
      }

      if (!isPhoneVerified) {
        const res = await TwilioApi.sendOtp({ phone: phoneToVerify });
        if (
          res?.status === 201 &&
          res.data?.status === "pending"
        ) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_editAccount: phoneToVerify,
            verificationType: "phone",
            from: "first_add_phone",
            userId: userId,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          showErrorAlert({
            title: "Error",
            message: errorMsg,
          });
        }
      } else if (showChangePhone) {
        if (!email || !isEmailVerified) {
          showErrorAlert({
            title: "Error",
            message: "You need a verified email to change your phone number",
          });
          return;
        }
        const res = await TwilioApi.sendOtp_Email({ email });
        if (res?.status === 201 && res?.data?.success) {
          redirectToPage(containers.verificationScreen, {
            email_editAccount: email,
            verificationType: "email",
            from: "change_phone",
            newPhone: phoneToVerify,
            userId: userId,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          showErrorAlert({
            title: "Error",
            message: errorMsg,
          });
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to send verification code. Please try again.";
      showErrorAlert({
        title: "Error",
        message: errorMsg,
      });
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const emailToVerify = showChangeEmail ? newEmail : email;
      const hasError = showChangeEmail ? newEmailError : emailError;

      if (!emailToVerify || hasError) {
        showErrorAlert({
          title: "Error",
          message: "Please enter a valid email address",
        });
        return;
      }
      if (!isEmailVerified) {
        const res = await TwilioApi.sendOtp_Email({ email: emailToVerify });
        if (res?.status === 201 && res?.data?.success) {
          redirectToPage(containers.verificationScreen, {
            email_editAccount: emailToVerify,
            verificationType: "email",
            from: "first_add_email",
            userId: userId,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          showErrorAlert({
            title: "Error",
            message: errorMsg,
          });
        }
      } else if (showChangeEmail) {
        if (!phone || !isPhoneVerified) {
          showErrorAlert({
            title: "Error",
            message: "You need a verified phone to change your email",
          });
          return;
        }
        const res = await TwilioApi.sendOtp({ phone });
        if (
          res?.status === 201 &&
          res.data?.status === "pending"
        ) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_editAccount: phone,
            verificationType: "phone",
            from: "change_email",
            newEmail: emailToVerify,
            userId: userId,
          });
        } else {
          const errorMsg = res?.data?.message || res?.message || "Failed to send OTP. Please try again.";
          console.error("OTP send failed:", res);
          showErrorAlert({
            title: "Error",
            message: errorMsg,
          });
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to send verification code. Please try again.";
      showErrorAlert({
        title: "Error",
        message: errorMsg,
      });
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    let hasChanges = false;

    if (!isPhoneVerified && phone && !phoneError) {
      formData.append("phone", phone);
      hasChanges = true;
    }

    if (!isEmailVerified && email && !emailError) {
      formData.append("email", email);
      hasChanges = true;
    }

    if (!hasChanges) {
      showErrorAlert({
        title: "No Changes",
        message: "All contacts are verified or no changes made",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await UserAPI.userEditContact(userId, formData);
      if (response?.data?.user) {
        dispatch(setUserData(response.data.user));
        await SecureStore.setItemAsync("user", JSON.stringify(response.data.user));
        showErrorAlert({
          title: "Success",
          message: "Profile updated successfully",
        });
        redirectToPage(containers.userProfileScreen);
      }
    } catch (error: any) {
      console.error("Save error:", error);
      showErrorAlert({
        title: "Error",
        message: error?.response?.data?.message || error?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    redirectToPage(containers.homeScreen);
  };

  // Don't render on mobile
  if (!isWeb) {
    return null;
  }

  return (
    <LayoutComponent
      scrollable={false}
      hasHeader
      hasFooter={isWeb}
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent || undefined}
      hasSidebar={isWeb}
      userSidebar={true}
    >
      <KeyBoardWrapper>
        <ScrollView>
          <View
            style={[
              globalStyles.pt_0,
              isWeb && webStyles.contentWidth,
            ]}
          >
            {/* PHONE SECTION */}
            <View style={globalStyles.profileInputContainer}>
              <FontAwesome name="phone" size={32} style={globalStyles.userInputLabelIcon} />
              <View style={{ flex: 1, paddingLeft: 14 }}>
                <View style={webStyles.labelRow}>
                  <View style={webStyles.labelWithTick}>
                    <Text style={globalStyles.userInputLabel}>Phone</Text>
                    {isPhoneVerified && (
                      <FontAwesome name="check-circle" size={18} color={colors.primary} style={webStyles.tickIcon} />
                    )}
                  </View>
                </View>
                <View style={webStyles.inputWithLinkContainer}>
                  <CustomTextInput
                    containerStyle={[globalStyles.userInputContainer, webStyles.inputContainer] as any}
                    TextStyle={[
                      globalStyles.input,
                      webStyles.inputWithLink,
                      (!isPhoneVerified && phone && !phoneError && !showChangePhone) || 
                      (isPhoneVerified && !showChangePhone) || 
                      (isPhoneVerified && showChangePhone) ? webStyles.inputWithRightPadding : {}
                    ] as any}
                    placeholder="phone number"
                    value={phone}
                    onPress={() => {}}
                    setValue={handlePhoneChange}
                    keyboardType="phone-pad"
                    editable={!isPhoneVerified && !showChangePhone}
                  />
                  {!isPhoneVerified && phone && !phoneError && !showChangePhone && (
                    <TouchableOpacity 
                      onPress={handleVerifyPhone}
                      style={webStyles.linkInsideField}
                    >
                      <Text style={webStyles.linkText}>verify</Text>
                    </TouchableOpacity>
                  )}
                  {isPhoneVerified && !showChangePhone && (
                    <TouchableOpacity 
                      onPress={() => setShowChangePhone(!showChangePhone)}
                      style={webStyles.linkInsideField}
                    >
                      <Text style={webStyles.linkText}>edit</Text>
                    </TouchableOpacity>
                  )}
                  {isPhoneVerified && showChangePhone && (
                    <TouchableOpacity 
                      onPress={() => setShowChangePhone(!showChangePhone)}
                      style={webStyles.linkInsideField}
                    >
                      <Text style={webStyles.linkText}>cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {phoneError && <Text style={globalStyles.errorText}>{phoneError}</Text>}

                {showChangePhone && (
                  <>
                    <Text style={webStyles.changeLabel}>New Phone Number</Text>
                    <View style={webStyles.inputWithLinkContainer}>
                      <CustomTextInput
                        containerStyle={[globalStyles.userInputContainer, webStyles.inputContainer] as any}
                        TextStyle={[
                          globalStyles.input,
                          webStyles.inputWithLink,
                          newPhone && !newPhoneError ? webStyles.inputWithRightPadding : {}
                        ] as any}
                        placeholder="new phone number"
                        value={newPhone}
                        onPress={() => {}}
                        setValue={handleNewPhoneChange}
                        keyboardType="phone-pad"
                      />
                      {newPhone && !newPhoneError && (
                        <TouchableOpacity 
                          onPress={handleVerifyPhone}
                          style={webStyles.linkInsideField}
                        >
                          <Text style={webStyles.linkText}>verify</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {newPhoneError && <Text style={globalStyles.errorText}>{newPhoneError}</Text>}
                  </>
                )}
              </View>
            </View>

            {/* EMAIL SECTION */}
            <View style={globalStyles.profileInputContainer}>
              <FontAwesome name="envelope-o" size={28} style={globalStyles.userInputLabelIcon} />

              <View style={{ flex: 1, paddingLeft: 14 }}>
                <View style={webStyles.labelRow}>
                  <View style={webStyles.labelWithTick}>
                    <Text style={globalStyles.userInputLabel}>Email</Text>
                    {isEmailVerified && (
                      <FontAwesome
                        name="check-circle"
                        size={16}
                        color={colors.primary}
                        style={webStyles.tickIcon}
                      />
                    )}
                  </View>
                </View>

                <View style={webStyles.inputWithLinkContainer}>
                  <CustomTextInput
                    containerStyle={[globalStyles.userInputContainer, webStyles.inputContainer] as any}
                    TextStyle={[
                      globalStyles.input,
                      webStyles.inputWithLink,
                      (!isEmailVerified && email && !emailError && !showChangeEmail) || 
                      (isEmailVerified && !showChangeEmail) || 
                      (isEmailVerified && showChangeEmail) ? webStyles.inputWithRightPadding : {}
                    ] as any}
                    placeholder="email"
                    value={email}
                    onPress={() => {}}
                    setValue={handleEmailChange}
                    keyboardType="email-address"
                    editable={!isEmailVerified && !showChangeEmail}
                  />
                  {!isEmailVerified && email && !emailError && !showChangeEmail && (
                    <TouchableOpacity 
                      onPress={handleVerifyEmail}
                      style={webStyles.linkInsideField}
                    >
                      <Text style={webStyles.linkText}>verify</Text>
                    </TouchableOpacity>
                  )}
                  {isEmailVerified && !showChangeEmail && (
                    <TouchableOpacity 
                      onPress={() => setShowChangeEmail(!showChangeEmail)}
                      style={webStyles.linkInsideField}
                    >
                      <Text style={webStyles.linkText}>edit</Text>
                    </TouchableOpacity>
                  )}
                  {isEmailVerified && showChangeEmail && (
                    <TouchableOpacity 
                      onPress={() => setShowChangeEmail(!showChangeEmail)}
                      style={webStyles.linkInsideField}
                    >
                      <Text style={webStyles.linkText}>cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {emailError && <Text style={globalStyles.errorText}>{emailError}</Text>}

                {showChangeEmail && (
                  <>
                    <Text style={webStyles.changeLabel}>New Email Address</Text>
                    <View style={webStyles.inputWithLinkContainer}>
                      <CustomTextInput
                        containerStyle={[globalStyles.userInputContainer, webStyles.inputContainer] as any}
                        TextStyle={[
                          globalStyles.input,
                          webStyles.inputWithLink,
                          newEmail && !newEmailError ? webStyles.inputWithRightPadding : {}
                        ] as any}
                        placeholder="new email"
                        value={newEmail}
                        onPress={() => {}}
                        setValue={handleNewEmailChange}
                        keyboardType="email-address"
                      />
                      {newEmail && !newEmailError && (
                        <TouchableOpacity
                          onPress={handleVerifyEmail}
                          style={webStyles.linkInsideField}
                        >
                          <Text style={webStyles.linkText}>verify</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {newEmailError && (
                      <Text style={globalStyles.errorText}>{newEmailError}</Text>
                    )}
                  </>
                )}
              </View>
            </View>

            <View style={webStyles.inlineButtonRow}>
              <Button
                primary={false}
                title="Cancel"
                onPress={handleCancel}
                style={webStyles.cancelButton}
                textStyle={webStyles.cancelButtonText}
                disabled={loading}
              />
              <Button
                title="Save"
                onPress={handleSave}
                style={webStyles.saveButton}
                textStyle={webStyles.saveButtonText}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyBoardWrapper>
    </LayoutComponent>
  );
};

export default editContactInformationWebScreen;

const webStyles = StyleSheet.create({
  contentWidth: {
    width: "70%",
    alignSelf: "center",
  },

  inlineButtonRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },

  /* SAVE (Primary) */
  saveButton: {
    minWidth: 160,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  cancelButton: {
    minWidth: 140,
    height: 44,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "500",
  },

  changeLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
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
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelWithTick: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tickIcon: {
    marginTop: 3, 
  },
  inputWithLinkContainer: {
    position: "relative",
    width: "100%",
  },
  inputContainer: {
    position: "relative",
  },
  inputWithLink: {
    width: "100%",
  },
  inputWithRightPadding: {
    paddingRight: 80,
  },
  linkInsideField: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    paddingHorizontal: 4,
  },
  linkText: {
    fontSize: 12,
    color: colors.blue,
    textDecorationLine: "underline",
  },
});
