import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import styles from "./orderSummeryScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { router } from "expo-router";
import { CheckBox } from "react-native-elements";
import CartItem from "../cartScreen/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const orderSummeryScreen = () => {
  const [address, setAddress] = useState("");
  const [substitutionSelected, setSubstitutionSelected] = useState(false);
  const selectedDeliveryDetails = {
    selectedDate: "29/01/2025",
    selectedSlot: "11:00 AM to 12:00 PM",
    selectedMode: "Home Delivery",
  };
  const cartItems = [
    {
      id: 1,
      image: require("../../assets/baby-bicycle.png"),
      name: "Duck Toys",
      price: 10.0,
      originalPrice: 6.99,
      quantity: 1,
    },
    {
      id: 2,
      image: require("../../assets/baby-bicycle.png"),
      name: "Orange Juice",
      price: 3.0,
      quantity: 2,
    },
    {
      id: 3,
      image: require("../../assets/baby-bicycle.png"),
      name: "Whole Wheat Bread",
      price: 12.0,
      quantity: 1,
    },
  ];
  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <Header headerText="Order Details" />
        <View
          style={[
            globalStyles.sectionContent,
            globalStyles.pt_0,
            globalStyles.pb_0,
            { paddingHorizontal: 26 },
          ]}
        >
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Address</Text>
            <View style={globalStyles.pl_3}>
              <TextInput
                style={styles.addressTextBox}
                multiline={true}
                numberOfLines={4}
                placeholder="Enter Adress"
                onChangeText={(newText) => setAddress(newText)}
                value={address}
              />
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Your Slot</Text>
            <View style={globalStyles.pl_3}>
              <Text>
                You’ve selected a delivery slot for{" "}
                {selectedDeliveryDetails.selectedDate} from{" "}
                {selectedDeliveryDetails.selectedSlot} with{" "}
                {selectedDeliveryDetails.selectedMode} as your chosen mode. If
                you’d like to change the delivery time or method, please select
                a new slot.&nbsp;
                <TouchableOpacity
                  onPress={() => {
                    redirectToPage(containers.pickUpModescreenScreen);
                  }}
                >
                  <Text style={styles.changeSlotText}>Change the slot</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Substitutions</Text>
            <View style={globalStyles.pl_3}>
              <CheckBox
                title="Choose Substitutions for my orders."
                checked={substitutionSelected}
                onPress={() =>
                  setSubstitutionSelected(
                    (substitutionSelected) => !substitutionSelected
                  )
                }
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.checkBoxText}
              />
              <Text style={styles.sectionText}>
                If the product you picked is not available a similar product or
                brand will be picked.
              </Text>
            </View>
          </View>
          <View style={[styles.section, globalStyles.mb_0]}>
            <Text style={styles.sectionHeading}>Order Details</Text>
            <View style={globalStyles.pl_3}>
              {cartItems.map((eachCartItem) => {
                return (
                  <CartItem
                    itemContainerStyle={styles.cartItemContainerStyle}
                    handleDelete={() => {}}
                    key={eachCartItem.id}
                    cartItem={eachCartItem}
                  />
                );
              })}
            </View>
            <OrderSummary
              cartItems={cartItems}
              sectionHeadingStyle={styles.sectionHeading}
              hideHeading={true}
              containerStyle={styles.orderSummaryContainer}
            />
          </View>
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 24, paddingBottom: 14 }}>
        <Button
          onPress={() => {
            redirectToPage(containers.orderSuccessfulScreenScreen);
          }}
          title="Confirm and Checkout"
        />
      </View>
    </View>
  );
};

export default orderSummeryScreen;
