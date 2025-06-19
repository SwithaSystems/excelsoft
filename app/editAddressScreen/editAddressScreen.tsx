import { EDIT_ADDRESS_SCREEN_TITLE } from "./../config/stringLiterals";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "./editAddressScreenStyles";
import { CheckBox } from "react-native-elements";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";
import { showErrorAlert } from "../config/showErrorAlert";
import {
  MISSING_REQUIRED_FIELDS,
   ADDRESS_UPDATE_FAILED,
  DUPLICATE_ADDRESS,
} from "../config/customErrorMessages";
import { addressService } from "@/services/addressService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const editAddressScreen = () => {
  const { edit_address } = useLocalSearchParams();
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (edit_address) {
      const selectedAddress = JSON.parse(edit_address as string);
      setAddress(selectedAddress.name || "");
      setLine1(selectedAddress.line1 || "");
      setLine2(selectedAddress.line2 || "");
      setTownCity(selectedAddress.city || "");
      setPostalCode(selectedAddress.postalCode || "");
      setPhoneNumber(selectedAddress.phone || "");
      setIsDefault(selectedAddress.isDefault || false);
    }
  }, [edit_address]);

  const handleSubmit = async () => {
    if (
      !address.trim() ||
      !line1.trim() ||
      !towncity.trim() ||
      !postalcode.trim() ||
      !phoneNumber.trim()
    ) {
      showErrorAlert({
        title: "Error",
        message: MISSING_REQUIRED_FIELDS,
      });
      return;
    }

    try {
      const response = await addressService.updateShippingAddress({
        _id: JSON.parse(edit_address as string)._id,
        name: address,
        line1: line1,
        line2: line2,
        city: towncity,
        state: "", // optional state field
        postalCode: postalcode,
        phone: phoneNumber,
        isDefault: isDefault,
      });

      if (response.status === 200) {
        alert("Address updated successfully");
        redirectToPage(containers.savedAddressScreenScreen);
      } else {
        showErrorAlert({
          title: "Error",
          message:  ADDRESS_UPDATE_FAILED,
        });
      }
    } catch (error: any) {
      console.error("Error updating address:", error);

      if (
        error?.response?.data?.message?.toLowerCase().includes("duplicate") ||
        error?.message?.toLowerCase().includes("duplicate")
      ) {
        showErrorAlert({
          title: "Duplicate Address",
          message: DUPLICATE_ADDRESS,
        });
      } else {
        showErrorAlert({
          title: "Error",
          message:  ADDRESS_UPDATE_FAILED,
        });
      }
    }
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      hasHeader
      headerComponent={<Header headerText={EDIT_ADDRESS_SCREEN_TITLE} />}
      hasFooter={false}
      scrollable
    >
      <KeyBoardWrapper>
        {/* <View style={styles.container}>
        <Header headerText={EDIT_ADDRESS_SCREEN_TITLE} /> */}

        <ScrollView>
          <Text style={styles.fieldLabel}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} />

          <Text style={styles.fieldLabel}>Line 1</Text>
          <TextInput style={styles.input} value={line1} onChangeText={setLine1} />

          <Text style={styles.fieldLabel}>Line 2</Text>
          <TextInput
            style={styles.input}
            value={line2}
            onChangeText={setLine2}
            keyboardType="email-address"
          />

          <Text style={styles.fieldLabel}>Town/City</Text>
          <TextInput
            style={styles.input}
            value={towncity}
            onChangeText={setTownCity}
            keyboardType="email-address"
          />

          {/* <Text style={styles.fieldLabel}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            keyboardType="email-address"
          /> */}

          {/* <Text style={styles.fieldLabel}>Country</Text>
          <View style={styles.countriesdropdown}>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              keyboardType="email-address"
            />
            <Ionicons
              name="chevron-down-outline"
              size={24}
              color={colors.black}
            />
          </View> */}

          <Text style={styles.fieldLabel}>Postal Code</Text>
          <TextInput
            style={styles.input}
            value={postalcode}
            onChangeText={setPostalCode}
            keyboardType="email-address"
          />

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <View style={styles.checkBox}>
            <CheckBox
              checked={isDefault}
              onPress={() => setIsDefault(!isDefault)}
            />
            <Text>Mark as default address</Text>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Update Address</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default editAddressScreen;
