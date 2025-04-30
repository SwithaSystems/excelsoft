import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Correct picker import for cross-platform
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import colors from "../config/colors";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import styles from "./storePickUpScreenStyles";
import { Ionicons } from "@expo/vector-icons";
import { PickupMode } from "@/services/orderService";

const storePickupScreen = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [amPm, setAmPm] = useState("am");
  const [collector, setCollector] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [orderId, setOrderId] = useState("");

  // Handle date change
  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]); // Format date as yyyy-mm-dd
  };
  const validateForm = () => {
    if (
      !date ||
      !hours ||
      !minutes ||
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
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    try {
      if (!validateForm()) {
        return;
      }
      setIsLoading(true);
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
  return (
    <View style={globalStyles.container}>
      <Header headerText="Store Pickup" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.label}>
            Do you like to store pick up? Let us know the date and time that
            suits you for Store pickup.
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
          <Text style={styles.label}>
            Time: <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.timeContainer}>
            <TextInput
              style={[styles.timeInput, styles.hourMinuteInput]}
              placeholder="HH"
              value={hour}
              onChangeText={setHour}
              keyboardType="number-pad"
            />
            <TextInput
              style={[styles.timeInput, styles.hourMinuteInput]}
              placeholder="MM"
              value={minute}
              onChangeText={setMinute}
              keyboardType="number-pad"
            />
            <View style={styles.amPmSelector}>
              <Picker
                selectedValue={period}
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
          </View>
          <Text style={styles.sectionTitle}>
            Let us know who is collecting?
          </Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setCollector("myself")}
            >
              <View style={styles.radioButton}>
                {collector === "myself" && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioText}>Myself</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioRow}
              onPress={() => setCollector("someone")}
            >
              <View style={styles.radioButton}>
                {collector === "someone" && (
                  <View style={styles.radioButtonSelected} />
                )}
              </View>
              <Text style={styles.radioText}>Someone Else</Text>
            </TouchableOpacity>
          </View>

          {/* Collector Details */}
          <Text style={styles.sectionTitle}>
            Fill some basic details of the person who is going to reciver the
            order.
          </Text>

          <Text style={styles.fieldLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.fieldLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.fieldLabel}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </ScrollView>
      <Text style={{ color: colors.error, fontSize: 14 }}>
        *Please ensure you carry a valid ID Proof
      </Text>      
      <View style={globalStyles.p_3}>
        <Button
          onPress={() => {
            handleSubmit;
            // redirectToPage(containers.orderSummeryScreenScreen);
          }}
          title="Confirm"
        />
      </View>
    </View>
  );
};

export default storePickupScreen;
