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
import styles from "./verifcationScreenStyles";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { TwilioApi } from "@/services/twilioService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";
import { authService } from "@/services/auth.service";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";

const verifcationScreen = () => {
  const { userData, from, phoneNumber_forgetPwd, phoneNumber_editAccount } =
    useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [parsedUserData, setParsedUserData] = useState(null);
  const inputRefs = useRef<TextInput[]>([]);

  console.log("from", from, userData, phoneNumber_forgetPwd);

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
      const res = await TwilioApi.verifyOtp({
        phoneNumber,
        OtpNumber,
      });

      console.log("OTP verification result:", res);

      if (res === "verified successfully") {
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
              Alert.alert("User successfully registered");
              redirectToPage(containers.signInScreen);
            } else {
              Alert.alert("Registration Error", "Failed to register the user.");
            }
          } catch (registerError: any) {
            console.error("Registration Error:", registerError);

            // Check for user already exists error
            const message =
              registerError?.response?.data?.message ||
              "Registration failed. Please try again.";

            if (
              typeof message === "string" &&
              message.toLowerCase().includes("already exists")
            ) {
              Alert.alert(
                "Registration Error",
                "This phone number is already registered."
              );
            } else {
              Alert.alert("Registration Error", message);
            }
          }
        }
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error: any) {
      console.error("OTP Verification Failed", error);

      Alert.alert("Verification Error", error);
    }
  };

  const handleResend = async () => {
    await TwilioApi.sendOtp({ phone: String(phoneNumber) });
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };
  return (
    <>
      <SafeAreaView style={globalStyles.safeAreaContainer}>
        <KeyBoardWrapper>
          <View style={styles.container}>
            <Header headerText="Verify Your Account" />
            <Image
              style={styles.image}
              source={require("assets/UserVerificationSuccessful.png")}
            />
            <Text style={styles.description}>
              We have sent a verification code to your mobile.Please enter code
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
        </KeyBoardWrapper>
      </SafeAreaView>
    </>
  );
};

export default verifcationScreen;
