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
import styles from "./billingAddressScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import OrderSummary from "@/components/OrderSummary";
import CartItem from "../cartScreen/components/CartItem";
import { useSelector } from "react-redux";
import { addressService } from "@/services/addressService";
import Button from "@/components/commonComponents/Button";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import { useAppContext } from "@/context/AppContext";
import PageLayout from "../pageLayoutProps";

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

  // Component state
  const [billingAddress, setBillingAddress] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<
    Partial<{
      address: string;
      line1: string;
      line2: string;
      towncity: string;
      postalcode: string;
    }>
  >({});

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
        const billingAddress =
          await addressService.getAllBillingAddress_userId();
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
      setPostalCode(edit_address.postalCode || "");
      setInitialDataLoaded(true);
      console.log("Editing address:", edit_address);
    }
  }, []); // Empty dependency array to run only once

  const validateFields = () => {
    const newErrors = {} as typeof errors;

    if (!address.trim()) newErrors.address = "Address name is required.";
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
        state: "", // You might want to add state field later
        postalCode: postalcode.trim(),
        // Add other fields that might be required
        phone: "", // Add if needed
        email: "", // Add if needed
      };

      let response;
      let savedAddress;

      if (isEditMode && edit_address) {
        // Update existing address
        response = await addressService.updateBillingAddress({
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
        response = await addressService.addBillingAddress(addressData);

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
        redirectToPage(containers.orderSummeryScreenScreen, {
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
      case "postalcode":
        setPostalCode(value);
        break;
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
            isEditMode ? "Edit Billing Address" : "Add Billing Address"
          }
        />
      }
    >
      <KeyBoardWrapper>
        <ScrollView style={{ padding: 16 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.fieldLabel}>
              Address Name
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={address}
              onChangeText={(text) => handleInputChange("address", text)}
              placeholder="Enter address name (e.g., Home, Office)"
              maxLength={50}
            />
            {errors.address && (
              <Text style={globalStyles.errorText}>{errors.address}</Text>
            )}

            <Text style={styles.fieldLabel}>
              Line 1<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.line1 && styles.inputError]}
              value={line1}
              onChangeText={(text) => handleInputChange("line1", text)}
              placeholder="Street address, P.O. box"
              maxLength={100}
            />
            {errors.line1 && (
              <Text style={globalStyles.errorText}>{errors.line1}</Text>
            )}

            <Text style={styles.fieldLabel}>Line 2 (optional)</Text>
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

            <Text style={styles.fieldLabel}>
              Town/City
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.towncity && styles.inputError]}
              value={towncity}
              onChangeText={(text) => handleInputChange("towncity", text)}
              placeholder="Enter town or city"
              maxLength={50}
            />
            {errors.towncity && (
              <Text style={globalStyles.errorText}>{errors.towncity}</Text>
            )}

            <Text style={styles.fieldLabel}>
              Postal Code
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.postalcode && styles.inputError]}
              value={postalcode}
              onChangeText={(text) => handleInputChange("postalcode", text)}
              placeholder="Enter postal code"
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.postalcode && (
              <Text style={globalStyles.errorText}>{errors.postalcode}</Text>
            )}
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
              //  style={[
              //   styles.submitButton,
              // //  isSubmitting && styles.submitButtonDisabled,
              //  ]}
            />
            {/* </View> */}
          </View>
        </ScrollView>
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default addBillingAddressScreen;
