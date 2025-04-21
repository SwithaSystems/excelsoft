import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./savedAddressScreenStyles";
import Button from "@/components/commonComponents/Button";
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

interface Address {
  id: string;
  name: string;
  street: string;
  town: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const savedAddressScreen = () => {
  const addressData = [
    {
      id: "1",
      name: "Katleena M. Dennis",
      street: "H.No: 1-123, xyz street,",
      town: "That Town, Near Mellinda Cafe,",
      country: "UK, 3123456.",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: "2",
      name: "Katherina M. Dennis",
      street: "H.No: 1-123, xyz street,",
      town: "That Town, Near Mellinda Cafe,",
      country: "UK, 3123456.",
      phone: "+1 (555) 123-4567",
      isDefault: false,
    },
    {
      id: "3",
      name: "Mandallina M. Dennis",
      street: "H.No: 1-123, xyz street,",
      town: "That Town, Near Mellinda Cafe,",
      country: "UK. 3123456.",
      phone: "+1 (555) 123-4567",
      isDefault: false,
    },
  ];

  const AddressItem = ({ item }: { item: Address }) => (
    <View style={styles.addressContainer}>
      <View>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text>{item.street}</Text>
        <Text>{item.town}</Text>
        <Text>{item.country}</Text>
        <Text>Phone No: {item.phone}</Text>
      </View>
      <View>
        <View style={styles.iconRow}>
          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => {
              redirectToPage(containers.editAddressScreenScreen);
            }}
          >
            <Ionicons name="create-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Header headerText="Saved Address" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.sectionTitle}>Default Address</Text>
          <FlatList
            data={addressData.filter((address) => address.isDefault)}
            renderItem={({ item }) => <AddressItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.addressList}
          />

          <Text style={styles.sectionTitle}>Other Address</Text>
          <FlatList
            data={addressData.filter((address) => !address.isDefault)}
            renderItem={({ item }) => <AddressItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.addressList}
          />
        </View>
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
