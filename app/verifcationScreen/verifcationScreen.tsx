import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./verifcationScreenStyles";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import { TwilioApi } from "@/services/twilioService";

const verifcationScreen = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (text: any, index: any) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };
  const handleVerify = async () => {
    console.log("Code:", code);
    const res = await TwilioApi.verifyOtp(code);
    console.log("res", res);
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
          Didn't receive the code? <Text style={styles.resendLink}>Resend</Text>
        </Text>
      </View>
    </>
  );
};

export default verifcationScreen;
