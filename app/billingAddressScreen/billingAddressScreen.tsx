import React, { useState } from "react";
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

const billingAddressScreen = () => {
const cartItems = useSelector((state: any) => [...state.cart.items]);
const [address, setAddress] = useState("");
const [line1, setLine1] = useState("");
const [line2, setLine2] = useState("");
const [towncity, setTownCity] = useState("");
const [postalcode, setPostalCode] = useState("");
const [country, setCountry] = useState("");
  return (
    <View style={styles.container}>
       <Header headerText="Billing Address" />
       <View>
       <Text style={styles.fieldLabel}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.fieldLabel}>Line 1</Text>
          <TextInput
            style={styles.input}
            value={line1}
            onChangeText={setLine1}
          />

          <Text style={styles.fieldLabel}>Line 2</Text>
          <TextInput
            style={styles.input}
            value={line2}
            onChangeText={setLine2}
            keyboardType="phone-pad"
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
          <View style = {styles.countriesdropdown}>
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
        <View style={[styles.section, globalStyles.mb_0]}>
          <Text style={styles.sectionHeading}>Order Details</Text>
          <View style={globalStyles.pl_3}>
        </View>
          <OrderSummary
            cartItems={cartItems}
            sectionHeadingStyle={styles.sectionHeading}
            hideHeading={true}
            hideItems={true}
            containerStyle={styles.orderSummaryContainer}
          />
      </View>

    </View>
  );
};

export default billingAddressScreen;
