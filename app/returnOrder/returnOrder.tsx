import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import styles from "./returnOrderStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import { CheckBox } from "react-native-elements";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { Picker } from "@react-native-picker/picker"; // Correct picker import for cross-platform
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import ReturnReplaceToggle from "./return_replace_radioButtons";

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

const options = [
  {
    id: "store",
    label: "Drop at the store",
    description: "Drop your order at the store",
    icon: "location",
    params: { mode: "store" },
  },
  {
    id: "home",
    label: "Pickup at your doorstep",
    description: "Free pickup from your home in 24 hours.",
    icon: "home-outline",
    params: { mode: "home" },
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

const ReturnOrder = () => {
  const params = useLocalSearchParams();
  const rawOrderDetails = params.orderDetails;
  const [selected, setSelected] = useState<
    Partial<{ id: string; params: any }>
  >({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amPm, setAmPm] = useState("am");
  const [period, setPeriod] = useState("am");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const pickupAddress = params.pickupAddress || "";
  const [mode, setMode] = useState("return");
  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");
  

  console.log("raw orderDetials", rawOrderDetails);

  const orderDetails =
    typeof rawOrderDetails === "string"
      ? JSON.parse(rawOrderDetails)
      : rawOrderDetails;

  console.log("orderDetails parsed:", orderDetails);
 {/* const cartItems = orderDetails?.products.map((item: any) => ({
    id: item.id,
    image: item.image,
    name: item.name,
    price: item.price,
    originalPrice: item.originalPrice,
    quantity: item.quantity,
  }));*/}

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]);
  };

  return (
    <View style={styles.container}>
      <Header headerText="Return orders" />
      <ScrollView style={{padding:16}}>
        <ReturnReplaceToggle mode={mode} setMode={setMode} />
        <View style={styles.returnOrderCategory}>
          <Text style={styles.returnOrderItemText}>Order Number:</Text>
          <Text style={styles.returnOrderId}>#ORD-2025-1234</Text>
        </View>
        
        <View style={styles.cartItemsContainer}>
          {cartItems.map((item: any) => (
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
        </View>

        <View style={styles.returnModeCategory}>
          <Text style={styles.label}>Return Mode:</Text>
          <View style={styles.returnSection}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.option,
                  selected?.id === option.id && styles.selectedOption,
                ]}
                onPress={() => setSelected(option)}
              >
              <View style={styles.returnModes}>
                <View style={styles.textContainer}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>
                  <View style={styles.radioCircle}>
                    {selected.id === option.id && (
                      <View style={styles.selectedRadio} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {selected.id === "home" && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Address</Text>
            <View style={globalStyles.pl_3}>
              <Text style={styles.addressTextBox}>{pickupAddress}</Text>
            </View>
          </View>
        )}
        <View style={styles.datetimeContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date: <Text style={styles.required}>*</Text></Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                style={globalStyles.webDateInput}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            ) : (
              <TouchableOpacity
                style={globalStyles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{date}</Text>
              </TouchableOpacity>
            )}
            {showDatePicker && (
              <DateTimePicker
                value={new Date(date)}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
          <View style={styles.timeRow}>
          <Text style={styles.inputLabel}>Time: *</Text>
          <View style={globalStyles.timeContainer}>
            <TextInput
              style={globalStyles.timeInput}
              placeholder="HH"
              keyboardType="numeric"
              maxLength={2}
              value={hours}
              onChangeText={setHours}
            />
            <Text>:</Text>
            <TextInput
              style={globalStyles.timeInput}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
              value={minutes}
              onChangeText={setMinutes}
            />
            <View
              style={{
                borderColor: colors.primary,
                borderWidth: 1,
                height: 40,
                width: 150,
                borderRadius: 8,
                justifyContent: "center",
              }}
            >
              <Picker
                selectedValue={period}
                style={{
                  // height: 50,
                  width: 150,
                  color: colors.black,
                }}
                onValueChange={(itemValue) => setPeriod(itemValue)}
              >
                <Picker.Item label="AM" value="am" />
                <Picker.Item label="PM" value="pm" />
              </Picker>
            </View>
          </View>
        </View>
        </View>
        <View style={styles.returnReason}>
          <Text style={styles.label}>Reason for Return</Text>
          <View style={styles.selectReason}>
            <TextInput
              placeholder="Tell us why"
              style={styles.placeholderText}
            />
            <Ionicons
              name="chevron-down-outline"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>
        <View style={styles.addComments}>
          <Text style={styles.label}>Do you want to talk about your experience?</Text>
          <TextInput
            style={[styles.commentsText]}
            placeholder="Add additional comments"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.refundStatusSection}>
          <Text style={styles.label}>Refund Status</Text>
          <View style={styles.returnOrderSummary}>
            <Text style={styles.returnOrderDetails}>Order Number: </Text>
            <Text style={styles.returnOrderDetails}>#ORD-2025-1234</Text>
          </View>
          <View style={styles.returnOrderSummary}>
            <Text style={styles.returnOrderDetails}>Return Date: </Text>
            <Text style={styles.returnOrderDetails}>21-01-2025</Text>
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
            <Text style={styles.buttonText}>Request Cancellation</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.replacementButton}
            onPress={() => {
              redirectToPage(containers.replaceOrderScreenScreen);
            }}
          >
            <Text style={styles.buttonText}>Request Replacement</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReturnOrder;
