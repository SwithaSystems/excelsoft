import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import styles from "./orderSummeryScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { router, useLocalSearchParams } from "expo-router";
import { CheckBox } from "react-native-elements";
import CartItem from "../cartScreen/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useSelector } from "react-redux";

type OrderSummeryScreenParams = {
  orderId: string;
  address?: string;
  pickupAddress?: string;
  selectedDate?: string;
  selectedSlot?: string;
  selectedMode?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  additionalDetails?: string;
}

const orderSummeryScreen = () => {
  const params = useLocalSearchParams<OrderSummeryScreenParams>();
  const [substitutionSelected, setSubstitutionSelected] = useState(false);
  const cartItems = useSelector((state:any) => [...state.cart.items]);

  
  // Extract pickup data from route params or use default values
  const pickupAddress = params.pickupAddress || "";
  const selectedDate = params.selectedDate || "";
  const selectedSlot = params.selectedSlot || "";
  const selectedMode = params.selectedMode || "Delivery";
  
    
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
              <Text style={styles.addressTextBox}>{pickupAddress}</Text>
            </View>
          </View>76
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Your Slot</Text>
            <View style={globalStyles.pl_3}>
              <Text>
                {selectedMode} scheduled for {selectedDate} at {selectedSlot}
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
