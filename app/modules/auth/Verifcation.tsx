import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import styles from "./VerifcationStyles";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { TwilioApi } from "@/services/twilioService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { authService } from "@/services/auth.service";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../../pageLayoutProps";
import { VERIFICATION_SCREEN_TITLE } from "../../config/stringLiterals";

const verifcationScreen = () => {
  const {
    userData,
    from,
    phoneNumber_forgetPwd,
    phoneNumber_editAccount,
    verificationType,
  } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [parsedUserData, setParsedUserData] = useState(null);
  const inputRefs = useRef<TextInput[]>([]);

  console.log("from", from, userData, phoneNumber_forgetPwd, verificationType);

  useEffect(() => {
    console.log("Source:", from);
    console.log("Raw userData:", userData);
    console.log("phoneNumber_forgetPwd:", phoneNumber_forgetPwd);
    console.log("phoneNumber_editAccount:", phoneNumber_editAccount);

    // Set phone number based on source
    if (from === "signup" && userData) {
      let parsed = null;
      if (typeof userData === "string") {
        try {
          parsed = JSON.parse(userData);
          setParsedUserData(parsed);
          if (parsed?.phone) {
            setPhoneNumber(parsed.phone);
          } else if (parsed?.email) {
            setEmail(parsed.email);
          } else {
            console.error("No phone number in userData");
          }
        } catch (e) {
          console.error("Invalid JSON in userData", e);
        }
      }
    } else if (from === "forgotPassword" && phoneNumber_forgetPwd) {
      if (Array.isArray(phoneNumber_forgetPwd)) {
        setPhoneNumber(phoneNumber_forgetPwd[0]);
        console.log(
          "Set phone number (from array) for password reset:",
          phoneNumber_forgetPwd[0]
        );
      } else {
        setPhoneNumber(phoneNumber_forgetPwd);
        console.log(
          "Set phone number (from string) for password reset:",
          phoneNumber_forgetPwd
        );
      }
    } else if (from === "verify" && phoneNumber_editAccount) {
      if (Array.isArray(phoneNumber_editAccount)) {
        setPhoneNumber(phoneNumber_editAccount[0]);
        console.log(
          "Set phone number (from array) for password reset:",
          phoneNumber_editAccount[0]
        );
      } else {
        setPhoneNumber(phoneNumber_editAccount);
        console.log(
          "Set phone number (from string) for password reset:",
          phoneNumber_editAccount
        );
      }
    }
  }, [from, userData, phoneNumber_forgetPwd, phoneNumber_editAccount]);

  // let parsedUserData: any;
  // if (typeof userData === "string") {
  //   try {
  //     parsedUserData = JSON.parse(userData);
  //   } catch (e) {
  //     console.error("Invalid JSON in userData", e);
  //   }
  // } else {
  //   console.warn("userData is not a string:", userData);
  // }

  // const phoneNumber = parsedUserData?.phone;

  console.log("phoneNumber", phoneNumber);
  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    // Auto-focus to next input if a digit is entered
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

      if (verificationType === "email") {
        res = await TwilioApi.verifyOtp_Email({
          email: email,
          OtpNumber,
        });
        console.log("Email OTP verification result:", res);
      } else {
        res = await TwilioApi.verifyOtp({
          phoneNumber,
          OtpNumber,
        });
        console.log("Phone OTP verification result:", res);
      }

      // Check if verification was successful
      // You need to check the actual response structure from your API
      const isVerified =
        res?.success === true ||
        res?.data?.success === true ||
        res === "verified successfully";

      if (isVerified) {
        if (from === "forgotPassword") {
          redirectToPage(containers.passwordResetScreenScreen, {
            phoneNumber,
          });
          return;
        }

        if (from === "verify") {
          redirectToPage(containers.editAccountInformationscreenScreen);
          return;
        }

        if (from === "signup") {
          console.log("ParsedUserData", parsedUserData);

          if (!parsedUserData) {
            Alert.alert("Error", "User data is missing.");
            return;
          }

          try {
            const response = await authService.register({
              userData: parsedUserData,
            });

            console.log("response from verify otp", response);

            if (response?.access_token && response?.user) {
              Alert.alert("Success", "User successfully registered");
              redirectToPage(containers.signInScreen);
            } else {
              Alert.alert("Registration Error", "Failed to register the user.");
            }
          } catch (registerError: any) {
            console.error("Registration Error:", registerError);

            // Properly extract error message
            let errorMessage = "Registration failed. Please try again.";

            if (registerError?.response?.data?.message) {
              errorMessage = registerError.response.data.message;
            } else if (registerError?.message) {
              errorMessage = registerError.message;
            }

            if (
              typeof errorMessage === "string" &&
              errorMessage.toLowerCase().includes("already exists")
            ) {
              Alert.alert(
                "Registration Error",
                "This phone number is already registered."
              );
            } else {
              Alert.alert("Registration Error", errorMessage);
            }
          }
        }
      } else {
        // Handle unsuccessful verification
        let errorMessage = "Invalid OTP. Please try again.";

        if (res?.data?.message) {
          errorMessage = res.data.message;
        }

        Alert.alert("Verification Failed", errorMessage);
      }
    } catch (error: any) {
      console.error("OTP Verification Failed", error);

      // FIX: Properly extract error message instead of passing entire error object
      let errorMessage = "Verification failed. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      Alert.alert("Verification Error", errorMessage);
    }
  };
  const handleResend = async () => {
    await TwilioApi.sendOtp({ phone: String(phoneNumber) });
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };
  return (
    <>
      <PageLayout
        hasFooter={false}
        hasHeader
        headerComponent={<Header headerText={VERIFICATION_SCREEN_TITLE} />}
      >
        <KeyBoardWrapper>
          <Image
            style={styles.image}
            source={require("assets/UserVerificationSuccessful.png")}
          />
          <Text style={styles.description}>
            {verificationType === "email"
              ? "We've sent a verification link to your email address. Please check your inbox and click on the link to verify your email. If you don't see the email, check your spam folder or try resending the verification email."
              : "We have sent a verification code to your mobile. Please enter the code."}
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={styles.inputBox}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                returnKeyType="next"
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === "Backspace" &&
                    !code[index] &&
                    index > 0
                  ) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleVerify}
            >
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <Text style={styles.resendText}>
              Didn't receive the code?{" "}
              <Text style={styles.resendLink} onPress={handleResend}>
                Resend
              </Text>
            </Text>
          </View>
          {/* </View> */}
        </KeyBoardWrapper>
        {/* </SafeAreaView> */}
      </PageLayout>
    </>
  );
};

export default verifcationScreen;
