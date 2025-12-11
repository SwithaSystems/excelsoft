import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import styles from "./AddAddressStyles";
import { CheckBox } from "react-native-elements";
import Header from "../../components/Header";
import { addressService } from "@/services/addressService";
import {
  clearNavigationStack,
  redirectToPage,
} from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useLocalSearchParams } from "expo-router";
import { globalStyles } from "@/assets/styles/globalStyles";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import {
  ADD_ADDRESS_SCREEN_TITLE,
  EDIT_ADDRESS_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import { showErrorAlert } from "../../../utilities/showErrorAlert";
import {
  ADDRESS_NOT_SAVED,
  ADDRESS_UPDATE_FAILED,
  DUPLICATE_ADDRESS,
} from "../../../constants/customErrorMessages";
import colors from "@/constants/colors";

const addAddressScreen = () => {
  const params = useLocalSearchParams();
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [state, setState] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressType, setAddressType] = useState([]);
  const [isDefault, setIsDefault] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressId, setAddressId] = useState("");

  // console.log("params", params);
  const from = params.from;
  const isEditMode = !!params.edit_address;
  // console.log("isEditMode", isEditMode);

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

  // Load existing address data if in edit mode
  useEffect(() => {
    if (isEditMode && params.edit_address) {
      try {
        const selectedAddress =
          typeof params.edit_address === "string"
            ? JSON.parse(params.edit_address)
            : params.edit_address;

        // console.log("Loading address for edit:", selectedAddress);

        setName(selectedAddress.name || "");
        setLine1(selectedAddress.line1 || "");
        setLine2(selectedAddress.line2 || "");
        setTownCity(selectedAddress.city || "");
        setState(selectedAddress.state || "");
        setPostalCode(selectedAddress.postalCode || "");
        setPhoneNumber(selectedAddress.phone || "");
        setAddressType(selectedAddress.addressType || []);
        setIsDefault(selectedAddress.isDefault || false);
        setAddressId(selectedAddress._id || "");

        // console.log("Address data loaded successfully");
      } catch (error) {
        console.error("Error parsing address data:", error);
        showErrorAlert({
          title: "Error",
          message: "Failed to load address data",
        });
      }
    }
  }, [isEditMode, params.edit_address]);

  // Enhanced validation functions with stricter rules
  const validateName = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return "Recipient name is required";
    }

    if (trimmedText.length < 2) {
      return "Name must be at least 2 characters long";
    }

    if (trimmedText.length > 50) {
      return "Name cannot exceed 50 characters";
    }

    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedText)) {
      return "Name can only contain letters, spaces, hyphens (-), and apostrophes (')";
    }

    // Check for consecutive special characters
    if (/[\s\-']{2,}/.test(trimmedText)) {
      return "Name cannot have consecutive special characters";
    }

    // Must start and end with a letter
    if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmedText) && trimmedText.length > 1) {
      return "Name must start and end with a letter";
    }

    return "";
  };

  const validatePostalCode = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return "Postcode is required";
    }

    if (trimmedText.length < 3) {
      return "Postcode must be at least 3 characters long";
    }

    if (trimmedText.length > 10) {
      return "Postcode cannot exceed 10 characters";
    }

    // Allow only alphanumeric characters, spaces, and hyphens
    if (!/^[a-zA-Z0-9\s\-]+$/.test(trimmedText)) {
      return "Postcode can only contain letters, numbers, spaces, and hyphens";
    }

    // Must contain at least one alphanumeric character
    if (!/[a-zA-Z0-9]/.test(trimmedText)) {
      return "Postcode must contain at least one letter or number";
    }

    return "";
  };

  const validateAddressLine1 = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return "Address Line 1 is required";
    }

    if (trimmedText.length < 5) {
      return "Address must be at least 5 characters long";
    }

    if (trimmedText.length > 100) {
      return "Address cannot exceed 100 characters";
    }

    // Allow letters, numbers, common punctuation for addresses
    if (!/^[a-zA-Z0-9\s,.\-/#'()]+$/.test(trimmedText)) {
      return "Address contains invalid characters. Only letters, numbers, spaces, and common punctuation (, . - / # ' ( )) are allowed";
    }

    // Must contain at least one alphanumeric character
    if (!/[a-zA-Z0-9]/.test(trimmedText)) {
      return "Address must contain at least one letter or number";
    }

    return "";
  };

  const validateAddressLine2 = (text: string) => {
    const trimmedText = text.trim();

    if (trimmedText.length > 100) {
      return "Address Line 2 cannot exceed 100 characters";
    }

    if (trimmedText && !/^[a-zA-Z0-9\s,.\-/#'()]+$/.test(trimmedText)) {
      return "Address Line 2 contains invalid characters. Only letters, numbers, spaces, and common punctuation (, . - / # ' ( )) are allowed";
    }

    return "";
  };

  const validateTownCity = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return "Town/City is required";
    }

    if (trimmedText.length < 2) {
      return "Town/City must be at least 2 characters long";
    }

    if (trimmedText.length > 50) {
      return "Town/City cannot exceed 50 characters";
    }

    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedText)) {
      return "Town/City can only contain letters, spaces, hyphens (-), and apostrophes (')";
    }

    // Must start and end with a letter
    if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmedText) && trimmedText.length > 1) {
      return "Town/City must start and end with a letter";
    }

    return "";
  };

  const validateState = (text: string) => {
    const trimmedText = text.trim();

    if (trimmedText.length > 50) {
      return "State cannot exceed 50 characters";
    }

    if (trimmedText && !/^[a-zA-Z\s\-']+$/.test(trimmedText)) {
      return "State can only contain letters, spaces, hyphens (-), and apostrophes (')";
    }

    if (trimmedText && trimmedText.length > 0) {
      // Must start and end with a letter if provided
      if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmedText) && trimmedText.length > 1) {
        return "State must start and end with a letter";
      }
    }

    return "";
  };

  const validatePhoneNumber = (text: string) => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      return "Phone number is required";
    }

    // Remove all non-digit characters for validation
    const digitsOnly = trimmedText.replace(/\D/g, "");

    if (digitsOnly.length < 10) {
      return "Phone number must contain at least 10 digits";
    }

    if (digitsOnly.length > 15) {
      return "Phone number cannot exceed 15 digits";
    }

    // Allow only digits, spaces, parentheses, hyphens, and plus sign
    if (!/^[\+]?[\d\s()\-]+$/.test(trimmedText)) {
      return "Phone number can only contain digits, spaces, parentheses, hyphens, and plus sign";
    }

    // Must start with + or digit
    if (!/^[\+\d]/.test(trimmedText)) {
      return "Phone number must start with a digit or plus sign";
    }

    return "";
  };

  const validateAllFields = () => {
    const newErrors: typeof errors = {};

    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;

    const postalcodeError = validatePostalCode(postalcode);
    if (postalcodeError) newErrors.postalcode = postalcodeError;

    const line1Error = validateAddressLine1(line1);
    if (line1Error) newErrors.line1 = line1Error;

    const line2Error = validateAddressLine2(line2);
    if (line2Error) newErrors.line2 = line2Error;

    const towncityError = validateTownCity(towncity);
    if (towncityError) newErrors.towncity = towncityError;

    const stateError = validateState(state);
    if (stateError) newErrors.state = stateError;

    const phoneNumberError = validatePhoneNumber(phoneNumber);
    if (phoneNumberError) newErrors.phoneNumber = phoneNumberError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time validation handlers with debouncing
  const handleNameChange = (text: string) => {
    setName(text);
    const error = validateName(text);
    setErrors((prev) => ({ ...prev, name: error || undefined }));
  };

  const handlePostalCodeChange = (text: string) => {
    setPostalCode(text);
    const error = validatePostalCode(text);
    setErrors((prev) => ({ ...prev, postalcode: error || undefined }));
  };

  const handleLine1Change = (text: string) => {
    setLine1(text);
    const error = validateAddressLine1(text);
    setErrors((prev) => ({ ...prev, line1: error || undefined }));
  };

  const handleLine2Change = (text: string) => {
    setLine2(text);
    const error = validateAddressLine2(text);
    setErrors((prev) => ({ ...prev, line2: error || undefined }));
  };

  const handleTownCityChange = (text: string) => {
    setTownCity(text);
    const error = validateTownCity(text);
    setErrors((prev) => ({ ...prev, towncity: error || undefined }));
  };

  const handleStateChange = (text: string) => {
    setState(text);
    const error = validateState(text);
    setErrors((prev) => ({ ...prev, state: error || undefined }));
  };

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    const error = validatePhoneNumber(text);
    setErrors((prev) => ({ ...prev, phoneNumber: error || undefined }));
  };

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Clear any previous general errors
      setErrors((prev) => ({ ...prev, general: undefined }));

      if (!validateAllFields()) {
        showErrorAlert({
          title: "Validation Error",
          message: "Please correct all errors before submitting the form",
        });
        return;
      }
      const addressData = {
        name: name.trim(),
        line1: line1.trim(),
        line2: line2.trim(),
        city: towncity.trim(),
        state: state.trim(),
        postalCode: postalcode.trim(),
        phone: phoneNumber.trim(),
        isDefault,
        addressType: addressType ?? ["shipping"],
      };

      let response;

      if (isEditMode) {
        response = await addressService.updateAddress(addressId, {
          ...addressData,
          _id: addressId,
        });
      } else {
        response = await addressService.addAddress(addressData);
      }

      if (response.status === 200 || response.status === 201) {
        alert(`Address ${isEditMode ? "updated" : "added"} successfully`);
        if (from === "homeDelivery") {
          clearNavigationStack(containers.homeDeliveryScreen, {
            newAddressAdded: true,
          });
        } else {
          clearNavigationStack(containers.savedAddressScreen);
        }
      } else {
        showErrorAlert({
          title: "Error",
          message: isEditMode ? ADDRESS_UPDATE_FAILED : ADDRESS_NOT_SAVED,
        });
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "adding"} address:`,
        error
      );

      const isErrorWithResponse = (
        err: any
      ): err is { response: { data: { message: string } } } =>
        err &&
        err.response &&
        err.response.data &&
        typeof err.response.data.message === "string";

      const isErrorWithMessage = (err: any): err is { message: string } =>
        err && typeof err.message === "string";

      if (
        (isErrorWithResponse(error) &&
          error.response.data.message.includes("duplicate")) ||
        (isErrorWithMessage(error) &&
          error.message.toLowerCase().includes("duplicate"))
      ) {
        showErrorAlert({
          title: "Duplicate Address",
          message: DUPLICATE_ADDRESS,
        });
      } else {
        showErrorAlert({
          title: "Error",
          message: isEditMode ? ADDRESS_UPDATE_FAILED : ADDRESS_NOT_SAVED,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable
      headerComponent={
        <Header
          headerText={
            isEditMode ? EDIT_ADDRESS_SCREEN_TITLE : ADD_ADDRESS_SCREEN_TITLE
          }
        />
      }
    >
      <KeyBoardWrapper>
        <ScrollView>
          <Text style={styles.fieldLabel}>Recipient Name *</Text>
          <TextInput
            style={[styles.input, errors.name && globalStyles.errorInput]}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter full name (e.g., John Smith)"
            maxLength={50}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {errors.name && (
            <Text style={globalStyles.errorText}>{errors.name}</Text>
          )}

          <Text style={styles.fieldLabel}>Postcode *</Text>
          <TextInput
            style={[styles.input, errors.postalcode && globalStyles.errorInput]}
            value={postalcode}
            onChangeText={handlePostalCodeChange}
            keyboardType="default"
            placeholder="Enter postcode (e.g., SW1A 1AA, 10001)"
            maxLength={10}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {errors.postalcode && (
            <Text style={globalStyles.errorText}>{errors.postalcode}</Text>
          )}

          <Text style={styles.fieldLabel}>Address Line 1 *</Text>
          <TextInput
            style={[styles.input, errors.line1 && globalStyles.errorInput]}
            value={line1}
            onChangeText={handleLine1Change}
            placeholder="House number and street name (e.g., 123 Main Street)"
            maxLength={100}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {errors.line1 && (
            <Text style={globalStyles.errorText}>{errors.line1}</Text>
          )}

          <Text style={styles.fieldLabel}>Address Line 2</Text>
          <TextInput
            style={[styles.input, errors.line2 && globalStyles.errorInput]}
            value={line2}
            onChangeText={handleLine2Change}
            placeholder="Apartment, suite, unit (optional)"
            maxLength={100}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {errors.line2 && (
            <Text style={globalStyles.errorText}>{errors.line2}</Text>
          )}

          <Text style={styles.fieldLabel}>Town/City *</Text>
          <TextInput
            style={[styles.input, errors.towncity && globalStyles.errorInput]}
            value={towncity}
            onChangeText={handleTownCityChange}
            placeholder="Enter town or city (e.g., London, New York)"
            maxLength={50}
            autoCorrect={false}
            autoCapitalize="words"
          />
          {errors.towncity && (
            <Text style={globalStyles.errorText}>{errors.towncity}</Text>
          )}

          <Text style={styles.fieldLabel}>State/Province</Text>
          <TextInput
            style={[styles.input, errors.state && globalStyles.errorInput]}
            value={state}
            onChangeText={handleStateChange}
            placeholder="Enter state or province (optional)"
            maxLength={50}
            autoCorrect={false}
            autoCapitalize="words"
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
            onChangeText={handlePhoneNumberChange}
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
              checkedColor = {colors.primary}
              uncheckedColor= {colors.secondary}
            />
            <Text>Mark as default address</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            s
            <Text style={styles.buttonText}>
              {isSubmitting
                ? `${isEditMode ? "Updating" : "Adding"} Address...`
                : `${isEditMode ? "Update" : "Add"} Address`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default addAddressScreen;
