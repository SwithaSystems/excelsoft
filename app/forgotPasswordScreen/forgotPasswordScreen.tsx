import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import styles from "./forgotPasswordScreenStyles";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { TwilioApi } from "@/services/twilioService";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { UserAPI } from "@/services/userService";
import CountryPicker, { CountryCode } from "react-native-country-picker-modal";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";

const forgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("phone");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState("44");

  const toggleMode = (selected: any) => {
    setMode(selected);
    setEmail("");
    setPhoneNumber("");
  };

  const handleSendCode = async () => {
    console.log("phoneNumber", phoneNumber);
    console.log("user", user);

    const phoneNumberwithCountryCode = `+${callingCode}${phoneNumber}`;
    console.log("phoneNumberwithCountryCode", phoneNumberwithCountryCode);

    if (user) {
      await TwilioApi.sendOtp({ phone: phoneNumberwithCountryCode });
      redirectToPage(containers.verifcationScreenScreen, {
        phoneNumber_forgetPwd: phoneNumberwithCountryCode,
        from: "forgotPassword",
      });
    } else {
      setModalOpen(true);
    }
  };
  useEffect(() => {
    const response = UserAPI.getUserByPhonenumber(
      `+${callingCode}${phoneNumber}`
    ).then((response) => {
      console.log("response", response);
      setUser(response.data);
    });
  }, [phoneNumber]);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <KeyBoardWrapper>
      <View style={styles.container}>
        <Header headerText={"Forgot Password"} />
        <View style={styles.sectionContainer}>
          <Text>
            Please enter your email/phone number to reset your password.
          </Text>
          <View style={styles.toggleContainer}>
            {/* <Text style={styles.label}>Email Address/Phone Number</Text> */}
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "phone" && styles.activeToggle,
              ]}
              onPress={() => toggleMode("phone")}
            >
              <Text
                style={
                  mode === "phone" ? styles.activeText : styles.inactiveText
                }
              >
                Phone
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                mode === "email" && styles.activeToggle,
              ]}
              onPress={() => toggleMode("email")}
            >
              <Text
                style={
                  mode === "email" ? styles.activeText : styles.inactiveText
                }
              >
                Email
              </Text>
            </TouchableOpacity>
          </View>
          {mode === "email" ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Enter your email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text); // Fallback for other text entries
                  setPhoneNumber("");
                }}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}> Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryPickerContainer}>
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withFlag={false}
                    withCallingCode
                    onSelect={(country) => {
                      setCountryCode(country.cca2 || "GB");
                      setCallingCode(country.callingCode[0] || "44");
                    }}
                    containerButtonStyle={styles.countryPickerButton}
                  />
                  <Text style={styles.callingCode}>+{callingCode}</Text>
                </View>

                <TextInput
                  style={styles.phoneInput}
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    setEmail("");
                  }}
                  maxLength={11}
                  keyboardType="phone-pad"
                />
              </View>
            </>
          )}
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
      </KeyBoardWrapper>
    </SafeAreaView>
  );
};

export default forgotPasswordScreen;
