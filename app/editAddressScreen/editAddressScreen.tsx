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
import { globalStyles } from "@/assets/styles/globalStyles";

const editAddressScreen = () => {
  const { edit_address } = useLocalSearchParams();
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const [errors, setErrors] = useState<{
    address?: string;
    line1?: string;
    towncity?: string;
    postalcode?: string;
    phoneNumber?: string;
  }>({});

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

  // Input validation functions
  const validateAndSetAddress = (text: string) => {
    // Remove leading/trailing spaces and limit length
    const cleanText = text.trimStart().slice(0, 100);
    // Allow only letters, numbers, spaces, and common punctuation
    const validText = cleanText.replace(/[^a-zA-Z0-9\s\-\.\,\']/g, '');
    setAddress(validText);
    
    if (errors.address) {
      setErrors((prev) => ({ ...prev, address: undefined }));
    }
  };

  const validateAndSetLine1 = (text: string) => {
    // Remove leading/trailing spaces and limit length
    const cleanText = text.trimStart().slice(0, 150);
    // Allow letters, numbers, spaces, and address-related punctuation
    const validText = cleanText.replace(/[^a-zA-Z0-9\s\-\.\,\'\/\#]/g, '');
    setLine1(validText);
    
    if (errors.line1) {
      setErrors((prev) => ({ ...prev, line1: undefined }));
    }
  };

  const validateAndSetLine2 = (text: string) => {
    // Remove leading/trailing spaces and limit length
    const cleanText = text.trimStart().slice(0, 150);
    // Allow letters, numbers, spaces, and address-related punctuation
    const validText = cleanText.replace(/[^a-zA-Z0-9\s\-\.\,\'\/\#]/g, '');
    setLine2(validText);
  };

  const validateAndSetTownCity = (text: string) => {
    // Remove leading/trailing spaces and limit length
    const cleanText = text.trimStart().slice(0, 50);
    // Allow only letters, spaces, hyphens, and apostrophes for city names
    const validText = cleanText.replace(/[^a-zA-Z\s\-\']/g, '');
    setTownCity(validText);
    
    if (errors.towncity) {
      setErrors((prev) => ({ ...prev, towncity: undefined }));
    }
  };

  const validateAndSetPostalCode = (text: string) => {
    // Remove spaces and convert to uppercase, limit length
    const cleanText = text.replace(/\s/g, '').toUpperCase().slice(0, 10);
    // Allow letters, numbers, and hyphens for postal codes
    const validText = cleanText.replace(/[^a-zA-Z0-9\-]/g, '');
    setPostalCode(validText);
    
    if (errors.postalcode) {
      setErrors((prev) => ({ ...prev, postalcode: undefined }));
    }
  };

  const validateAndSetPhoneNumber = (text: string) => {
    // Remove all non-numeric characters and limit to 10 digits
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
    if (!validateFields()) {
      showErrorAlert({
        title: "Validation Error",
        message: MISSING_REQUIRED_FIELDS,
      });
      return;
    }

    try {
      const response = await addressService.updateShippingAddress({
        _id: JSON.parse(edit_address as string)._id,
        name: address.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        city: towncity.trim(),
        state: "", // optional state field
        postalCode: postalcode.trim(),
        phone: phoneNumber.trim(),
        isDefault: isDefault,
      });

      if (response.status === 200) {
        alert("Address updated successfully");
        redirectToPage(containers.savedAddressScreenScreen);
      } else {
        showErrorAlert({
          title: "Error",
          message: ADDRESS_UPDATE_FAILED,
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
          message: ADDRESS_UPDATE_FAILED,
        });
      }
    }
  };

  return (
    <PageLayout
      hasHeader
      headerComponent={<Header headerText={EDIT_ADDRESS_SCREEN_TITLE} />}
      hasFooter={false}
      scrollable
    >
      <KeyBoardWrapper>
        <ScrollView>
          <Text style={styles.fieldLabel}>Address Name</Text>
          <TextInput
            style={[styles.input, errors.address && globalStyles.errorInput]}
            value={address}
            onChangeText={validateAndSetAddress}
            placeholder="e.g., Home, Office"
            maxLength={100}
            autoCapitalize="words"
          />
          {errors.address && <Text style={globalStyles.errorText}>{errors.address}</Text>}

          <Text style={styles.fieldLabel}>Address Line 1</Text>
          <TextInput
            style={[styles.input, errors.line1 && globalStyles.errorInput]}
            value={line1}
            onChangeText={validateAndSetLine1}
            placeholder="Street address, P.O. box"
            maxLength={150}
            autoCapitalize="words"
          />
          {errors.line1 && <Text style={globalStyles.errorText}>{errors.line1}</Text>}

          <Text style={styles.fieldLabel}>Address Line 2 (Optional)</Text>
          <TextInput
            style={styles.input}
            value={line2}
            onChangeText={validateAndSetLine2}
            placeholder="Apartment, suite, floor, etc."
            maxLength={150}
            autoCapitalize="words"
          />

          <Text style={styles.fieldLabel}>Town/City</Text>
          <TextInput
            style={[styles.input, errors.towncity && globalStyles.errorInput]}
            value={towncity}
            onChangeText={validateAndSetTownCity}
            placeholder="Enter city name"
            maxLength={50}
            autoCapitalize="words"
          />
          {errors.towncity && <Text style={globalStyles.errorText}>{errors.towncity}</Text>}

          <Text style={styles.fieldLabel}>Postal Code</Text>
          <TextInput
            style={[styles.input, errors.postalcode && globalStyles.errorInput]}
            value={postalcode}
            onChangeText={validateAndSetPostalCode}
            placeholder="e.g., 12345 or A1B 2C3"
            maxLength={10}
            autoCapitalize="characters"
          />
          {errors.postalcode && <Text style={globalStyles.errorText}>{errors.postalcode}</Text>}

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <TextInput
            style={[styles.input, errors.phoneNumber && globalStyles.errorInput]}
            value={phoneNumber}
            onChangeText={validateAndSetPhoneNumber}
            placeholder="1234567890"
            keyboardType="numeric"
            maxLength={10}
          />
          {errors.phoneNumber && <Text style={globalStyles.errorText}>{errors.phoneNumber}</Text>}

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
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default editAddressScreen;