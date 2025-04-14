import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./verifcationScreenStyles";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { TwilioApi } from "@/services/twilioService";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const verifcationScreen = () => {
  const { phoneNumber, from } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  console.log("from", from);

  const handleChange = (text: any, index: any) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };
  const handleVerify = async () => {
    console.log("Code:", code);
    const OtpNumber = code.join("");
    console.log(phoneNumber, OtpNumber);
    const res = await TwilioApi.verifyOtp({
      phoneNumber,
      OtpNumber,
    });
    console.log("res", res);
    if (res == "verified successfully" && from === "forgotPassword") {
      redirectToPage(containers.passwordResetScreenScreen, {
        phoneNumber: phoneNumber,
      });
    } else if (res == "verified successfully" && from === "signup") {
      redirectToPage(containers.homeScreen);
    } else {
      Alert.alert("Error", "Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    await TwilioApi.sendOtp({ phone: String(phoneNumber) });
  };
  return (
    <>
      <View style={styles.container}>
        <Header headerText="Verify Your Account" />
        <Image
          style={styles.image}
          source={require("../../assets/images/verification.png")}
        />
        <Text style={styles.description}>
          We have sent a verification code to your mobile.Please enter code
        </Text>
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.inputBox}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <Text style={styles.resendText}>
          Didn't receive the code?{" "}
          <Text style={styles.resendLink} onPress={handleResend}>
            Resend
          </Text>
        </Text>
      </View>
    </>
  );
};

export default verifcationScreen;
