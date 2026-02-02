import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import styles from "./VerifcationStyles";
import Header from "../../components/Header";
import { TwilioApi } from "@/services/twilioService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { authService } from "@/services/auth.service";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { VERIFICATION_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/userSlice";
import { UserAPI } from "@/services/userService";
import * as SecureStore from "expo-secure-store";
import colors from "../../../constants/colors";

const verificationScreen = () => {
  const isWeb = Platform.OS === "web";
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
  } = useLocalSearchParams();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [parsedUserData, setParsedUserData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Signup flow
    if (from === "signup" && userData) {
      try {
        const parsed = JSON.parse(String(userData));
        setParsedUserData(parsed);
        if (parsed?.phone) setPhoneNumber(parsed.phone);
        if (parsed?.email) setEmail(parsed.email);
      } catch (e) {
        console.error("Invalid JSON in userData", e);
        Alert.alert("Error", "Invalid user data. Please try signing up again.");
      }
    }

    // Forgot password flow
    if (from === "forgotPassword" && phoneNumber_forgetPwd) {
      const phone = Array.isArray(phoneNumber_forgetPwd)
        ? phoneNumber_forgetPwd[0]
        : phoneNumber_forgetPwd;
      setPhoneNumber(phone);
    }

    // Edit contact flows
    if (phoneNumber_editAccount) {
      const phone = Array.isArray(phoneNumber_editAccount)
        ? phoneNumber_editAccount[0]
        : phoneNumber_editAccount;
      setPhoneNumber(phone);
    }

    if (email_editAccount) {
      const emailVal = Array.isArray(email_editAccount)
        ? email_editAccount[0]
        : email_editAccount;
      setEmail(emailVal);
    }
  }, [from, userData, phoneNumber_forgetPwd, phoneNumber_editAccount, email_editAccount]);

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
      Alert.alert(title, message);
      if (onPress) {
        setTimeout(() => {
          onPress();
        }, 100);
      }
    } else {
      // For mobile, use standard alert with callback
      Alert.alert(
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
    Alert.alert(
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

    setIsVerifying(true);

    try {
      let res;

      // SIGNUP OR FORGOT PASSWORD FLOW
      if (from === "signup" || from === "forgotPassword") {
        if (verificationType === "email") {
          res = await TwilioApi.verifyOtp_Email({ email, OtpNumber });
        } else {
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
          // Clear the code inputs for user to try again
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
          return;
        }

        // FORGOT PASSWORD - redirect to reset password
        if (from === "forgotPassword") {
          showSuccessAlert(
            "Verification Successful",
            "Your identity has been verified. You can now reset your password.",
            () => {
              redirectToPage(containers.passwordResetScreen, { phoneNumber });
            }
          );
          return;
        }

        // SIGNUP - register the user
        if (from === "signup") {
          if (!parsedUserData) {
            showErrorAlertCustom("Error", "User data is missing. Please try signing up again.");
            return;
          }

          try {
            const response = await authService.register({ userData: parsedUserData });
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
                response?.message || "Unable to create your account. Please try again."
              );
            }
          } catch (registerError: any) {
            console.error("Registration error:", registerError);
            const errorMessage =
              registerError?.response?.data?.message ||
              registerError?.message ||
              "Failed to create account. Please try again.";
            showErrorAlertCustom("Registration Failed", errorMessage);
          }
        }
        return;
      }

      // FIRST TIME ADDING PHONE
      if (from === "first_add_phone") {
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

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your phone number has been verified and added to your account.",
            () => redirectToPage(containers.editAccountInformationScreen)
          );
        } catch (updateError: any) {
          console.error("Failed to update phone:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }

      // FIRST TIME ADDING EMAIL
      if (from === "first_add_email") {
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
            () => redirectToPage(containers.editAccountInformationScreen)
          );
        } catch (updateError: any) {
          console.error("Failed to update email:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }

      // CHANGING PHONE (OTP sent to email)
      if (from === "change_phone") {
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

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your phone number has been updated and verified successfully.",
            () => redirectToPage(containers.editAccountInformationScreen)
          );
        } catch (updateError: any) {
          console.error("Failed to update phone:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }

      // CHANGING EMAIL (OTP sent to phone)
      if (from === "change_email") {
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

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          showSuccessAlert(
            "Success!",
            "Your email address has been updated and verified successfully.",
            () => redirectToPage(containers.editAccountInformationScreen)
          );
        } catch (updateError: any) {
          console.error("Failed to update email:", updateError);
          handleUpdateContactError(updateError);
        }
        return;
      }
    } catch (error: any) {
      console.error("OTP Verification Failed", error);
      let errorMessage = "Verification failed. Please check your code and try again.";
      let errorTitle = "Verification Error";
      
      // Handle different error scenarios with specific messages
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
      
      // Clear code inputs on error so user can try again
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleUpdateContactError = (updateError: any) => {
    console.error("Error details:", {
      message: updateError?.message,
      response: updateError?.response?.data,
      status: updateError?.response?.status,
    });
    
    let errorMessage = "Failed to update your contact information. Please try again.";
    
    // Check for authentication errors
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
    
    // Check for 500 server errors
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

    setIsResending(true);
    try {
      if (from === "first_add_phone" || from === "change_email") {
        await TwilioApi.sendOtp({ phone: phoneNumber });
      } else if (from === "first_add_email" || from === "change_phone") {
        await TwilioApi.sendOtp_Email({ email:email});
      } else {
        // Signup/forgot password
        if (verificationType === "email") {
          await TwilioApi.sendOtp_Email({ email:email });
        } else {
          await TwilioApi.sendOtp({ phone: phoneNumber });
        }
      }
      
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      showSuccessAlert("Code Resent", "A new verification code has been sent successfully.");
    } catch (error: any) {
      console.error("Resend error:", error);
      let errorMessage = "Failed to resend code. Please try again.";
      
      // Better error messages for resend failures
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
          headerStyle={isWeb ? styles.verificationHeaderStyle : undefined}
          headerTitleStyle={isWeb ? styles.verificationHeaderTitle : undefined}
        />
      }
    >
      <KeyBoardWrapper>
        <View style={[styles.contentContainer, isWeb && styles.contentContainerDesktop]}>
          <Image
            style={[styles.image, isWeb && styles.imageDesktop]}
            source={require("assets/UserVerificationSuccessful.png")}
          />
          <Text style={[styles.description, isWeb && styles.descriptionDesktop]}>
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

          <View style={[styles.codeContainer, isWeb && styles.codeContainerDesktop]}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={[styles.inputBox, isWeb && styles.inputBoxDesktop]}
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

          <View style={[styles.buttonContainer, isWeb && styles.buttonContainerDesktop]}>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isWeb && styles.verifyButtonDesktop,
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

            <Text style={[styles.resendText, isWeb && styles.resendTextDesktop]}>
              Didn't receive the code?{" "}
              <Text
                style={[
                  styles.resendLink,
                  (isVerifying || isResending) && { opacity: 0.5 },
                ]}
                onPress={!isVerifying && !isResending ? handleResend : undefined}
              >
                {isResending ? "Sending..." : "Resend"}
              </Text>
            </Text>
          </View>
        </View>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default verificationScreen;