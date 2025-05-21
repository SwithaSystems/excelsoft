import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import styles from "./orderSummeryScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import { CheckBox } from "react-native-elements";
import CartItem from "../cartScreen/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { removeFromCart } from "@/store/slices/cartSlice";
import { addToSavedItems } from "@/store/slices/savedItemsSlice";
import { orderService, PickupMode } from "@/services/orderService";
import { Address, addressService } from "@/services/addressService";
import { RootState } from "@/store/store";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import AddressItem from "../components/AddressItem";
import { useAppContext } from "@/context/AppContext";

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
};

type shippingAddressDTo = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
};

const orderSummeryScreen = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const params = useLocalSearchParams<any>();
  const { selectedBillingAddress, setSelectedBillingAddress } = useAppContext();
  const [substitutionSelected, setSubstitutionSelected] = useState(false);
  const cartItems = useSelector((state: RootState) => [...state.cart.items]);
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  // const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<any>(null);

  // Extract pickup data from route params or use default values
  const pickupAddress = params?.pickupAddress
    ? JSON.parse(params.pickupAddress as string)
    : null;
  const pickupDetails = JSON.parse(params?.pickupDetails) || "";
  const selectedMode = params?.selectedMode || "Delivery";
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  console.log("params", params);
  const { name, line1, line2, city, state, postalCode, phone } = pickupAddress;

  let shippingAddress: shippingAddressDTo | undefined;

  console.log("hi", pickupDetails);
  console.log("pickupAddress", pickupAddress);

  let displayMode = "";
  if (selectedMode === "curbsidePickup") {
    displayMode = "Curbside Pickup";
  } else if (selectedMode === "storePickup") {
    displayMode = "Store Pickup";
  } else if (selectedMode === "homeDelivery") {
    displayMode = "Home Delivery";
  } else {
    displayMode = selectedMode;
  }

  const handlePress = async () => {
    redirectToPage(containers.selectBillingAddressScreenScreen, {
      selectedMode: selectedMode,
      pickupDetails: params.pickupDetails || "N/A",
      shippingAddress: params.pickupAddress || "N/A",
    });
  };
  const handleEdit = (item: Address) => {
      setSelectedBillingAddress(item);
      redirectToPage(containers.billingAddressScreenScreen, {
        edit_address: JSON.stringify(item),
      });
    };
  const handleBillingAddressDelete = (item: Address) => {
      setIsModalVisible(true);
      setItemToDelete({ id: item._id });
    };

  const handleSelectBillingAddress = (item: Address) => {
    setSelectedId(item._id);
    setSelectedBillingAddress(item);
    console.log("Selected address:", item);
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    if (itemToDelete) {
      const itemtoSave = cartItems.find((item) => item.id === itemToDelete.id);
      if (itemtoSave) {
        dispatch(addToSavedItems(itemtoSave));
        dispatch(removeFromCart(itemToDelete.id));
      }
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };
  console.log("cartItems", cartItems);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={globalStyles.container}>
        <ScrollView>
          <Header headerText="Order Summary" />
          <View
            style={[
              globalStyles.sectionContent,
              globalStyles.pt_0,
              globalStyles.pb_0,
              // { paddingHorizontal: 26 },
            ]}
          >
            <View style={styles.section}>
              {selectedMode === "Store Pickup" ||
              selectedMode === "Curbside Pickup" ? (
                <Text style={styles.sectionHeading}>User Details</Text>
              ) : (
                <Text style={styles.sectionHeading}>Address:</Text>
              )}

              <View style={[globalStyles.pl_3, styles.deliverAddress]}>
                <Ionicons 
                    name = "home"
                    size = {24}
                    color ={colors.primary}
                    style = {{marginRight: 10}}
                  />
                <View style={styles.addressContainer}>
                  
                  <Text style = {styles.subheading}>Deliver Address:</Text>
                  {pickupAddress.firstName ? (
                    <Text style={styles.addressTextBox}>
                    {`${pickupAddress.firstName || ""} ${pickupAddress.lastName || ""}\nVehicle Type: ${pickupAddress.vehicleType ? `${pickupAddress.vehicleType}` : ""}\nVehicle Number: ${pickupAddress.vehicleNumber ? ` ${pickupAddress.vehicleNumber}` : ""}\nAdditional Details:${
                      pickupAddress.additionalDetails ? `, ${pickupAddress.additionalDetails}` : "None"} \nEmail: ${pickupAddress.email} \nContact Number: ${pickupAddress.phone}`}
                  </Text>
                  ) : (
                    <Text style={styles.addressTextBox}>
                     { `${pickupAddress.name}, ${pickupAddress.line1}, ${pickupAddress.line2 ? `${pickupAddress.line2}` : ""},${pickupAddress.city}, ${pickupAddress.postalCode}
                      Contact Number: ${pickupAddress.phone}` }
                    </Text>
                  )}
                </View>              
              </View>
              <View style={[globalStyles.pl_3]}>
                  {/* <Ionicons 
                    name = "home"
                    fontsize = {48}
                    color ={colors.primary}
                  /> */}
                  <Text style = {styles.subheading}>Billing Address</Text>
                  <FlatList
                    data={addressData.filter((address) => !address.isDefault)}
                    renderItem={({ item }) => (
                      <AddressItem
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleBillingAddressDelete}
                        showRadio
                        isSelected={item._id === selectedId}
                        onSelect={() => handleSelectBillingAddress(item)}
                      />
                    )}
                    keyExtractor={(item, index) =>
                      item._id?.toString() || `address-${index}`
                    }
                    contentContainerStyle={[
                      styles.addressList,
                      { paddingLeft: 16 },
                    ]}
                  />
                  <Button
                      title="Add New billing Address"
                      onPress={() => {
                        redirectToPage(containers.billingAddressScreenScreen, {
                          pickupDetails: JSON.stringify(pickupDetails),
                          shippingAddress: JSON.stringify(shippingAddress),
                          selectedMode: selectedMode,
                        });
                      }}
                    />
                </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Your Slot</Text>
              <View style={globalStyles.pl_3}>
                <Text>
                  {selectedMode === "homeDelivery"
                    ? `${displayMode} scheduled for ${pickupDetails?.date} at ${pickupDetails?.time}`
                    : `${displayMode} scheduled for ${pickupAddress?.date} at ${pickupAddress?.time}`}
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
                  If the product you picked is not available a similar product
                  or brand will be picked.
                </Text>
              </View>
            </View>
            <View style={[styles.section, globalStyles.mb_0]}>
              <Text style={styles.sectionHeading}>Order Details</Text>
              <View style={[globalStyles.pl_3, { marginBottom: 16 }]}>
                {cartItems.map((eachCartItem) => {
                  return (
                    <CartItem
                      itemContainerStyle={styles.cartItemContainerStyle}
                      handleDelete={handleDelete}
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
              handlePress();
              // redirectToPage(containers.billingAddressScreenScreen);
            }}
            title="Confirm Billing Address"
          />
        </View>
        <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this? You can save this item for later too."
          submitText="Delete Item"
          handleSubmit={confirmDelete}
          cancelText="Save for Later"
          handleCancel={cancelDelete}
        />
      </View>
    </SafeAreaView>
  );
};

export default orderSummeryScreen;
