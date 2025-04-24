import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./savedAddressScreenStyles";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Address, addressService } from "@/services/addressService";
import { useAppContext } from "@/context/AppContext";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import AddressItem from "../components/AddressItem";

const savedAddressScreen = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const { setSelectedAddress } = useAppContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAllShppingAddress_userId();
        setAddressData(response);
        console.log("Shipping addresses:", response);
      } catch (err) {
        console.error("Error fetching shipping addresses:", err);
      }
    };

    fetchAddresses();
  }, []);
  console.log("shipping address saved address", addressData);

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await addressService.deleteShippingAddress(
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

  // const AddressItem = ({ item }: { item: Address }) => (
  //   <View style={styles.addressContainer}>
  //     <View>
  //       <View style={styles.nameRow}>
  //         <Text style={styles.name}>{item.name}</Text>
  //       </View>
  //       <Text>{item.line1}</Text>
  //       <Text>{item.line2}</Text>
  //       <Text>{item.city}</Text>
  //       <Text>{item.state}</Text>
  //       <Text>{item.country}</Text>
  //       <Text>{item.postalCode}</Text>
  //       <Text>Phone No: {item.phone}</Text>
  //     </View>
  //     <View>
  //       <View style={styles.iconRow}>
  //         <TouchableOpacity
  //           style={{ marginRight: 12 }}
  //           onPress={() => {
  //             setSelectedAddress(item);
  //             redirectToPage(containers.editAddressScreenScreen);
  //           }}
  //         >
  //           <Ionicons name="create-outline" size={24} color="black" />
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => {
  //             setIsModalVisible(true);
  //             setItemToDelete({ id: item._id });
  //           }}
  //         >
  //           <Ionicons name="trash-outline" size={24} color="red" />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </View>
  // );

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
      <Header headerText="Saved Address" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.sectionTitle}>Default Address</Text>
          <FlatList
            data={addressData.filter((address) => address.isDefault)}
            renderItem={({ item }) => (
              <AddressItem
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.addressList}
          />

          <Text style={styles.sectionTitle}>Address</Text>
          <FlatList
            data={addressData.filter((address) => !address.isDefault)}
            renderItem={({ item }) => (
              <AddressItem
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.addressList}
          />
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
    </View>
  );
};

export default savedAddressScreen;
