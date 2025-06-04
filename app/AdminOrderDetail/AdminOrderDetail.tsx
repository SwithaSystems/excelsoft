import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import styles from "./AdminOrderDetailStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import Header from "@/components/Header";
import CartItem from "../cartScreen/components/CartItem";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/commonComponents/Button";
import Footer from "@/components/Footer";
import colors from "../config/colors";

const AdminOrderDetail = () => {
  const [status, setStatus] = useState("Pending");
  const orderStatuses = ["Pending", "Processed", "Delivered", "Cancel"];
  const cartItems = [
    {
      id: 1,
      image: require("assets/DuckToys.png"), // Replace with your image paths
      name: "Duck Toys",
      price: 10.0,
      originalPrice: 6.99,
      quantity: 1,
    },
    {
      id: 2,
      image: require("../../assets/OrangeJuice.png"),
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
    <>
      <SafeAreaView style={globalStyles.safeAreaContainer}>
        <View style={[globalStyles.container, { flex: 1 }]}>
          <Header headerText="Order Details" />
          <SafeAreaView style={{ flex: 1 }}>
            <View style={[globalStyles.sectionContent, globalStyles.pt_0, { flex: 1 }]}>
            <ScrollView 
              style={{ flex: 1 }} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            >
              {cartItems.map((eachCartItem) => {
                return (
                  <CartItem
                    hideActions={true}
                    itemContainerStyle={{ paddingHorizontal: 0 }}
                    key={eachCartItem.id}
                    cartItem={eachCartItem}
                    showStockStatus={true}
                    stockAvailable={true}
                  />
                );
              })}
              <View>
                <Text
                  style={[
                    globalStyles.size_16,
                    globalStyles.fontWeight500,
                    globalStyles.mb_1,
                  ]}
                >
                  Total: £156.99
                </Text>
                <Text
                  style={[
                    globalStyles.size_16,
                    globalStyles.fontWeight500,
                    globalStyles.mb_1,
                  ]}
                >
                  Payment: DONE
                </Text>
                <Text
                  style={[
                    globalStyles.size_16,
                    globalStyles.fontWeight500,
                    globalStyles.mb_2,
                  ]}
                >
                  Deliver To:
                </Text>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  <Text
                    style={[globalStyles.size_16, globalStyles.fontWeight500]}
                  >
                    Pick Up Choice:&nbsp;
                  </Text>
                  Home Delivery
                </Text>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  <Text
                    style={[globalStyles.size_16, globalStyles.fontWeight500]}
                  >
                    Time:&nbsp;
                  </Text>
                  8 am to 9 am
                </Text>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  <Text
                    style={[globalStyles.size_16, globalStyles.fontWeight500]}
                  >
                    Date:&nbsp;
                  </Text>
                  03-02-2025
                </Text>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  <Text
                    style={[globalStyles.size_16, globalStyles.fontWeight500]}
                  >
                    Address:&nbsp;
                  </Text>
                  H.No: 1-123, xyz street, That Town, Near Mellinda Cafe, UK,
                  3123456
                </Text>
                
                {/* FIXED: Status section - simple approach */}
                <Text
                  style={[
                    globalStyles.size_16,
                    globalStyles.fontWeight500,
                    globalStyles.mt_2,
                    globalStyles.mb_1,
                  ]}
                >
                  Status:
                </Text>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 50,
                  justifyContent: 'center',
                }}>
                  <Picker
                    selectedValue={status}
                    style={{
                      height: 50,
                    }}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                  >
                    {orderStatuses.map((each, index) => {
                      return (
                        <Picker.Item
                          key={index}
                          label={each}
                          value={each}
                        />
                      );
                    })}
                  </Picker>
                </View>
              </View>
              <View style={[globalStyles.mt_4, { marginBottom: 40 }]}>
                <Button onPress={() => {}} title="Update Details" />
              </View>
            </ScrollView>
            </View>
          </SafeAreaView>
        </View>
        <Footer />
      </SafeAreaView>
    </>
  );
};

export default AdminOrderDetail;