import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import colors from "../../../constants/colors";
import { CheckBox } from "react-native-elements";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/app/components/commonComponents/Button";
import { router, useLocalSearchParams } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import styles from "./ReplaceOrderStyles";
import { Picker } from "@react-native-picker/picker"; // Correct picker import for cross-platform
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import {
  DELIVERY_MODE_CURBSIDE,
  DELIVERY_MODE_HOME,
  DELIVERY_MODE_STORE,
} from "../../../constants/stringLiterals";

const options = [
  {
    id: "store",
    label: "Store Pickup",
    description: "Pick up your order from our store",
    icon: "location-outline",
    redirectionScreen: containers.pickupScreen,
    params: { mode: DELIVERY_MODE_STORE },
  },
  {
    id: "curbside",
    label: "Curbside Pickup",
    description: "We will pick your order curbside, right from your car.",
    icon: "car-outline",
    redirectionScreen: containers.pickupScreen,
    params: { mode: DELIVERY_MODE_CURBSIDE },
  },
  {
    id: "doorstep",
    label: "Doorstep Pickup",
    description: "We will pick your order at your doorstep.",
    icon: "home-outline",
    redirectionScreen: containers.homeDeliveryScreen,
    params: { mode: DELIVERY_MODE_HOME },
  },
];
const cartItems = [
  {
    id: 1,
    image: require("@/assets/baby-bicycle.png"),
    name: "Duck Toys",
    discount: "£10.00",
    netPrice: "£18.00",
    quantity: 5,
  },
  {
    id: 2,
    image: require("@/assets/baby-bicycle.png"),
    name: "Orange Juice",
    discount: "£3.00",
    netPrice: "£5.00",
    quantity: 1,
  },
  {
    id: 3,
    image: require("@/assets/baby-bicycle.png"),
    name: "Strawberries",
    discount: "£12.00",
    netPrice: "£18.00",
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
const replaceOrderScreen = () => {
  const vehicleTypeOptions = [
    { label: "type 1", value: "type1" },
    { label: "type 2", value: "type2" },
  ];
  const [selected, setSelected] = useState<
    Partial<{ id: string; redirectionScreen: any; params: any }>
  >({});
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const params = useLocalSearchParams<OrderSummeryScreenParams>();
  const pickupAddress = params.pickupAddress || "";
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default date as ISO for web support
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [amPm, setAmPm] = useState("am");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]); // Format date as yyyy-mm-dd
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //   <View style={styles.container}>
    //     <Header headerText="Replace Order" />
    //     <ScrollView style={styles.view}>
    <PageLayout
      hasHeader
      hasFooter
      headerComponent={<Header headerText="Replace Order" />}
      scrollable
    >
      <View style={styles.returnOrderCategory}>
        <Text style={styles.returnOrderItemText}>Order Number:</Text>
        <Text style={styles.returnOrderId}>#ORD-2025-1234</Text>
      </View>
      <View
        style={[
          globalStyles.sectionContent,
          globalStyles.pt_0,
          { paddingHorizontal: 40 },
        ]}
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.option,
              selected?.id == option.id && styles.selectedOption,
            ]}
            onPress={() => setSelected(option)}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={option.icon as any}
                size={24}
                color={colors.black}
                // style={styles.icon}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <View style={styles.radioCircle}>
              {selected.id === option.id && (
                <View style={styles.selectedRadio} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sideHeadingText}>Items to be replaced:</Text>
      {cartItems.map((item) => (
        <View style={styles.cartItem} key={item.id}>
          <Image source={item.image} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            <Text style={styles.itemPrice}>
              {item.discount}{" "}
              <Text style={styles.striked}>{item.netPrice}</Text>
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

      {selected.id === "curbside" && (
        <View>
          {/* Date Picker */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date: *</Text>
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

          {/* Time Input */}
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

            {/* AM/PM Dropdown */}
            <Picker
              selectedValue={period}
              style={globalStyles.picker_sm}
              onValueChange={(itemValue) => setPeriod(itemValue)}
            >
              <Picker.Item
                style={globalStyles.pickerValue_sm}
                label="AM"
                value="am"
              />
              <Picker.Item
                style={globalStyles.pickerValue_sm}
                label="PM"
                value="pm"
              />
            </Picker>
          </View>
          <View style={globalStyles.mb_3}>
            <Text style={styles.inputLabel}>Vehicle Type: *</Text>
            <Picker
              selectedValue={vehicleType}
              style={globalStyles.picker_50}
              onValueChange={(itemValue) => setVehicleType(itemValue)}
            >
              {vehicleTypeOptions.map((each, index) => {
                return (
                  <>
                    <Picker.Item
                      style={globalStyles.pickerValue_50}
                      label={each.label}
                      value={each.value}
                    />
                  </>
                );
              })}
            </Picker>
          </View>
          <View style={globalStyles.mb_3}>
            <Text style={styles.inputLabel}>Vehicle Number: *</Text>
            <CustomTextInput
              containerStyle={globalStyles.pickUpInput}
              onPress={() => {}}
              setValue={setVehicleNumber}
              value={vehicleNumber}
            />
          </View>
          <View style={globalStyles.mb_3}>
            <Text style={styles.inputLabel}>Additional Details</Text>
            <CustomTextInput
              containerStyle={globalStyles.pickUpInput}
              onPress={() => {}}
              setValue={setAdditionalDetails}
              value={additionalDetails}
            />
          </View>
        </View>
      )}
      {selected.id === "doorstep" && (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Address</Text>
          <View style={globalStyles.pl_3}>
            <Text style={styles.addressTextBox}>{pickupAddress}</Text>
          </View>
        </View>
      )}
      <View style={styles.replaceReason}>
        <Text style={styles.label}>Reason for Replacement</Text>
        <View style={styles.selectReason}>
          <TextInput placeholder="Tell us why" style={styles.placeholderText} />
          <Ionicons
            name="chevron-down-outline"
            size={24}
            color={colors.primary}
          />
        </View>
      </View>
      <View style={styles.addComments}>
        <Text>Do you want to talk more about your experience?</Text>
        <TextInput
          style={[styles.commentsText]}
          placeholder="Add additional comments"
          multiline
          numberOfLines={4}
        />
      </View>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.buttonText}>Request Cancellation</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.keepOrderButton}>
        <Text style={styles.buttonText}>Request Replacement</Text>
      </TouchableOpacity>
      {/* </ScrollView>
      </View>
    </SafeAreaView> */}
    </PageLayout>
  );
};

export default replaceOrderScreen;
