import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
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
//import { usePaymentHandler } from "../components/usePaymentHandler";
//import { useAppContext } from "@/context/AppContext";

const addBillingAddressScreen = () => {
  const cartItems = useSelector((state: any) => [...state.cart.items]);
  const [address, setAddress] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [towncity, setTownCity] = useState("");
  const [postalcode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [billingAddress, setBillingAddress] = useState({});
  //const { handlePayment } = usePaymentHandler();
  const params = useLocalSearchParams();
  //const { selectedAddress, setSelectedAddress } = useAppContext();
  
 // const selectedMode = params?.selectedMode;

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
  }, []);
  const handleSaveAddress = async () => {
    try {
      const response = await addressService.addBillingAddress({
        name: address,
        line1: line1,
        line2: line2,
        city: towncity,
        state: "",
        country: "India",
        postalCode: postalcode,
      });
      if (response.status === 200 || response.status === 201) {
        alert("Address added successfully");
      } else {
        alert("Failed to add address");
      }
      redirectToPage(containers.billingAddressScreenScreen);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  console.log("billing address ", billingAddress);

  return (
    <View style={styles.container}>
      <Header headerText="Billing Address" />
      <ScrollView style={{ padding: 16 }}>
          <View>
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
            <Text style={styles.fieldLabel}>Country</Text>
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
            </View>
          </View>
          <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
            <View style={styles.addressList}>
              <Button
                title="Save Address"
                onPress={() => {
                  handleSaveAddress();
                  redirectToPage(containers.selectBillingAddressScreenScreen);
                }}
              />
            </View>
          </View>
          <View style={[styles.section, globalStyles.mb_0]}>
            <Text style={styles.sectionHeading}>Order Details</Text>
            <View style={globalStyles.pl_3}></View>
            <OrderSummary
              cartItems={cartItems}
              sectionHeadingStyle={styles.sectionHeading}
              hideHeading={true}
              hideItems={true}
              containerStyle={styles.orderSummaryContainer}
            />
          </View>
          {/*<View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
              <View style={styles.addressList}>
                <Button
                  title="Proceed for Payment"
                  onPress={() =>
                    handlePayment(cartItems, {
                      address: selectedAddress,
                      selectedSlot: Array.isArray(selectedMode)
                        ? selectedMode[0]
                        : selectedMode,
                      selectedMode: Array.isArray(selectedMode)
                        ? selectedMode[0]
                        : selectedMode,
                    })
                  }
                />
              </View>
          </View>*/}
          </ScrollView>
        </View>
  );
};

export default addBillingAddressScreen;
