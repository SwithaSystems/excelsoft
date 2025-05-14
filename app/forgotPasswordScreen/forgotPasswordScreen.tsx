import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView } from "react-native";
import styles from "./forgotPasswordScreenStyles";
import BackArrow from "@/components/commonComponents/BackArrow";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { TwilioApi } from "@/services/twilioService";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { UserAPI } from "@/services/userService";
import colors from "../config/colors";

const forgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleSendCode = async () => {
    console.log("phoneNumber", phoneNumber);
    console.log("user", user);
    if (user) {
      await TwilioApi.sendOtp({ phone: phoneNumber });
      redirectToPage(containers.verifcationScreenScreen, {
        phoneNumber: phoneNumber,
        from: "forgotPassword",
      });
    } else {
      setModalOpen(true);
    }
  };
  useEffect(() => {
    const response = UserAPI.getUserByPhonenumber(phoneNumber).then(
      (response) => {
        console.log("response", response);
        setUser(response.data);
      }
    );
  }, [phoneNumber]);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Header headerText={"Forgot Password"} />
      <View style={styles.sectionContainer}>
        <Text>
          Please enter your email/phone number to reset your password.
        </Text>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="Enter your email or phone number"
          value={email || phoneNumber}
          onChangeText={(text) => {
            if (/^(\+91\d{10})$/.test(text)) {
              setPhoneNumber(text);
              setEmail("");
            } else {
              setEmail(text);
              setPhoneNumber("");
            }
          }}
        />
        <Button
          title="Send Verification Code"
          style={styles.signInButton}
          onPress={handleSendCode}
        />
        <Button
          title="Back to Sign In"
          style={styles.signInButton}
          onPress={() => redirectToPage(containers.signInScreen)}
        />
      </View>
      <ConfirmationModal
        onClose={() => {
          setModalOpen(false);
        }}
        isModalVisible={ModalOpen}
        text="Uh-oh! It seems that you have entered the email/phone that doesn’t exist! Let’s try again. "
        submitText="OK"
        handleSubmit={() => setModalOpen(false)}
        handleCancel={() => {
          setModalOpen(false);
        }}
      />
    </View>
    </SafeAreaView>
  );
};

export default forgotPasswordScreen;
