import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
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

const addAddressScreen = () => {
  const params = useLocalSearchParams();
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [state, setState] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  console.log("params", params);
  const from = params.from;

  const handleAddAddress = async () => {
    try {
      const response = await addressService.addShippingAddress({
        name: name,
        line1: line1,
        line2: line2,
        city: towncity,
        state: "",
        country: "India",
        postalCode: postalcode,
        phone: phoneNumber,
        isDefault: isDefault,
      });
      if (response.status === 200 || response.status === 201) {
        alert("Address added successfully");
      } else {
        alert("Failed to add address");
      }
      if (from === "homeDelivery") {
        redirectToPage(containers.homeDeliveryScreenScreen);
      } else {
        redirectToPage(containers.savedAddressScreenScreen);
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header headerText="Add New Address" />
      <ScrollView>
        <Text style={styles.fieldLabel}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

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
        <Text style={styles.fieldLabel}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          keyboardType="email-address"
        />

        <Text style={styles.fieldLabel}>Postal Code</Text>
        <TextInput
          style={styles.input}
          value={postalcode}
          onChangeText={setPostalCode}
          keyboardType="email-address"
        />
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
    </View>
  );
};

export default addAddressScreen;
