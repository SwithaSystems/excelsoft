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
    if (edit_address) {
      const selectedAddress = edit_address
        ? JSON.parse(edit_address as string)
        : null;
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
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <Header headerText="Edit Address" />

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
      </View>
    </SafeAreaView>
  );
};

export default editAddressScreen;
