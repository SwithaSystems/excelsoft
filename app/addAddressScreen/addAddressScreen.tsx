import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import styles from "./addAddressScreenStyles";
import { CheckBox } from "react-native-elements";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { addressService } from "@/services/addressService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/assets/styles/globalStyles";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";
import { ADD_ADDRESS_SCREEN_TITLE } from './../config/stringLiterals';
import { showErrorAlert } from "../config/showErrorAlert";
import {
  MISSING_REQUIRED_FIELDS,
  INVALID_POSTCODE,
  ADDRESS_NOT_DELIVERABLE,
  ADDRESS_NOT_SAVED,
  DUPLICATE_ADDRESS,
} from "../config/customErrorMessages";

const addAddressScreen = () => {
  const params = useLocalSearchParams();
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [state, setState] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  console.log("params", params);
  const from = params.from;

  const handleAddAddress = async () => {
  if (
        !name.trim() ||
        !postalcode.trim() ||
        !line1.trim() ||
        !towncity.trim() ||
        !phoneNumber.trim()
      ) {
        showErrorAlert({
          title: "Error",
          message: MISSING_REQUIRED_FIELDS,
        });
        return;
      }

      try {
        const response = await addressService.addShippingAddress({
          name,
          line1,
          line2,
          city: towncity,
          state,
          postalCode: postalcode,
          phone: phoneNumber,
          isDefault,
        });

        if (response.status === 200 || response.status === 201) {
          alert("Address added successfully");
          if (from === "homeDelivery") {
            redirectToPage(containers.homeDeliveryScreenScreen);
          } else {
            redirectToPage(containers.savedAddressScreenScreen);
          }
        } else {
          showErrorAlert({
            title: "Error",
            message: ADDRESS_NOT_SAVED,
          });
        }
      } catch (error) {
        console.error("Error adding address:", error);

        const isErrorWithResponse = (err: any): err is { response: { data: { message: string } } } =>
          err && err.response && err.response.data && typeof err.response.data.message === "string";

        const isErrorWithMessage = (err: any): err is { message: string } =>
          err && typeof err.message === "string";

        if (
          (isErrorWithResponse(error) && error.response.data.message.includes("duplicate")) ||
          (isErrorWithMessage(error) && error.message.toLowerCase().includes("duplicate"))
        ) {
          showErrorAlert({
            title: "Duplicate Address",
            message: DUPLICATE_ADDRESS,
          });
        } else {
          showErrorAlert({
            title: "Error",
            message: ADDRESS_NOT_SAVED,
          });
        }
      }
    };



  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //
    // <View style={styles.container}>
    //   <Header headerText={ADD_ADDRESS_SCREEN_TITLE} />
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable
      headerComponent={<Header headerText={ADD_ADDRESS_SCREEN_TITLE} />}
    >
      <KeyBoardWrapper>
        <ScrollView>
          <Text style={styles.fieldLabel}>Recipient Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />

          <Text style={styles.fieldLabel}>Postcode</Text>
          <TextInput
            style={styles.input}
            value={postalcode}
            onChangeText={setPostalCode}
            keyboardType="email-address"
          />

          <Text style={styles.fieldLabel}>Address Line 1</Text>
          <TextInput
            style={styles.input}
            value={line1}
            onChangeText={setLine1}
          />

          <Text style={styles.fieldLabel}>Address Line 2</Text>
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

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAddAddress}
          >
            <Text style={styles.buttonText}>Add Address</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default addAddressScreen;
