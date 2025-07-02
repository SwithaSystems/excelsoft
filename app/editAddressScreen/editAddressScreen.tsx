import { EDIT_ADDRESS_SCREEN_TITLE } from './../config/stringLiterals';
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import styles from "./editAddressScreenStyles";
import { CheckBox } from "react-native-elements";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import OrderSummary from "@/components/OrderSummary";
import { useSelector } from "react-redux";
import { addressService } from "@/services/addressService";
import { useAppContext } from "../../context/AppContext";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useLocalSearchParams } from "expo-router";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";

const editAddressScreen = () => {
  const { params } = useLocalSearchParams();
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  console.log("params from edit page", params);
  const { edit_address } = useLocalSearchParams();

  useEffect(() => {
    if(!edit_address){
      console.log("No edit_address found, returning");
      return;
    } 

    let selectedAddress;

    try{
      selectedAddress = 
        typeof edit_address === "string" 
        ? JSON.parse(edit_address) 
        : edit_address;
      console.log("Parsed address data:", selectedAddress);
      console.log("Type of selectedAddress:", typeof selectedAddress);

      setAddress(selectedAddress.name || "");
      setLine1(selectedAddress.line1 || "");
      setLine2(selectedAddress.line2 || "");
      setTownCity(selectedAddress.city || "");
      setPostalCode(selectedAddress.postalCode || "");
      setPhoneNumber(selectedAddress.phone || "");
      setIsDefault(selectedAddress.isDefault || false);

      console.log("values set successfully");
    }catch(e){
      console.log(e);
      return;
    }
      
    }, [edit_address]);

  const validateAndSetAddress = (text: string) => {
    const cleanText = text.trimStart().slice(0, 100);
    const validText = cleanText.replace(/[^a-zA-Z0-9\s\-\.\,\']/g, '');
    setAddress(validText);
    
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  const validateAndSetLine1 = (text: string) => {
    const cleanText = text.trimStart().slice(0, 150);
    const validText = cleanText.replace(/[^a-zA-Z0-9\s\-\.\,\'\/\#]/g, '');
    setLine1(validText);
    
    if (errors.line1) {
      setErrors((prev) => ({ ...prev, line1: undefined }));
    }
  };

  const validateAndSetLine2 = (text: string) => {
    const cleanText = text.trimStart().slice(0, 150);
    const validText = cleanText.replace(/[^a-zA-Z0-9\s\-\.\,\'\/\#]/g, '');
    setLine2(validText);
  };

  const validateAndSetTownCity = (text: string) => {
    const cleanText = text.trimStart().slice(0, 50);
    const validText = cleanText.replace(/[^a-zA-Z\s\-\']/g, '');
    setTownCity(validText);
    
    if (errors.towncity) {
      setErrors((prev) => ({ ...prev, towncity: undefined }));
    }
  };

  const validateAndSetPostalCode = (text: string) => {
    const cleanText = text.replace(/\s/g, '').toUpperCase().slice(0, 10);
    const validText = cleanText.replace(/[^a-zA-Z0-9\-]/g, '');
    setPostalCode(validText);
    
    if (errors.postalcode) {
      setErrors((prev) => ({ ...prev, postalcode: undefined }));
    }
  };

  const validateAndSetPhoneNumber = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(numericText);
    
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const validateFields = () => {
    const newErrors: typeof errors = {};

    if (!address.trim()) {
      newErrors.address = "Name is required.";
    } else if (address.trim().length < 2) {
      newErrors.address = "Name must be at least 2 characters.";
    }

    if (!line1.trim()) {
      newErrors.line1 = "Line 1 is required.";
    } else if (line1.trim().length < 5) {
      newErrors.line1 = "Address line 1 must be at least 5 characters.";
    }

    if (!towncity.trim()) {
      newErrors.towncity = "Town/City is required.";
    } else if (towncity.trim().length < 2) {
      newErrors.towncity = "Town/City must be at least 2 characters.";
    }
    
    if (!postalcode.trim()) {
      newErrors.postalcode = "Postal Code is required.";
    } else if (!/^[a-zA-Z0-9\s\-]{4,10}$/.test(postalcode.trim())) {
      newErrors.postalcode = "Enter a valid postal code (4-10 characters).";
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const response = await addressService.updateShippingAddress({
      _id: JSON.parse(edit_address as string)._id,
      name: address,
      line1: line1,
      line2: line2,
      city: towncity,
      state: "",
      postalCode: postalcode,
      phone: phoneNumber,
      isDefault: isDefault,
    });
    console.log("Updated address", response.data);
    if (response.status === 200) {
      alert("Address updated successfully");
    } else {
      alert("Failed to update address");
    }
    redirectToPage(containers.savedAddressScreenScreen);
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

        <Text style={styles.fieldLabel}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

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
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default editAddressScreen;
