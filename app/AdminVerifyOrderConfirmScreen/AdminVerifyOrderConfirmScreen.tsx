import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import colors from '../config/colors';
import { globalStyles } from '@/assets/styles/globalStyles';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';
import { redirectToPage } from '@/utilities/redirectionHelper';
import { color } from 'react-native-elements/dist/helpers';
import styles from './AdminVerifyOrderConfirmScreenStyles';

const AdminVerifyOrderConfirmScreen = () => {
  const cartItems = [
    {
      id: 1,
      image: require("../../assets/baby-bicycle.png"),
      name: "Duck Toys",
      price: "$10.00",
      originalPrice: "$18.00",
      quantity: 5,
    },
    {
      id: 2,
      image: require("../../assets/baby-bicycle.png"),
      name: "Orange Juice",
      price: "$3.00",
      originalPrice: "$5.00",
      quantity: 1,
    },
    {
      id: 3,
      image: require("../../assets/baby-bicycle.png"),
      name: "Strawberries",
      price: "$12.00",
      originalPrice: "$18.00",
      quantity: 1,
    },
  ];
  return (
    <View style={styles.container}>
      <Header headerText="Order Details Confirmation" />
      <ScrollView>
      <View style={styles.userDetails}>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                OrderID: 
              </Text>
              <Text style={styles.orderdetails}>
                #ORD-7529
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Customer: 
              </Text>
              <Text style={styles.orderdetails}>
                Emma Thompson
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Who is picking?: 
              </Text>
              <Text style={styles.orderdetails}>
                Katleena Thompson
              </Text>
            </View>
        </View>
         {cartItems.map((item) => (
            <View style={styles.cartItem} key={item.id}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>
                  {item.price} <Text style={styles.striked}>{item.originalPrice}</Text>
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.userDetails}>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Total: 
              </Text>
              <Text style={styles.subHeading}>
                $156.99
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Payment: 
              </Text>
              <Text style={styles.subHeading}>
                Done
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Pickup Choice: 
              </Text>
              <Text style={styles.orderdetails}>
                Home Delivery
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Time: 
              </Text>
              <Text style={styles.orderdetails}>
                 8am to 9am
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Date: 
              </Text>
              <Text style={styles.orderdetails}>
                04-05-25
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Address: 
              </Text>
              <Text style={styles.orderdetails}>
                H.No: 1-123, xyz street, that town, near mellinda cafe, ik, 123445.
              </Text>
            </View>
          </View>
          <Button
            onPress={() => {
              redirectToPage();
            }}
            color={colors.primary}
            title="Done"
        />
      </ScrollView>
    </View>
  );
};

export default AdminVerifyOrderConfirmScreen;
