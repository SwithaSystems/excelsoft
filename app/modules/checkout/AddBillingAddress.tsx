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
  // Button,
} from "react-native";
import styles from "./BillingAddressStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { addressService } from "@/services/addressService";
import Button from "@/app/components/commonComponents/Button";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import { useAppContext } from "@/context/AppContext";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import {
  ADD_BILLING_ADDRESS_SCREEN_TITLE,
  UPDATE_BILLING_ADDRESS_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import { CheckBox } from "react-native-elements";

const addBillingAddressScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const cartItems = useSelector((state: any) => [...state.cart.items]);
  const { setSelectedBillingAddress } = useAppContext();

  // Form state
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");

  // Component state
  const [billingAddress, setBillingAddress] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [addressType, setAddressType] = useState([]);

  const [errors, setErrors] = useState<{
    name?: string;
    postalcode?: string;
    line1?: string;
    line2?: string;
    towncity?: string;
    state?: string;
    phoneNumber?: string;
    general?: string;
  }>({});

  // Parse the edit_address parameter safely
  const edit_address = params.edit_address
    ? typeof params.edit_address === "string"
      ? JSON.parse(params.edit_address)
      : params.edit_address
    : null;

  // Load initial data only once
  useEffect(() => {
    const fetchBillingAddress = async () => {
      try {
        const billingAddress = await addressService.getAllAddress();
        setBillingAddress(billingAddress);
        console.log("billing addresses:", billingAddress);
      } catch (error) {
        console.error("Error fetching billing address:", error);
      }
    };

    fetchBillingAddress();

    // Only set form values once when edit_address is available
    if (edit_address && !initialDataLoaded) {
      setIsEditMode(true);
      setAddressId(edit_address._id);
      setAddress(edit_address.name || "");
      setLine1(edit_address.line1 || "");
      setLine2(edit_address.line2 || "");
      setTownCity(edit_address.city || "");
      setState(edit_address.state || "");
      setPostalCode(edit_address.postalCode || "");
      setPhoneNumber(edit_address.phoneNumber || "");
      setAddressType(edit_address.addressType || []);
      setIsDefault(edit_address.isDefault || false);

      setInitialDataLoaded(true);
      console.log("Editing address:", edit_address);
    }
  }, []); // Empty dependency array to run only once

  const validateFields = () => {
    const newErrors = {} as typeof errors;

    if (!address.trim()) newErrors.name = "Address name is required.";
    if (!line1.trim()) newErrors.line1 = "Line 1 is required.";
    // FIXED: Make line2 optional since it's not always required
    // if (!line2.trim()) newErrors.line2 = "Line 2 is required.";
    if (!towncity.trim()) newErrors.towncity = "Town/City is required.";
    if (!postalcode.trim()) newErrors.postalcode = "Postal code is required.";

    // Basic postal code validation
    if (postalcode.trim() && !/^\d{5,6}$/.test(postalcode.trim())) {
      newErrors.postalcode = "Postal code must be 5-6 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateFields()) {
      alert("Please fix the validation errors before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      const addressData = {
        name: address.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        city: towncity.trim(),
        state: state.trim(), // You might want to add state field later
        postalCode: postalcode.trim(),
        addressType: addressType ?? [],
        isDefault,
        phone: phoneNumber, // Add if needed
        email: "", // Add if needed
      };

      let response;
      let savedAddress;

      if (isEditMode && edit_address) {
        // Update existing address
        response = await addressService.updateAddress(edit_address._id, {
          _id: edit_address._id,
          ...addressData,
        });

        if (response.status === 200) {
          // FIXED: Set the updated address as selected
          savedAddress = {
            _id: edit_address._id,
            ...addressData,
            createdAt: edit_address.createdAt,
            updatedAt: new Date().toISOString(),
          };
          setSelectedBillingAddress(savedAddress);
          alert("Address updated successfully");
        } else {
          alert("Failed to update address");
          return;
        }
      } else {
        // Add new address
        response = await addressService.addAddress(addressData);

        if (response.status === 200 || response.status === 201) {
          // Get the newly created address from response and set as selected
          savedAddress = (response.data as { _id: string }) || {
            id: (response.data as { _id: string })?._id,
            ...addressData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          //  Automatically select the newly added address
          setSelectedBillingAddress(savedAddress);

          alert("Address added successfully");
        } else {
          alert("Failed to add address");
          return;
        }
      }

      //  Navigate back with success flag and new address info
      if (router.canGoBack()) {
        router.back();
      } else {
        redirectToPage(containers.orderSummaryScreen, {
          newAddressAdded: true,
          selectedAddressId: savedAddress._id,
        });
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} address:`,
        error
      );
      alert(
        `Failed to ${isEditMode ? "update" : "add"} address. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear the specific field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Update the field value
    switch (field) {
      case "address":
        setAddress(value);
        break;
      case "line1":
        setLine1(value);
        break;
      case "line2":
        setLine2(value);
        break;
      case "towncity":
        setTownCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "postalcode":
        setPostalCode(value);
        break;
      default:
        console.warn(`Unhandled field: ${field}`);
    }
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //   <KeyBoardWrapper>
    //     <View style={styles.container}>
    //       <Header
    //         headerText={
    //           isEditMode ? "Edit Billing Address" : "Add Billing Address"
    //         }
    //       />
    <PageLayout
      hasFooter={false}
      hasHeader
      headerComponent={
        <Header
          headerText={
            isEditMode
              ? UPDATE_BILLING_ADDRESS_SCREEN_TITLE
              : ADD_BILLING_ADDRESS_SCREEN_TITLE
          }
        />
      }
    >
      <KeyBoardWrapper>
        <ScrollView>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.fieldLabel}>Recipient Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={address}
              onChangeText={(text) => handleInputChange("address", text)}
              placeholder="Enter address name (e.g., Home, Office)"
              maxLength={50}
            />
            {errors.name && (
              <Text style={globalStyles.errorText}>{errors.name}</Text>
            )}

            <Text style={styles.fieldLabel}>Postcode *</Text>
            <TextInput
              style={[styles.input, errors.postalcode && styles.inputError]}
              value={postalcode}
              onChangeText={(text) => handleInputChange("postalcode", text)}
              placeholder="Street address, P.O. box"
              maxLength={100}
            />
            {errors.postalcode && (
              <Text style={globalStyles.errorText}>{errors.postalcode}</Text>
            )}

            <Text style={styles.fieldLabel}>Address Line 1 *</Text>
            <TextInput
              style={[styles.input, errors.line1 && globalStyles.errorInput]}
              value={line1}
              onChangeText={(text) => handleInputChange("line1", text)}
              placeholder="House number and street name (e.g., 123 Main Street)"
              maxLength={100}
              autoCorrect={false}
              autoCapitalize="words"
            />
            {errors.line1 && (
              <Text style={globalStyles.errorText}>{errors.line1}</Text>
            )}

            <Text style={styles.fieldLabel}>Address Line 2 (optional)</Text>
            <TextInput
              style={[styles.input, errors.line2 && styles.inputError]}
              value={line2}
              onChangeText={(text) => handleInputChange("line2", text)}
              placeholder="Apartment, suite, unit, building, floor, etc."
              maxLength={100}
            />
            {errors.line2 && (
              <Text style={globalStyles.errorText}>{errors.line2}</Text>
            )}

            <Text style={styles.fieldLabel}>Town/City *</Text>
            <TextInput
              style={[styles.input, errors.towncity && styles.inputError]}
              value={towncity}
              onChangeText={(text) => handleInputChange("towncity", text)}
              placeholder="Enter town or city (e.g., London, New York)"
              maxLength={50}
            />
            {errors.towncity && (
              <Text style={globalStyles.errorText}>{errors.towncity}</Text>
            )}

            <Text style={styles.fieldLabel}>State/Province</Text>
            <TextInput
              style={[styles.input, errors.state && globalStyles.errorInput]}
              value={state}
              onChangeText={(text) => handleInputChange("state", text)}
              placeholder="Enter state or province (optional)"
              maxLength={50}
              // autoCorrect={false}
              // autoCapitalize="words"
            />
            {errors.state && (
              <Text style={globalStyles.errorText}>{errors.state}</Text>
            )}

            <Text style={styles.fieldLabel}>Phone Number *</Text>
            <TextInput
              style={[
                styles.input,
                errors.phoneNumber && globalStyles.errorInput,
              ]}
              value={phoneNumber}
              onChangeText={(text) => handleInputChange("phoneNumber", text)}
              keyboardType="phone-pad"
              placeholder="Enter phone number (e.g., +1 234 567 8900)"
              maxLength={18}
              autoCorrect={false}
            />
            {errors.phoneNumber && (
              <Text style={globalStyles.errorText}>{errors.phoneNumber}</Text>
            )}

            <View style={styles.checkBox}>
              <CheckBox
                checked={isDefault}
                onPress={() => setIsDefault(!isDefault)}
              />
              <Text>Mark as default address</Text>
            </View>
          </View>

          <View
            style={[
              // styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
          >
            {/* <View style={globalStyles.p_3}> */}
            <Button
              title={
                isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Save Edited Address"
                  : "Save Address"
              }
              onPress={handleSaveAddress}
              disabled={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default addBillingAddressScreen;
