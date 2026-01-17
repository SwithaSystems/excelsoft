import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
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

  const handleVerify = async () => {
    const OtpNumber = code.join("");

    if (!OtpNumber || OtpNumber.length < 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit OTP.");
      return;
    }

    try {
      let res;

      // SIGNUP/FORGOT PASSWORD FLOWS (existing - don't touch)
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
          Alert.alert("Verification Failed", "Invalid OTP. Please try again.");
          return;
        }

        if (from === "forgotPassword") {
          redirectToPage(containers.passwordResetScreen, { phoneNumber });
          return;
        }

        if (from === "signup") {
          if (!parsedUserData) {
            Alert.alert("Error", "User data is missing.");
            return;
          }

          const response = await authService.register({ userData: parsedUserData });
          if (response?.access_token) {
            Alert.alert("Success", "User successfully registered");
            redirectToPage(containers.signInScreen);
          }
        }
        return;
      }

      // EDIT CONTACT FLOWS (new)
      if (from === "first_add_phone") {
        // First time adding phone - verify OTP sent to phone
        res = await TwilioApi.verifyOtp({ phoneNumber, OtpNumber });
        const isVerified =
          res?.success === true ||
          res?.data?.success === true ||
          res === "verified successfully";

        if (!isVerified) {
          Alert.alert("Invalid OTP", "Please try again.");
          return;
        }

        // Update phone and mark as verified
        try {
          const formData = new FormData();
          formData.append("phone", phoneNumber);
          console.log("Updating phone contact for userId:", userId, "phone:", phoneNumber);
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          console.log("Update contact response:", updateResponse);
          
          console.log("Verifying phone contact for userId:", userId);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "phone" });
          console.log("Verify contact response:", verifyResponse);

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          Alert.alert("Success", "Phone verified successfully", [
            { text: "OK", onPress: () => redirectToPage(containers.editAccountInformationScreen) },
          ]);
        } catch (updateError: any) {
          console.error("Failed to update phone:", updateError);
          console.error("Error details:", {
            message: updateError?.message,
            response: updateError?.response?.data,
            status: updateError?.response?.status,
          });
          
          let errorMessage = "Failed to update phone. Please try again.";
          
          // Check for authentication errors
          if (updateError?.message?.includes("Refresh token not available") || 
              updateError?.message?.includes("refresh token")) {
            errorMessage = "Your session has expired. Please log in again.";
            Alert.alert("Session Expired", errorMessage, [
              { text: "OK", onPress: () => redirectToPage(containers.signInScreen) },
            ]);
            return;
          }
          
          // Check for 500 server errors
          if (updateError?.response?.status === 500) {
            errorMessage = updateError?.response?.data?.message || 
                          "Server error occurred. Please try again later or contact support.";
          } else if (updateError?.response?.data?.message) {
            errorMessage = updateError.response.data.message;
          } else if (updateError?.message) {
            errorMessage = updateError.message;
          }
          
          Alert.alert("Error", errorMessage);
        }
      }

      if (from === "first_add_email") {
        // First time adding email - verify OTP sent to email
        res = await TwilioApi.verifyOtp_Email({ email, OtpNumber });
        const isVerified = res?.success === true || res?.data?.success === true;

        if (!isVerified) {
          Alert.alert("Invalid OTP", "Please try again.");
          return;
        }

        // Update email and mark as verified
        try {
          const formData = new FormData();
          formData.append("email", email);
          console.log("Updating email contact for userId:", userId, "email:", email);
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          console.log("Update contact response:", updateResponse);
          
          console.log("Verifying email contact for userId:", userId);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "email" });
          console.log("Verify contact response:", verifyResponse);

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          Alert.alert("Success", "Email verified successfully", [
            { text: "OK", onPress: () => redirectToPage(containers.editAccountInformationScreen) },
          ]);
        } catch (updateError: any) {
          console.error("Failed to update email:", updateError);
          console.error("Error details:", {
            message: updateError?.message,
            response: updateError?.response?.data,
            status: updateError?.response?.status,
          });
          
          let errorMessage = "Failed to update email. Please try again.";
          
          // Check for authentication errors
          if (updateError?.message?.includes("Refresh token not available") || 
              updateError?.message?.includes("refresh token")) {
            errorMessage = "Your session has expired. Please log in again.";
            Alert.alert("Session Expired", errorMessage, [
              { text: "OK", onPress: () => redirectToPage(containers.signInScreen) },
            ]);
            return;
          }
          
          // Check for 500 server errors
          if (updateError?.response?.status === 500) {
            errorMessage = updateError?.response?.data?.message || 
                          "Server error occurred. Please try again later or contact support.";
          } else if (updateError?.response?.data?.message) {
            errorMessage = updateError.response.data.message;
          } else if (updateError?.message) {
            errorMessage = updateError.message;
          }
          
          Alert.alert("Error", errorMessage);
        }
      }

      if (from === "change_phone") {
        // Changing phone - OTP was sent to email (cross-platform)
        res = await TwilioApi.verifyOtp_Email({ email, OtpNumber });
        const isVerified = res?.success === true || res?.data?.success === true;

        if (!isVerified) {
          Alert.alert("Invalid OTP", "Please try again.");
          return;
        }

        // Update to new phone and mark as verified
        try {
          const formData = new FormData();
          formData.append("phone", String(newPhone));
          console.log("Updating phone contact for userId:", userId, "newPhone:", newPhone);
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          console.log("Update contact response:", updateResponse);
          
          console.log("Verifying phone contact for userId:", userId);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "phone" });
          console.log("Verify contact response:", verifyResponse);

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          Alert.alert("Success", "Phone number changed successfully", [
            { text: "OK", onPress: () => redirectToPage(containers.editAccountInformationScreen) },
          ]);
        } catch (updateError: any) {
          console.error("Failed to update phone:", updateError);
          console.error("Error details:", {
            message: updateError?.message,
            response: updateError?.response?.data,
            status: updateError?.response?.status,
          });
          
          let errorMessage = "Failed to update phone. Please try again.";
          
          // Check for authentication errors
          if (updateError?.message?.includes("Refresh token not available") || 
              updateError?.message?.includes("refresh token")) {
            errorMessage = "Your session has expired. Please log in again.";
            Alert.alert("Session Expired", errorMessage, [
              { text: "OK", onPress: () => redirectToPage(containers.signInScreen) },
            ]);
            return;
          }
          
          // Check for 500 server errors
          if (updateError?.response?.status === 500) {
            errorMessage = updateError?.response?.data?.message || 
                          "Server error occurred. Please try again later or contact support.";
          } else if (updateError?.response?.data?.message) {
            errorMessage = updateError.response.data.message;
          } else if (updateError?.message) {
            errorMessage = updateError.message;
          }
          
          Alert.alert("Error", errorMessage);
        }
      }

      if (from === "change_email") {
        // Changing email - OTP was sent to phone (cross-platform)
        res = await TwilioApi.verifyOtp({ phoneNumber, OtpNumber });
        const isVerified =
          res?.success === true ||
          res?.data?.success === true ||
          res === "verified successfully";

        if (!isVerified) {
          Alert.alert("Invalid OTP", "Please try again.");
          return;
        }

        // Update to new email and mark as verified
        try {
          const formData = new FormData();
          formData.append("email", String(newEmail));
          console.log("Updating email contact for userId:", userId, "newEmail:", newEmail);
          const updateResponse = await UserAPI.userEditContact(String(userId), formData);
          console.log("Update contact response:", updateResponse);
          
          console.log("Verifying email contact for userId:", userId);
          const verifyResponse = await UserAPI.verifyContact(String(userId), { type: "email" });
          console.log("Verify contact response:", verifyResponse);

          // Refresh user data
          const updatedUser = await UserAPI.getUserById(String(userId));
          if (updatedUser?.data) {
            dispatch(setUserData(updatedUser.data));
            await SecureStore.setItemAsync("user", JSON.stringify(updatedUser.data));
          }

          Alert.alert("Success", "Email changed successfully", [
            { text: "OK", onPress: () => redirectToPage(containers.editAccountInformationScreen) },
          ]);
        } catch (updateError: any) {
          console.error("Failed to update email:", updateError);
          console.error("Error details:", {
            message: updateError?.message,
            response: updateError?.response?.data,
            status: updateError?.response?.status,
          });
          
          let errorMessage = "Failed to update email. Please try again.";
          
          // Check for authentication errors
          if (updateError?.message?.includes("Refresh token not available") || 
              updateError?.message?.includes("refresh token")) {
            errorMessage = "Your session has expired. Please log in again.";
            Alert.alert("Session Expired", errorMessage, [
              { text: "OK", onPress: () => redirectToPage(containers.signInScreen) },
            ]);
            return;
          }
          
          // Check for 500 server errors
          if (updateError?.response?.status === 500) {
            errorMessage = updateError?.response?.data?.message || 
                          "Server error occurred. Please try again later or contact support.";
          } else if (updateError?.response?.data?.message) {
            errorMessage = updateError.response.data.message;
          } else if (updateError?.message) {
            errorMessage = updateError.message;
          }
          
          Alert.alert("Error", errorMessage);
        }
      }
    } catch (error: any) {
      console.error("OTP Verification Failed", error);
      let errorMessage = "Verification failed. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      Alert.alert("Verification Error", errorMessage);
    }
  };

  const handleResend = async () => {
    try {
      if (from === "first_add_phone" || from === "change_email") {
        await TwilioApi.sendOtp({ phone: phoneNumber });
      } else if (from === "first_add_email" || from === "change_phone") {
        await TwilioApi.sendOtp_Email({ email });
      } else {
        // Signup/forgot password
        if (verificationType === "email") {
          await TwilioApi.sendOtp_Email({ email });
        } else {
          await TwilioApi.sendOtp({ phone: phoneNumber });
        }
      }
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      Alert.alert("Success", "Code resent successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to resend code");
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
            {verificationType === "email" || from === "first_add_email" || from === "change_phone"
              ? "We've sent a verification code to your email address. Please enter it below."
              : "We have sent a verification code to your mobile. Please enter the code."}
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
              style={[styles.verifyButton, isWeb && styles.verifyButtonDesktop]}
              onPress={handleVerify}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <Text style={[styles.resendText, isWeb && styles.resendTextDesktop]}>
              Didn't receive the code?{" "}
              <Text style={styles.resendLink} onPress={handleResend}>
                Resend
              </Text>
            </Text>
          </View>
        </View>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default verificationScreen;