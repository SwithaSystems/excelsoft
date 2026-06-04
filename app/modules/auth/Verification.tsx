import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import styles from "./VerifcationStyles";
import Header from "../../components/Header";
import { TwilioApi } from "@/services/twilioService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage, clearNavigationStack } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { authService } from "@/services/auth.service";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { VERIFICATION_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/userSlice";
import { UserAPI } from "@/services/userService";
import * as SecureStore from "expo-secure-store";
import useConfirmationAlert from "@/app/components/commonComponents/useConfirmationAlert";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const verificationScreen = () => {
  const { showAlert, confirmationModal } = useConfirmationAlert();
  const isWeb = Platform.OS === "web";
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;
  const isDesktopWeb = isWeb && !isMobileWeb;
  const editContactScreen = isWeb ? containers.editContactInformationWebScreen : containers.editAccountInformationScreen;
  const dispatch = useDispatch();

  const {
    userData,
    from,
    phoneNumber_forgetPwd,
    phoneNumber_editAccount,
    email_editAccount,
    verificationType,
    newPhone,
    newEmail,
    userId,
    email_forgetPwd,
    intent,
  } = useLocalSearchParams();

  // `useLocalSearchParams()` can return `string | string[] | undefined`.
  // Normalize so comparisons like `intentValue === "recover"` are reliable.
  const fromValue = Array.isArray(from) ? from[0] : from;
  const intentValue = Array.isArray(intent) ? intent[0] : intent;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [parsedUserData, setParsedUserData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(30);
  const [resendCooldownKey, setResendCooldownKey] = useState(0);
  const inputRefs = useRef<TextInput[]>([]);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 30-second cooldown before Resend is allowed (matches backend)
  useEffect(() => {
    setResendCooldownSeconds(30);
    resendTimerRef.current = setInterval(() => {
      setResendCooldownSeconds((prev) => {
        if (prev <= 1) {
          if (resendTimerRef.current) clearInterval(resendTimerRef.current);
          resendTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, [resendCooldownKey]);

  // DEBUG: Log all params on mount
  useEffect(() => {
    ////console.log("=== VERIFICATION SCREEN DEBUG ===");
    ////console.log("from:", from);
    ////console.log("userData:", userData);
    ////console.log("phoneNumber_forgetPwd:", phoneNumber_forgetPwd);
    ////console.log("phoneNumber_editAccount:", phoneNumber_editAccount);
    ////console.log("email_editAccount:", email_editAccount);
    ////console.log("verificationType:", verificationType);
    ////console.log("newPhone:", newPhone);
    ////console.log("newEmail:", newEmail);
    ////console.log("userId:", userId);
    ////console.log("================================");
  }, []);

  useEffect(() => {
    ////console.log("=== useEffect triggered ===");
    ////console.log("from:", from);
    
    // Signup flow
    if (fromValue === "signup" && userData) {
      try {
        const parsed = JSON.parse(String(userData));
        ////console.log("Parsed userData:", parsed);
        setParsedUserData(parsed);
        if (parsed?.phone) {
          ////console.log("Setting phoneNumber from userData:", parsed.phone);
          setPhoneNumber(parsed.phone);
        }
        if (parsed?.email) {
          ////console.log("Setting email from userData:", parsed.email);
          setEmail(parsed.email);
        }
      } catch (e) {
        ////console.error("Invalid JSON in userData", e);
        showAlert("Error", "Invalid user data. Please try signing up again.");
      }
    }

    // Forgot password flow
    if (fromValue === "forgotPassword" && phoneNumber_forgetPwd) {
      const phone = Array.isArray(phoneNumber_forgetPwd)
        ? phoneNumber_forgetPwd[0]
        : phoneNumber_forgetPwd;
      ////console.log("Setting phoneNumber from forgotPassword:", phone);
      setPhoneNumber(phone);
    }
    if (fromValue === "forgotPassword" && email_forgetPwd) {
  const emailVal = Array.isArray(email_forgetPwd)
    ? email_forgetPwd[0]
    : email_forgetPwd;

  ////console.log("Setting email from forgotPassword:", emailVal);
  setEmail(emailVal);
}

    // FIRST TIME ADDING PHONE - OTP sent to phone
    if (fromValue === "first_add_phone") {
      ////console.log("Flow: first_add_phone");
      ////console.log("phoneNumber_editAccount:", phoneNumber_editAccount);
      
      if (phoneNumber_editAccount) {
        const phone = Array.isArray(phoneNumber_editAccount)
          ? phoneNumber_editAccount[0]
          : phoneNumber_editAccount;
        ////console.log("Setting phoneNumber:", phone);
        setPhoneNumber(phone);
      } else {
        ////console.warn("phoneNumber_editAccount is missing!");
      }
    }

    // FIRST TIME ADDING EMAIL - OTP sent to email
    if (fromValue === "first_add_email") {
      //console.log("Flow: first_add_email");
      //console.log("email_editAccount:", email_editAccount);
      
      if (email_editAccount) {
        const emailVal = Array.isArray(email_editAccount)
          ? email_editAccount[0]
          : email_editAccount;
        //console.log("Setting email:", emailVal);
        setEmail(emailVal);
      } else {
        //console.warn("email_editAccount is missing!");
      }
    }

    // CHANGING PHONE - OTP sent to email (for verification)
    if (fromValue === "change_phone") {
      //console.log("Flow: change_phone");
      //console.log("email_editAccount:", email_editAccount);
      //console.log("newPhone:", newPhone);
      
      // Set existing email for OTP verification
      if (email_editAccount) {
        const emailVal = Array.isArray(email_editAccount)
          ? email_editAccount[0]
          : email_editAccount;
        //console.log("Setting email for verification:", emailVal);
        setEmail(emailVal);
      } else {
        //console.warn("email_editAccount is missing for change_phone!");
      }
    }

    // CHANGING EMAIL - OTP sent to phone (for verification)
    if (fromValue === "change_email") {
      //console.log("Flow: change_email");
      //console.log("phoneNumber_editAccount:", phoneNumber_editAccount);
      //console.log("newEmail:", newEmail);
      
      // Set existing phone for OTP verification
      if (phoneNumber_editAccount) {
        const phone = Array.isArray(phoneNumber_editAccount)
          ? phoneNumber_editAccount[0]
          : phoneNumber_editAccount;
        //console.log("Setting phoneNumber for verification:", phone);
        setPhoneNumber(phone);
      } else {
        //console.warn("phoneNumber_editAccount is missing for change_email!");
      }
    }

    // Legacy edit contact flows (keeping for backward compatibility)
    if (phoneNumber_editAccount && !from) {
      const phone = Array.isArray(phoneNumber_editAccount)
        ? phoneNumber_editAccount[0]
        : phoneNumber_editAccount;
      //console.log("Setting phoneNumber (legacy):", phone);
      setPhoneNumber(phone);
    }

    if (email_editAccount && !from) {
      const emailVal = Array.isArray(email_editAccount)
        ? email_editAccount[0]
        : email_editAccount;
      //console.log("Setting email (legacy):", emailVal);
      setEmail(emailVal);
    }
  }, [
    from,
    userData,
    phoneNumber_forgetPwd,
    phoneNumber_editAccount,
    email_editAccount,
    newPhone,
    newEmail,
  ]);

  // DEBUG: Log state changes
  useEffect(() => {
    //console.log("Email state changed to:", email);
  }, [email]);

  useEffect(() => {
    //console.log("PhoneNumber state changed to:", phoneNumber);
  }, [phoneNumber]);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const showSuccessAlert = (title: string, message: string, onPress?: () => void) => {
    if (isWeb) {
      // For web, execute callback immediately after a short delay
      showAlert(title, message);
      if (onPress) {
        setTimeout(() => {
          onPress();
        }, 100);
      }
    } else {
      // For mobile, use standard alert with callback
      showAlert(
        title,
        message,
        [
          {
            text: "OK",
            onPress: onPress || (() => {}),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const showErrorAlertCustom = (title: string, message: string) => {
    showAlert(
      title,
      message,
      [{ text: "OK" }],
      { cancelable: false }
    );
  };

  const handleVerify = async () => {
    const OtpNumber = code.join("");

    if (!OtpNumber || OtpNumber.length < 6) {
      showErrorAlertCustom("Invalid Code", "Please enter a complete 6-digit verification code.");
      return;
    }

    //console.log("=== VERIFY DEBUG ===");
    //console.log("from:", from);
    //console.log("email:", email);
    //console.log("phoneNumber:", phoneNumber);
    //console.log("OtpNumber:", OtpNumber);
    //console.log("===================");

    setIsVerifying(true);

    try {
      let res;

      // SIGNUP OR FORGOT PASSWORD FLOW
      if (from === "signup" || from === "forgotPassword") {
        if (verificationType === "email") {
          //console.log("Verifying email OTP with:", { email, OtpNumber });
          res = await TwilioApi.verifyOtp_Email({ email, OtpNumber });
        } else {
          //console.log("Verifying phone OTP with:", { phoneNumber, OtpNumber });
          res = await TwilioApi.verifyOtp({ phoneNumber, OtpNumber });
        }

        const isVerified =
          res?.success === true ||
          res?.data?.success === true ||
          res === "verified successfully";

        if (!isVerified) {
          showErrorAlertCustom(
            "Invalid Verification Code", 
            "The code you entered is incorrect. Please check the code and try again, or request a new code."
          );
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        if (from === "forgotPassword") {
  showSuccessAlert(
    "Verification Successful",
    "Your identity has been verified. You can now reset your password.",
    () => {
      redirectToPage(containers.passwordResetScreen, {
        ...(phoneNumber ? { phoneNumber } : { email }),
      });
    }
  );
  return;
}

      if (fromValue === "signup") {
          if (!parsedUserData) {
            showErrorAlertCustom("Error", "User data is missing. Please try signing up again.");
            return;
          }

          const normalizedUserData = {
            ...parsedUserData,
            email: parsedUserData.email
              ? parsedUserData.email.trim().toLowerCase()
              : parsedUserData.email,
          };

          try {
          if (intentValue === "recover") {
              const response = await authService.recover({
                userData: normalizedUserData,
              });

              if (response?.access_token) {
                // 1) OTP verified successfully
                showSuccessAlert(
                  "Verification Successful",
                  "Your identity has been verified.",
                  () => {
                    // 2) Then show recovery success and redirect to Sign In.
                    showAlert(
                      "Account Recovered",
                      "Your account has been recovered successfully. You can now login to your account.",
                      [
                        {
                          text: "OK",
                          onPress: () => redirectToPage(containers.signInScreen),
                        },
                      ],
                      { cancelable: true }
                    );
                  }
                );
              } else {
                showErrorAlertCustom(
                  "Recovery Failed",
                  response?.message ||
                    "Unable to recover your account. Please try again."
                );
              }
            } else {
              const response = await authService.register({
                userData: normalizedUserData,
              });

              if (response?.access_token) {
                showSuccessAlert(
                  "Registration Successful!",
                  "Your account has been created successfully. Please sign in to continue.",
                  () => {
                    redirectToPage(containers.signInScreen);
                  }
                );
              } else {
                showErrorAlertCustom(
                  "Registration Failed",
                  response?.message ||
                    "Unable to create your account. Please try again."
                );
              }
            }
          } catch (registerError: any) {
            const data = registerError?.response?.data;

            // If signup failed because the account was soft-deleted,
            // transparently recover and avoid showing the registration error.
            if (
              (data?.code === "ACCOUNT_SOFT_DELETED" || data?.canRecover === true) &&
              parsedUserData
            ) {
              try {
                const response = await authService.recover({
                  userData: normalizedUserData,
                });

                if (response?.access_token) {
                  showSuccessAlert(
                    "Verification Successful",
                    "Your identity has been verified.",
                    () => {
                      showAlert(
                        "Account Recovered",
                        "Your account has been recovered successfully. You can now login to your account.",
                        [
                          {
                            text: "OK",
                            onPress: () =>
                              redirectToPage(containers.signInScreen),
                          },
                        ],
                        { cancelable: true }
                      );
                    }
                  );
                  return;
                }
              } catch (_) {
                // Fall through to the registration failed message
              }
            }

            const message =
              (Array.isArray(data?.message) ? data.message[0] : data?.message) ||
              registerError?.message ||
              "Failed to create account. Please try again.";
            showErrorAlertCustom("Registration Failed", message);
          }
        }
        return;
      }

      // FIRST TIME ADDING PHONE
      if (fromValue === "first_add_phone") {
        //console.log("Verifying first_add_phone with:", { phoneNumber, OtpNumber });
        res = await TwilioApi.verifyOtp({ phoneNumber, OtpNumber });
        const isVerified =
          res?.success === true ||
          res?.data?.success === true ||
          res === "verified successfully";

        if (!isVerified) {
          showErrorAlertCustom(
            "Invalid Verification Code", 
            "The code you entered is incorrect. Please check the code and try again, or request a new code."
          );
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        try {
          const formData = new FormData();
          formData.append("phone", phoneNumber);
          
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "phone" });

          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your phone number has been verified and added to your account.",
            () => clearNavigationStack(editContactScreen)
          );
        } catch (updateError: any) {
          //console.error("Failed to update phone:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }

      // FIRST TIME ADDING EMAIL
      if (fromValue === "first_add_email") {
        //console.log("Verifying first_add_email with:", { email, OtpNumber });
        res = await TwilioApi.verifyOtp_Email({ email, OtpNumber });
        const isVerified = res?.success === true || res?.data?.success === true;

        if (!isVerified) {
          showErrorAlertCustom(
            "Invalid Verification Code", 
            "The code you entered is incorrect. Please check the code and try again, or request a new code."
          );
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        try {
          const formData = new FormData();
          formData.append("email", email);
          
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "email" });

          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your email address has been verified and added to your account.",
            () => clearNavigationStack(editContactScreen)
          );
        } catch (updateError: any) {
          //console.error("Failed to update email:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }

      // CHANGING PHONE (OTP sent to email)
      if (fromValue === "change_phone") {
        //console.log("Verifying change_phone with:", { email, OtpNumber });
        res = await TwilioApi.verifyOtp_Email({ email, OtpNumber });
        const isVerified = res?.success === true || res?.data?.success === true;

        if (!isVerified) {
          showErrorAlertCustom(
            "Invalid Verification Code", 
            "The code you entered is incorrect. Please check the code and try again, or request a new code."
          );
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        try {
          const formData = new FormData();
          formData.append("phone", String(newPhone));
          
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "phone" });

          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your phone number has been updated and verified successfully.",
            () => clearNavigationStack(editContactScreen)
          );
        } catch (updateError: any) {
          //console.error("Failed to update phone:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }

      // CHANGING EMAIL (OTP sent to phone)
      if (fromValue === "change_email") {
        //console.log("Verifying change_email with:", { phoneNumber, OtpNumber });
        res = await TwilioApi.verifyOtp({ phoneNumber, OtpNumber });
        const isVerified =
          res?.success === true ||
          res?.data?.success === true ||
          res === "verified successfully";

        if (!isVerified) {
          showErrorAlertCustom(
            "Invalid Verification Code", 
            "The code you entered is incorrect. Please check the code and try again, or request a new code."
          );
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        try {
          const formData = new FormData();
          formData.append("email", String(newEmail));
          
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "email" });

          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your email address has been updated and verified successfully.",
            () => clearNavigationStack(editContactScreen)
          );
        } catch (updateError: any) {
          //console.error("Failed to update email:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }
    } catch (error: any) {
      //console.error("OTP Verification Failed", error);
      let errorMessage = "Verification failed. Please check your code and try again.";
      let errorTitle = "Verification Error";
      
      if (error?.response?.status === 400) {
        errorTitle = "Invalid or Expired Code";
        errorMessage = "The verification code you entered is either invalid or has expired. Please request a new code.";
      } else if (error?.response?.status === 404) {
        errorTitle = "Code Not Found";
        errorMessage = "No verification code found. Please request a new code.";
      } else if (error?.response?.status === 429) {
        errorTitle = "Too Many Attempts";
        errorMessage = "You have made too many verification attempts. Please wait a few minutes and try again.";
      } else if (error?.message?.toLowerCase().includes("network")) {
        errorTitle = "Network Error";
        errorMessage = "Unable to verify code due to network issues. Please check your connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showErrorAlertCustom(errorTitle, errorMessage);
      
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateContactError = (updateError: any) => {
    // console.error("Error details:", {
    //   message: updateError?.message,
    //   response: updateError?.response?.data,
    //   status: updateError?.response?.status,
    // });
    
    let errorMessage = "Failed to update your contact information. Please try again.";
    
    if (
      updateError?.message?.includes("Refresh token not available") ||
      updateError?.message?.includes("refresh token")
    ) {
      errorMessage = "Your session has expired. Please log in again.";
      showErrorAlertCustom("Session Expired", errorMessage);
      setTimeout(() => {
        redirectToPage(containers.signInScreen);
      }, 2000);
      return;
    }
    
    if (updateError?.response?.status === 500) {
      errorMessage =
        updateError?.response?.data?.message ||
        "A server error occurred. Please try again later or contact support.";
    } else if (updateError?.response?.data?.message) {
      errorMessage = updateError.response.data.message;
    } else if (updateError?.message) {
      errorMessage = updateError.message;
    }
    
    showErrorAlertCustom("Update Failed", errorMessage);
  };
 
  const handleResend = async () => {
    if (isResending) return;

    if (resendCooldownSeconds > 0) {
      const unit = resendCooldownSeconds === 1 ? "second" : "seconds";
      showErrorAlertCustom(
        "Please wait",
        `Wait ${resendCooldownSeconds} ${unit} before requesting for the new OTP.`
      );
      return;
    }

    ////console.log("=== RESEND DEBUG ===");
    ////console.log("from:", from);
    ////console.log("email state:", email);
    ////console.log("phoneNumber state:", phoneNumber);
    ////console.log("verificationType:", verificationType);
    ////console.log("===================");

    // Early validation - check if we have the required contact info
    if (from === "first_add_email" || from === "change_phone") {
      if (!email || email === "") {
        ////console.error("Email is empty! Cannot send OTP.");
        showErrorAlertCustom(
          "Missing Email",
          "Email address is not available. Please go back and try again."
        );
        return;
      }
    } else if (from === "first_add_phone" || from === "change_email") {
      if (!phoneNumber || phoneNumber === "") {
        ////console.error("Phone number is empty! Cannot send OTP.");
        showErrorAlertCustom(
          "Missing Phone Number",
          "Phone number is not available. Please go back and try again."
        );
        return;
      }
    } else {
      // Signup/forgot password flows
      if (verificationType === "email" && (!email || email === "")) {
        ////console.error("Email is empty for email verification!");
        showErrorAlertCustom(
          "Missing Email",
          "Email address is not available. Please go back and try again."
        );
        return;
      } else if (verificationType !== "email" && (!phoneNumber || phoneNumber === "")) {
        ////console.error("Phone number is empty for phone verification!");
        showErrorAlertCustom(
          "Missing Phone Number",
          "Phone number is not available. Please go back and try again."
        );
        return;
      }
    }

    setIsResending(true);
    try {
      if (from === "first_add_phone" || from === "change_email") {
        ////console.log("Resending OTP to phone:", phoneNumber);
        await TwilioApi.sendOtp({ phone: phoneNumber });
      } else if (from === "first_add_email" || from === "change_phone") {
        ////console.log("Resending OTP to email:", email);
        await TwilioApi.sendOtp_Email({ email: email });
      } else {
        if (verificationType === "email") {
          ////console.log("Resending OTP to email (signup/forgot):", email);
          await TwilioApi.sendOtp_Email({ email: email });
        } else {
          ////console.log("Resending OTP to phone (signup/forgot):", phoneNumber);
          await TwilioApi.sendOtp({ phone: phoneNumber });
        }
      }
      
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setResendCooldownKey((k) => k + 1);
      showSuccessAlert("Code Resent", "A new verification code has been sent successfully.");
    } catch (error: any) {
      ////console.error("Resend error:", error);
      let errorMessage = "Failed to resend code. Please try again.";
      
      if (error?.response?.status === 429) {
        errorMessage = "Too many resend requests. Please wait a few minutes before requesting a new code.";
      } else if (error?.message?.toLowerCase().includes("network")) {
        errorMessage = "Unable to resend code due to network issues. Please check your connection and try again.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showErrorAlertCustom("Resend Failed", errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <PageLayout
      hasFooter={false}
      hasHeader
      headerComponent={
        <Header
          headerText={VERIFICATION_SCREEN_TITLE}
          hideBackArrow={isWeb}
          headerStyle={isDesktopWeb ? styles.verificationHeaderStyle : isMobileWeb ? styles.verificationHeaderStyleMobileWeb : undefined}
          headerTitleStyle={isDesktopWeb ? styles.verificationHeaderTitle : isMobileWeb ? styles.verificationHeaderTitleMobileWeb : undefined}
        />
      }
    >
      <KeyBoardWrapper>
        <View
          style={[
            styles.contentContainer,
            isDesktopWeb && styles.contentContainerDesktop,
            isMobileWeb && styles.contentContainerMobileWeb,
          ]}
        >
          <Image
            style={[
              styles.image,
              isDesktopWeb && styles.imageDesktop,
              isMobileWeb && styles.imageMobileWeb,
            ]}
            source={require("assets/UserVerificationSuccessful.png")}
          />
          <Text
            style={[
              styles.description,
              isDesktopWeb && styles.descriptionDesktop,
              isMobileWeb && styles.descriptionMobileWeb,
            ]}
          >
            {from === "change_phone" || from === "first_add_email" ? (
              "We've sent a verification code to your email address. Please enter it below."
            ) : from === "change_email" || from === "first_add_phone" ? (
              "We have sent a verification code to your mobile number. Please enter the code."
            ) : verificationType === "email" ? (
              "We've sent a verification code to your email address. Please enter it below."
            ) : (
              "We have sent a verification code to your mobile number. Please enter the code."
            )}
          </Text>

          {/* DEBUG INFO - Remove this in production */}
          {/* <Text style={{ fontSize: 10, color: 'gray', marginVertical: 10 }}>
            DEBUG: from={from}, email={email || 'EMPTY'}, phone={phoneNumber || 'EMPTY'}
          </Text> */}

          <View
            style={[
              styles.codeContainer,
              isDesktopWeb && styles.codeContainerDesktop,
              isMobileWeb && styles.codeContainerMobileWeb,
            ]}
          >
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[
                  styles.inputBox,
                  isDesktopWeb && styles.inputBoxDesktop,
                  isMobileWeb && styles.inputBoxMobileWeb,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                returnKeyType="next"
                editable={!isVerifying && !isResending}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !code[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          <View
            style={[
              styles.buttonContainer,
              isDesktopWeb && styles.buttonContainerDesktop,
              isMobileWeb && styles.buttonContainerMobileWeb,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isDesktopWeb && styles.verifyButtonDesktop,
                isMobileWeb && styles.verifyButtonMobileWeb,
                (isVerifying || isResending) && { opacity: 0.6 },
              ]}
              onPress={handleVerify}
              disabled={isVerifying || isResending}
            >
              {isVerifying ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>

            <Text
              style={[
                styles.resendText,
                isDesktopWeb && styles.resendTextDesktop,
                isMobileWeb && styles.resendTextMobileWeb,
              ]}
            >
              Didn't receive the code?{" "}
              <Text
                style={[
                  styles.resendLink,
                  (isVerifying || isResending || resendCooldownSeconds > 0) && { opacity: 0.5 },
                ]}
                onPress={!isVerifying && !isResending ? handleResend : undefined}
              >
                {isResending
                  ? "Sending..."
                  : resendCooldownSeconds > 0
                  ? `Resend in ${resendCooldownSeconds}s`
                  : "Resend"}
              </Text>
            </Text>
          </View>
        </View>
      </KeyBoardWrapper>
      {confirmationModal}
    </PageLayout>
  );
};

export default verificationScreen;