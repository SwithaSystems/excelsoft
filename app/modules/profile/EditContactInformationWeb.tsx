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
import CountryPicker, { CountryCode, FlagType } from "react-native-country-picker-modal";
import { getAllCountries } from "react-native-country-picker-modal";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const EDIT_CONTACT_INFORMATION_WEB_SCREEN_TITLE = "Edit Contact Information";

const CALLING_CODE_TO_CCA2: Record<string, CountryCode> = {
  "1": "US", "7": "RU", "20": "EG", "27": "ZA", "30": "GR", "31": "NL", "32": "BE", "33": "FR",
  "34": "ES", "36": "HU", "39": "IT", "40": "RO", "41": "CH", "43": "AT", "44": "GB", "45": "DK",
  "46": "SE", "47": "NO", "48": "PL", "49": "DE", "51": "PE", "52": "MX", "53": "CU", "54": "AR",
  "55": "BR", "56": "CL", "57": "CO", "58": "VE", "60": "MY", "61": "AU", "62": "ID", "63": "PH",
  "64": "NZ", "65": "SG", "66": "TH", "81": "JP", "82": "KR", "84": "VN", "86": "CN", "90": "TR",
  "91": "IN", "92": "PK", "93": "AF", "94": "LK", "95": "MM", "98": "IR", "212": "MA", "213": "DZ",
  "216": "TN", "218": "LY", "220": "GM", "221": "SN", "222": "MR", "223": "ML", "224": "GN",
  "225": "CI", "226": "BF", "227": "NE", "228": "TG", "229": "BJ", "230": "MU", "231": "LR",
  "232": "SL", "233": "GH", "234": "NG", "235": "TD", "236": "CF", "237": "CM", "238": "CV",
  "239": "ST", "240": "GQ", "241": "GA", "242": "CG", "243": "CD", "244": "AO", "245": "GW",
  "246": "IO", "248": "SC", "249": "SD", "250": "RW", "251": "ET", "252": "SO", "253": "DJ",
  "254": "KE", "255": "TZ", "256": "UG", "257": "BI", "258": "MZ", "260": "ZM", "261": "MG",
  "262": "RE", "263": "ZW", "264": "NA", "265": "MW", "266": "LS", "267": "BW", "268": "SZ",
  "269": "KM", "290": "SH", "291": "ER", "297": "AW", "298": "FO", "299": "GL", "350": "GI",
  "351": "PT", "352": "LU", "353": "IE", "354": "IS", "355": "AL", "356": "MT", "357": "CY",
  "358": "FI", "359": "BG", "370": "LT", "371": "LV", "372": "EE", "373": "MD", "374": "AM",
  "375": "BY", "376": "AD", "377": "MC", "378": "SM", "379": "VA", "380": "UA", "381": "RS",
  "382": "ME", "383": "XK", "385": "HR", "386": "SI", "387": "BA", "389": "MK", "420": "CZ",
  "421": "SK", "423": "LI", "500": "FK", "501": "BZ", "502": "GT", "503": "SV", "504": "HN",
  "505": "NI", "506": "CR", "507": "PA", "508": "PM", "509": "HT", "590": "GP", "591": "BO",
  "592": "GY", "593": "EC", "594": "GF", "595": "PY", "596": "MQ", "597": "SR", "598": "UY",
  "599": "CW", "670": "TL", "672": "NF", "673": "BN", "674": "NR", "675": "PG", "676": "TO",
  "677": "SB", "678": "VU", "679": "FJ", "680": "PW", "681": "WF", "682": "CK", "683": "NU",
  "685": "WS", "686": "KI", "687": "NC", "688": "TV", "689": "PF", "690": "TK", "691": "FM",
  "692": "MH", "850": "KP", "852": "HK", "853": "MO", "855": "KH", "856": "LA", "858": "TW",
  "880": "BD", "886": "TW", "960": "MV", "961": "LB", "962": "JO", "963": "SY", "964": "IQ",
  "965": "KW", "966": "SA", "967": "YE", "968": "OM", "970": "PS", "971": "AE", "972": "IL",
  "973": "BH", "974": "QA", "975": "BT", "976": "MN", "977": "NP", "992": "TJ", "993": "TM",
  "994": "AZ", "995": "GE", "996": "KG", "998": "UZ",
};

async function getCountryCodeFromCallingCode(callingCode: string): Promise<CountryCode | null> {
  try {
    const countries = await getAllCountries("emoji" as FlagType);
    const country = countries?.find((c: any) => c.callingCode?.[0] === callingCode);
    return country ? (country.cca2 as CountryCode) : null;
  } catch {
    return null;
  }
}

const editContactInformationWebScreen = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;


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

  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");
  const [localPhone, setLocalPhone] = useState("");

  const [newCountryCode, setNewCountryCode] = useState<CountryCode>("GB");
  const [newCallingCode, setNewCallingCode] = useState("44");
  const [newLocalPhone, setNewLocalPhone] = useState("");


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
          const fullPhone = response.data.phone || "";
          if (fullPhone.startsWith("+")) {
            const number = fullPhone.slice(1);
            let extractedCallingCode = "";
            let extractedLocal = number;
            let resolvedCountryCode: CountryCode | null = null;

            try {
              const countries = await getAllCountries("emoji" as FlagType);
              const foundCountry = countries
                ?.sort((a: any, b: any) => (b.callingCode[0]?.length ?? 0) - (a.callingCode[0]?.length ?? 0))
                ?.find((c: any) => fullPhone.startsWith(`+${c.callingCode[0]}`));

              if (foundCountry) {
                extractedCallingCode = foundCountry.callingCode[0];
                extractedLocal = fullPhone.replace(`+${extractedCallingCode}`, "").trim();
                resolvedCountryCode = foundCountry.cca2 as CountryCode;
                setCountryCode(resolvedCountryCode);
              }
            } catch {
              // Fallback when getAllCountries fails (e.g. on web)
            }

            // Fallback heuristic if no country matched or getAllCountries failed
            if (!extractedCallingCode && number.length > 0) {
              const code1 = number.slice(0, 1);
              const code2 = number.slice(0, 2);
              const code3 = number.slice(0, 3);
              if (number.length > 10) {
                extractedCallingCode = code2;
              } else if (number.length > 9) {
                extractedCallingCode = code1;
              } else {
                extractedCallingCode = code3;
              }
              extractedLocal = number.slice(extractedCallingCode.length);
            }

            if (extractedCallingCode) {
              setCallingCode(extractedCallingCode);
              setLocalPhone(extractedLocal);
              // Ensure country picker shows saved country (when not already set from foundCountry)
              if (!resolvedCountryCode) {
                const cca2 = await getCountryCodeFromCallingCode(extractedCallingCode);
                if (cca2) {
                  setCountryCode(cca2);
                } else if (CALLING_CODE_TO_CCA2[extractedCallingCode]) {
                  setCountryCode(CALLING_CODE_TO_CCA2[extractedCallingCode]);
                }
              }
            }
          }
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
    // setPhone(value);
    const error = isValidPhoneNumber(value);
    setPhoneError(value.trim() ? error : null);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const isValid = isValidEmail(value);
    setEmailError(value.trim() && !isValid ? "Please enter a valid email address" : null);
  };

  const handleNewPhoneChange = (value: string) => {
    // setNewPhone(value);
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
      const local = showChangePhone ? newLocalPhone : localPhone;
      const calling = showChangePhone ? newCallingCode : callingCode;

      const phoneToVerify = `+${calling}${local}`;
     // 🔹 Duplicate check before sending OTP
      try {
        const existingUser = await UserAPI.getUserByPhonenumber(phoneToVerify);

        if (existingUser?.data) {
          const existingUserId = existingUser.data._id || existingUser.data.id;

          // ❗ If phone belongs to another user → block
          if (existingUserId !== userId) {
            if (showChangePhone) {
              setNewPhoneError("This phone number is already registered");
            } else {
              setPhoneError("This phone number is already registered");
            }
            return; // 🚫 Stop here
          }
        }
      } catch (err: any) {
        // 404 means phone doesn't exist → safe to continue
      }


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
        if (!localPhone || !isPhoneVerified) {
          showErrorAlert({
            title: "Error",
            message: "You need a verified phone to change your email",
          });
          return;
        }
        const fullPhone = `+${callingCode}${localPhone}`;
        const res = await TwilioApi.sendOtp({ phone: fullPhone });
        if (
          res?.status === 201 &&
          res.data?.status === "pending"
        ) {
          redirectToPage(containers.verificationScreen, {
            phoneNumber_editAccount: fullPhone,
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

    if (!isPhoneVerified && localPhone && !phoneError) {
      const fullPhone = `+${callingCode}${localPhone}`;
      formData.append("phone", fullPhone);
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
              isMobileWeb && webStyles.mobileWebContentWidth,
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
                <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>

                  {/* Country Picker */}
                 <View style={webStyles.countryPickerContainer}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withCallingCode
                    withCallingCodeButton
                    onSelect={(country) => {
                      setCountryCode(country.cca2);
                      setCallingCode(country.callingCode[0]);
                    }}
                  />
                  </View>

                  <View style={{ flex: 1 }}>
                    <CustomTextInput
                      containerStyle={[globalStyles.userInputContainer, webStyles.inputContainer] as any}
                      TextStyle={[globalStyles.input, webStyles.inputWithLink] as any}
                      placeholder="phone number"
                      value={localPhone}
                      onPress={() => {}}
                      setValue={(text) => {
                        setLocalPhone(text);
                        handlePhoneChange(`+${callingCode}${text}`);
                      }}
                      keyboardType="phone-pad"
                      editable={!isPhoneVerified && !showChangePhone}
                    />
                  </View>
                </View>

                  {!isPhoneVerified && localPhone && !phoneError && !showChangePhone && (
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

                    <View
                      style={[
                        webStyles.phoneRow,
                        isMobileWeb && webStyles.mobileWebPhoneRow,
                        { alignItems: "stretch" },
                      ]}
                    >

                    <View style={[webStyles.countryPickerContainer, { justifyContent: "center" }]}>
                      <CountryPicker
                        countryCode={newCountryCode}
                        withFilter
                        withCallingCode
                        withCallingCodeButton
                        onSelect={(country) => {
                          setNewCountryCode(country.cca2);
                          setNewCallingCode(country.callingCode[0]);
                        }}
                      />
                      </View>

                      {/* <Text style={{ fontSize: 16, fontWeight: "500" }}>
                        +{newCallingCode}
                      </Text> */}

                    <View style={webStyles.phoneInputWrapper}>
                      <CustomTextInput
                        containerStyle={[globalStyles.userInputContainer, webStyles.inputContainer] as any}
                        TextStyle={[globalStyles.input, webStyles.inputWithLink] as any}
                        placeholder="new phone number"
                        value={newLocalPhone}
                        onPress={() => {}}
                        setValue={(text) => {
                          setNewLocalPhone(text);
                          handleNewPhoneChange(`+${newCallingCode}${text}`);
                        }}
                        keyboardType="phone-pad"
                      />
                      </View>
                    </View>

                      {newLocalPhone && !newPhoneError && (
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

            {/* <View style={webStyles.inlineButtonRow}>
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
            </View> */}
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

  phoneRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
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
    width: "100%",
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
  mobileWebContentWidth: {
    width: "94%",
    alignSelf: "center",
  },
  countryPickerContainer: {
    height: 42,                 // same as input
    minWidth: 90,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  countryPickerMobileWeb: {
    minWidth: 90,
  },
  mobileWebPhoneRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  phoneInputWrapper: {
    flex: 1,
    minWidth: 0,
  },

  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    overflow: "hidden",
    height: 48,
    backgroundColor: colors.lightgrey,
    width: "100%",
  },

  phoneInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    backgroundColor: colors.lightgrey,
  },
});
