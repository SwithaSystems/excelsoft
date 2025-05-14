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
import styles from "./billingAddressScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useLocalSearchParams } from "expo-router";
import OrderSummary from "@/components/OrderSummary";
import CartItem from "../cartScreen/components/CartItem";
import { useSelector } from "react-redux";
import { addressService } from "@/services/addressService";
import Button from "@/components/commonComponents/Button";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";

const addBillingAddressScreen = () => {
  const params = useLocalSearchParams();
  const cartItems = useSelector((state: any) => [...state.cart.items]);

  // Form state
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Component state
  const [billingAddress, setBillingAddress] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressId, setAddressId] = useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const [errors, setErrors] = useState<
    Partial<{
      address: string;
      line1: string;
      line2: string;
      towncity: string;
      postalcode: string;
      country: string;
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
      setCountry(edit_address.country || "India");
      setInitialDataLoaded(true);
      console.log("Editing address:", edit_address);
    }
  }, []); // Empty dependency array to run only once

  const validateFields = () => {
    const newErrors = {} as typeof errors;

    if (!address) newErrors.address = "Address name is required.";
    if (!line1) newErrors.line1 = "Line 1 is required.";
    if (!line2) newErrors.line2 = "Line 2 is required.";
    if (!towncity) newErrors.towncity = "Town/City is required.";
    if (!postalcode) newErrors.postalcode = "Postal code is required.";
    if (!country) newErrors.country = "Country is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateFields()) {
      alert("Please fix the validation errors before saving.");
      return;
    }
    try {
      const addressData = {
        name: address,
        line1: line1,
        line2: line2,
        city: towncity,
        state: "",
        country: country || "India",
        postalCode: postalcode,
      };

      let response;

      if (isEditMode && edit_address) {
        // Update existing address
        response = await addressService.updateBillingAddress({
          _id: edit_address._id,
          ...addressData,
        });

        if (response.status === 200) {
          alert("Address updated successfully");
        } else {
          alert("Failed to update address");
        }
      } else {
        // Add new address
        response = await addressService.addBillingAddress(addressData);
        if (response.status === 200 || response.status === 201) {
          alert("Address added successfully");
        } else {
          alert("Failed to add address");
        }
      }

      redirectToPage(containers.selectBillingAddressScreenScreen);
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} address:`,
        error
      );
      alert(
        `Failed to ${isEditMode ? "update" : "add"} address. Please try again.`
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={styles.container}>
        <Header
          headerText={isEditMode ? "Edit Billing Address" : "Billing Address"}
        />
        <ScrollView style={{ padding: 16 }}>
          <View>
            <Text style={styles.fieldLabel}>
              Address
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholder="Enter address name"
            />
            {errors.address && (
              <Text style={globalStyles.errorText}>{errors.address}</Text>
            )}
            <Text style={styles.fieldLabel}>
              Line 1<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={line1}
              onChangeText={(text) => setLine1(text)}
              placeholder="Street address, P.O. box"
            />
            {errors.line1 && (
              <Text style={globalStyles.errorText}>{errors.line1}</Text>
            )}
            <Text style={styles.fieldLabel}>
              Line 2<Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={line2}
              onChangeText={(text) => setLine2(text)}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
            {errors.line2 && (
              <Text style={globalStyles.errorText}>{errors.line2}</Text>
            )}
            <Text style={styles.fieldLabel}>
              Town/City
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={towncity}
              onChangeText={(text) => setTownCity(text)}
              placeholder="Enter town or city"
            />
            {errors.towncity && (
              <Text style={globalStyles.errorText}>{errors.towncity}</Text>
            )}
            <Text style={styles.fieldLabel}>
              Postal Code
              <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={postalcode}
              onChangeText={(text) => setPostalCode(text)}
              placeholder="Enter postal code"
            />
            {errors.postalcode && (
              <Text style={globalStyles.errorText}>{errors.postalcode}</Text>
            )}
            {/* <Text style={styles.fieldLabel}>Country</Text>
            <View style={styles.countriesdropdown}>
              <TextInput
                style={styles.input}
                value={country}
                onChangeText={(text) => setCountry(text)}
                placeholder="Select country"
              />
              <Ionicons
                name="chevron-down-outline"
                size={24}
                color={colors.black}
              />
            </View> */}
          </View>
          <View style={{ marginHorizontal: 16, marginTop: 20 }}>
            <Button
              title={isEditMode ? "Save Edited Address" : "Save Address"}
              onPress={handleSaveAddress}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default addBillingAddressScreen;
