import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import styles from "./cancelOrderStyles";
import { CheckBox } from "react-native-elements";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";

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

const cancelOrder = () => {
  const params = useLocalSearchParams<OrderSummeryScreenParams>();
  const { orderDetails } = useLocalSearchParams();
  const [selected, setSelected] = useState<
    Partial<{ id: string; params: any }>
  >({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [amPm, setAmPm] = useState("am");
  const [period, setPeriod] = useState("am");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const pickupAddress = params.pickupAddress || "";

  console.log("orderDetails", orderDetails);

  // const cartItems = orderDetails?.products.map((item: any) => ({
  //   id: item.id,
  //   image: item.image,
  //   name: item.name,
  //   price: item.price,
  //   originalPrice: item.originalPrice,
  //   quantity: item.quantity,
  // }));
  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]); // Format date as yyyy-mm-dd,
  };

  return (
    <View style={styles.container}>
      <Header headerText="Cancel Order" />
      <ScrollView>
        <View style={styles.returnOrderCategory}>
          <Text style={styles.returnOrderItemText}>Order Number:</Text>
          <Text style={styles.returnOrderId}>#ORD-2025-1234</Text>
        </View>

        {cartItems.map((item) => (
          <View style={styles.cartItem} key={item.id}>
            <Image source={item.image} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>
                {item.price}{" "}
                <Text style={styles.striked}>{item.originalPrice}</Text>
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <CheckBox
                checked={selectedItems.includes(item.id)}
                onPress={() => {
                  if (selectedItems.includes(item.id)) {
                    setSelectedItems(
                      selectedItems.filter((id) => id !== item.id)
                    );
                  } else {
                    setSelectedItems([...selectedItems, item.id]);
                  }
                }}
                containerStyle={styles.checkBoxContainer}
                textStyle={styles.checkBoxText}
              />
            </View>
          </View>
        ))}
        <View style={styles.returnReason}>
          <Text style={styles.label}>Reason for Cancellation</Text>
          <View style={styles.selectReason}>
            <TextInput
              placeholder="Tell us why"
              style={styles.placeholderText}
            />
            <Ionicons
              name="chevron-down-outline"
              size={24}
              color={colors.black}
            />
          </View>
        </View>
        <View style={styles.addComments}>
          <Text style={styles.label}>
            Do you want to talk about your experience?
          </Text>
          <TextInput
            style={[styles.commentsText]}
            placeholder="Add additional comments"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.cancelOrderDetails}>
          <Text style={styles.label}>Cancel Order Details:</Text>
          <View style={styles.returnOrderSummary}>
            <Text style={styles.returnOrderDetails}>Order Number: </Text>
            <Text style={styles.returnOrderDetails}>#ORD-2025-1234</Text>
          </View>
          <View style={styles.returnOrderSummary}>
            <Text style={styles.returnOrderDetails}>Items being returned:</Text>
            <Text style={styles.returnOrderDetails}>1</Text>
          </View>
          <View style={styles.returnOrderSummary}>
            <Text style={styles.returnOrderItemText}>Refund Total:</Text>
            <Text style={styles.returnOrderItemText}>$25.00</Text>
          </View>
        </View>

        <Text style={styles.noteText}>
          Note: Refund money would be processed in 3 to 5 business days.{" "}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit Cancellation Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.replacementButton}>
            <Text style={styles.buttonText}>Keep Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default cancelOrder;
