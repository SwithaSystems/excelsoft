import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import styles from "./homeDeliveryScreenStyles";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import { Picker } from "@react-native-picker/picker";
import Header from "@/components/Header";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Button from "@/components/commonComponents/Button";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { NotificationService } from "@/services/notificationService";
import colors from "../config/colors";
import { PickupMode } from "@/services/orderService";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const HomeDeliveryScreen = () => {
  const { orderId } = useLocalSearchParams();
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [address, setAddress] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]);
  };

  const validateForm = () => {
    if (
      !date ||
      !hours ||
      !minutes ||
      !address ||
      !firstName ||
      !lastName ||
      !phone ||
      !email
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      // const deliveryData = {
      //   orderId,
      //   pickupModeId: PICKUP_MODE_IDS.HOME_DELIVERY,
      //   date: new Date(date),
      //   time: `${hours}:${minutes} ${period}`,
      //   firstName,
      //   lastName,
      //   phone,
      //   email,
      //   address,
      //   additionalDetails,
      // };

      // const response = await fetch(`${API_BASE_URL}/pickup-details`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(deliveryData),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Failed to submit delivery request');
      // }

      // Update order status
      // await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: 'processing' }),
      // });

      // Send notification for order update through the backend
      // if (!user?.id) {
      //   throw new Error("User not authenticated");
      // }

      // Send both a delivery notification and status update
      // await NotificationService.sendOrderDeliveryUpdate(
      //   user.id,
      //   orderId as string,
      //   date,
      //   `${hours}:${minutes} ${period}`
      // );

      // Also trigger a local notification for immediate feedback
      await NotificationService.scheduleLocalNotification(
        "Delivery Scheduled",
        `Your order #${orderId} delivery is scheduled for ${date} at ${hours}:${minutes} ${period}`,
        { orderId, type: "delivery_scheduled" }
      );

      redirectToPage(containers.orderSummeryScreenScreen, {
        orderId,
        selectedDate: date,
        selectedSlot: `${hours}:${minutes} ${period}`,
        pickupAddress: address,
        selectedMode: PickupMode.HOME_DELIVERY,
        firstName,
        lastName,
        phone,
        email,
        additionalDetails,
      });
    } catch (error) {
      console.error("Error submitting delivery request:", error);
      Alert.alert(
        "Error",
        "Failed to submit delivery request. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderTextInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    props = {}
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} <Text style={styles.required}>*</Text>
      </Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Header headerText="Home Delivery" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.label}>
            Do you prefer home delivery? Let us know your available day and
            time.
          </Text>

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

          {/* Contact Information */}
          {renderTextInput("First Name", firstName, setFirstName)}
          {renderTextInput("Last Name", lastName, setLastName)}
          {renderTextInput("Phone", phone, setPhone, {
            keyboardType: "phone-pad",
          })}
          {renderTextInput("Email", email, setEmail, {
            keyboardType: "email-address",
          })}

          {/* Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Address: *</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Additional Instructions */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              Additional Instructions for delivery partner:
            </Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              multiline
              numberOfLines={3}
              placeholder="E.g., Landmark, preferred delivery time, etc."
            />
          </View>

          <Button title="Confirm" onPress={handleSubmit} disabled={isLoading} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeDeliveryScreen;
