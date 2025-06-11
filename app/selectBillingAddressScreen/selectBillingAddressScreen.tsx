import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";
import styles from "./selectBillingAddressScreenStyles";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import AddressItem from "../components/AddressItem";
import { Address, addressService } from "@/services/addressService";
import { useAppContext } from "@/context/AppContext";
import OrderSummary from "@/components/OrderSummary";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import colors from "../config/colors";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import { usePaymentHandler } from "../components/usePaymentHandler";

type PickupDetailsDto = {
  time: string;
  date: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicleType?: string;
  vehicleNumber?: string;
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

const selectBillingAddressScreen = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const { selectedBillingAddress, setSelectedBillingAddress } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const cartItems = useSelector((state: any) => [...state.cart.items]);
  const { handlePayment } = usePaymentHandler();
  const params = useLocalSearchParams();

  console.log("params in billing screen", params);

  const selectedMode = params?.selectedMode;
  // const selectShippingAddress = params?.shippingAddress;
  // const pickupDetails = params?.pickupDetails as PickupDetailsDto;
  let pickupDetails: PickupDetailsDto | undefined;

  if (typeof params.pickupDetails === "string") {
    try {
      pickupDetails = JSON.parse(params.pickupDetails);
    } catch (err) {
      console.error("Failed to parse pickupDetails:", err);
      pickupDetails = undefined;
    }
  } else if (
    typeof params.pickupDetails === "object" &&
    !Array.isArray(params.pickupDetails)
  ) {
    pickupDetails = params.pickupDetails as PickupDetailsDto;
  } else {
    pickupDetails = undefined;
  }
  let shippingAddress: shippingAddressDTo | undefined;

  if (typeof params.shippingAddress === "string") {
    try {
      shippingAddress = JSON.parse(params.shippingAddress);
    } catch (err) {
      console.error("Failed to parse shippingAddress:", err);
      shippingAddress = undefined;
    }
  } else if (
    typeof params.shippingAddress === "object" &&
    !Array.isArray(params.shippingAddress)
  ) {
    shippingAddress = params.shippingAddress as shippingAddressDTo;
  } else {
    shippingAddress = undefined;
  }

  console.log("selectShippingAddress", shippingAddress);
  console.log("pickupDetails", pickupDetails);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAllBillingAddress_userId();
        setAddressData(response);
        console.log("Billing addresses:", response);
        // Set initial selected address if one exists in context
        if (selectedBillingAddress?._id) {
          setSelectedId(selectedBillingAddress._id);
        } else if (response.length > 0) {
          setSelectedBillingAddress(response[0]);
          setSelectedId(response[0]._id);
        }
      } catch (err) {
        console.error("Error fetching billing addresses:", err);
      }
    };
    fetchAddresses();
  }, []);
  console.log("Billingaddress saved address", addressData);
  console.log("Selected address ID:", selectedId);
  const confirmDelete = async (itemToDelete: any) => {
    console.log("Item to delete:", itemToDelete);
    if (itemToDelete) {
      try {
        const response = await addressService.deleteBillingAddress(
          itemToDelete.id
        );
        if (response.success) {
          setAddressData((prev) =>
            prev.filter((item) => item._id !== itemToDelete.id)
          );
        } else {
          alert("Failed to delete address.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert("Something went wrong.");
      }
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };
  const handleEdit = (item: Address) => {
    setSelectedBillingAddress(item);
    redirectToPage(containers.billingAddressScreenScreen, {
      edit_address: JSON.stringify(item),
    });
  };

  const handleDelete = (item: Address) => {
    setIsModalVisible(true);
    setItemToDelete({ id: item._id });
  };
  const handleSelectBillingAddress = (item: Address) => {
    setSelectedId(item._id);
    setSelectedBillingAddress(item);
    console.log("Selected address:", item);
  };
  console.log("isPaymentEnabled Breakdown:", {
    cartItemsCount: cartItems.length,
    billingAddressExists: !!selectedBillingAddress,
    shippingAddressExists: !!shippingAddress,
    pickupDate: pickupDetails?.date,
    pickupTime: pickupDetails?.time,
    selectedMode: selectedMode,
  });

  const isPickupMode =
    selectedMode === "curbsidePickup" || selectedMode === "storePickup";
  const isPaymentEnabled =
    cartItems.length > 0 &&
    selectedBillingAddress &&
    (isPickupMode || shippingAddress) &&
    pickupDetails?.date &&
    pickupDetails?.time &&
    selectedMode &&
    (Array.isArray(selectedMode) ? selectedMode[0] : selectedMode);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <KeyBoardWrapper>
        <View style={globalStyles.container}>
          <Header headerText="Billing Address" />
          {/* <ScrollView> */}
          <FlatList
            ListHeaderComponent={
              <>
                <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
                  <Text style={styles.sectionTitle}>Address</Text>
                  <FlatList
                    data={addressData.filter((address) => !address.isDefault)}
                    renderItem={({ item }) => (
                      <AddressItem
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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
                </View>
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                  <View style={styles.addressList}>
                    <Button
                      title="Add New Address"
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
                <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                  <View style={styles.addressList}>
                    <Button
                      title="Proceed for Payment"
                      disabled={!isPaymentEnabled}
                      onPress={() =>
                        handlePayment(cartItems, {
                          billingAddress: selectedBillingAddress,
                          shippingAddress: shippingAddress,
                          pickupdetails: pickupDetails,
                          deliveryDate: pickupDetails?.date,
                          deliveryTime: pickupDetails?.time,
                          selectedSlot: Array.isArray(selectedMode)
                            ? selectedMode[0]
                            : selectedMode,
                          selectedMode: Array.isArray(selectedMode)
                            ? selectedMode[0]
                            : selectedMode,
                        })
                      }
                      style={
                        isPaymentEnabled ? styles.activeBtn : styles.disabledBtn
                      }
                      textStyle={styles.buttonText}
                    />
                  </View>
                </View>
                <ConfirmationModal
                  onClose={() => {
                    setIsModalVisible(false);
                  }}
                  isModalVisible={isModalVisible}
                  text="Are you sure you want to delete this address?"
                  submitText="Delete Address"
                  handleSubmit={() => confirmDelete(itemToDelete!)}
                  cancelText="Cancel"
                  handleCancel={cancelDelete}
                />
              </>
            }
            data={[]}
            renderItem={() => null}
          />
          {/* </ScrollView> */}
        </View>
      </KeyBoardWrapper>
    </SafeAreaView>
  );
};

export default selectBillingAddressScreen;
