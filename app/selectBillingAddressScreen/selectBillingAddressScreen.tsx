import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
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
import { usePaymentHandler } from "../components/usePaymentHandler";
import { useLocalSearchParams } from "expo-router";

const selectBillingAddressScreen = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const { selectedAddress, setSelectedAddress } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const cartItems = useSelector((state: any) => [...state.cart.items]);
  const { handlePayment } = usePaymentHandler();
  const params = useLocalSearchParams();

  const selectedMode = params?.selectedMode;
  const selectedSlot = params?.selectedSlot;
  const selectedDate = params?.selectedDate;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAllBillingAddress_userId();
        setAddressData(response);
        console.log("Billing addresses:", response);
      } catch (err) {
        console.error("Error fetching billing addresses:", err);
      }
    };

    fetchAddresses();
  }, []);
  console.log("Billingaddress saved address", addressData);

  const confirmDelete = async () => {
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
    setSelectedAddress(item);
    redirectToPage(containers.editAddressScreenScreen);
  };

  const handleDelete = (item: Address) => {
    setIsModalVisible(true);
    setItemToDelete({ id: item._id });
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="Billing Address" />
      <ScrollView>
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
                onSelect={() => setSelectedAddress(item)}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.addressList}
          />
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={styles.addressList}>
            <Button
              title="Add New Address"
              onPress={() => {
                redirectToPage(containers.addAddressScreenScreen);
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
        </View>
        <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this address?"
          submitText="Delete Address"
          handleSubmit={confirmDelete}
          cancelText="Cancel"
          handleCancel={cancelDelete}
        />
      </ScrollView>
    </View>
  );
};

export default selectBillingAddressScreen;
