import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import styles from "./pickupScreenStyles";
import { useLocalSearchParams } from "expo-router";
import colors from "../config/colors";
import { PickupMode } from "@/services/orderService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "@/services/userService";
import { useSelector } from "react-redux";

const PickupScreen = () => {
  const { mode, orderId } = useLocalSearchParams();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [collector, setCollector] = useState("myself");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Store user data from Redux
  const userData_redux = useSelector((state: any) => state.user.user);

  // Store the original user data to use when toggling between "Myself" and "Someone Else"
  const [originalUserData, setOriginalUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  console.log("Selected mode is:", mode); // store / curbside

  // Curbside specific fields
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const vehicleTypeOptions = [
    { label: "type 1", value: "type1" },
    { label: "type 2", value: "type2" },
  ];

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
      !firstName ||
      !lastName ||
      !phone ||
      !email
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return false;
    }

    if (mode === "curbside" && (!vehicleType || !vehicleNumber)) {
      Alert.alert(
        "Error",
        "Please fill in vehicle details for curbside pickup"
      );
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    // Basic phone validation (adjust regex based on your requirements)
    const phoneRegex = /^\d{10,}$/;
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

      // Format time string
      const formattedTime = `${hours}:${minutes} ${period}`;

      // Format pickup details string with user details
      const pickupDetails = {
        date: date,
        time: formattedTime,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        vehicleType: vehicleType,
        vehicleNumber: vehicleNumber,
        additionalDetails: additionalDetails,
      };
      const userDetails = `${firstName} ${lastName}\nPhone: ${phone}\nEmail: ${email}`;

      // Add vehicle details for curbside pickup
      const vehicleDetails =
        mode === "curbside"
          ? `\nVehicle Type: ${vehicleType}\nVehicle Number: ${vehicleNumber}${
              additionalDetails
                ? `\nAdditional Details: ${additionalDetails}`
                : ""
            }`
          : "";

      // Complete pickup address combining user and vehicle info
      const pickupAddress = `${userDetails}${vehicleDetails}`;

      // Navigate to order summary screen with pickup data
      redirectToPage(containers.orderSummeryScreenScreen, {
        pickupDetails: JSON.stringify(pickupDetails),
        pickupAddress: JSON.stringify(pickupDetails),
        // selectedDate: date,
        // selectedSlot: formattedTime,
        selectedMode: mode === "store" ? "storePickup" : "curbsidePickup",
      });
    } catch (error) {
      console.error("Error processing pickup request:", error);
      Alert.alert(
        "Error",
        "Failed to process pickup request. Please try again later."
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
        style={inputStyles.textInput}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
    </View>
  );

  // Load user data
  useEffect(() => {
    const getUser = async () => {
      if (userData_redux) {
        try {
          const user = await UserAPI.getUserByPhonenumber(
            userData_redux?.phone
          );
          console.log("user", user.data);
          if (user && user.data) {
            // Save original user data
            const userData = {
              firstName: user.data.firstName || "",
              lastName: user.data.lastName || "",
              phone: user.data.phone || "",
              email: user.data.email || "",
            };

            setOriginalUserData(userData);

            // If collector is "myself", populate the fields
            if (collector === "myself") {
              setFirstName(userData.firstName);
              setLastName(userData.lastName);
              setPhone(userData.phone);
              setEmail(userData.email);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    getUser();
  }, [userData_redux]);

  // Handle collector change
  const handleCollectorChange = (newCollector: any) => {
    setCollector(newCollector);

    if (newCollector === "myself") {
      // Restore original user data when selecting "Myself"
      setFirstName(originalUserData.firstName);
      setLastName(originalUserData.lastName);
      setPhone(originalUserData.phone);
      setEmail(originalUserData.email);
    } else {
      // Clear fields when selecting "Someone Else"
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
    }
  };

  console.log("user destructured data", firstName, lastName, phone, email);

  return (
    <View style={globalStyles.container}>
      <Header
        headerText={
          mode === "store"
            ? PickupMode.STORE_PICKUP
            : PickupMode.CURBSIDE_PICKUP
        }
      />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Text style={styles.label}>
            {mode === "store"
              ? "Do you like to store pick up? Let us know the date and time that suits you for Store pickup."
              : "Do you like curb side pick up? Let us know the date and time that suits you for Curbside pickup."}
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
                min={new Date().toISOString().split("T")[0]}
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
                minimumDate={new Date()}
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
                mode="dialog"
                onValueChange={(itemValue) => setPeriod(itemValue)}
              >
                <Picker.Item label="AM" value="am" color={colors.black} />
                <Picker.Item label="PM" value="pm" color={colors.black} />
              </Picker>
            </View>
          </View>

          {/* Curbside Specific Fields */}
          {mode === "curbside" && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Vehicle Type: *</Text>
                <View
                  style={{
                    borderColor: colors.primary,
                    borderWidth: 1,
                    height: 40,
                    width: 250,
                    borderRadius: 8,
                    justifyContent: "center",
                  }}
                >
                  <Picker
                    selectedValue={vehicleType}
                    style={{
                      height: 50,
                      width: 250,
                      color: colors.black,
                      borderColor: colors.black,
                      borderWidth: 1,
                    }}
                    onValueChange={(itemValue) => setVehicleType(itemValue)}
                  >
                    <Picker.Item 
                       style={{ fontSize: 13 }}
                      label="Select Vehicle Type" value="" />
                    {vehicleTypeOptions.map((option) => (
                      <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              {renderTextInput(
                "Vehicle Number",
                vehicleNumber,
                setVehicleNumber
              )}
              {renderTextInput(
                "Additional Details",
                additionalDetails,
                setAdditionalDetails,
                {
                  multiline: true,
                  numberOfLines: 3,
                  style: [inputStyles.textInput, inputStyles.multilineInput],
                }
              )}
            </>
          )}

          {/* Collector Information */}
          <Text style={styles.sectionTitle}>
            Let us know who is collecting?
          </Text>
          <View style={styles.collectorOptions}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleCollectorChange("myself")}
            >
              <View
                style={[
                  styles.radio,
                  collector === "myself" && styles.radioSelected,
                ]}
              >
                {collector === "myself" && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>Myself</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => handleCollectorChange("someone_else")}
            >
              <View
                style={[
                  styles.radio,
                  collector === "someone_else" && styles.radioSelected,
                ]}
              >
                {collector === "someone_else" && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioLabel}>Someone Else</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.helperText}>
            Fill some basic details of the person who is going to receive the
            order.
          </Text>

          {renderTextInput("First Name", firstName, setFirstName)}
          {renderTextInput("Last Name", lastName, setLastName)}
          {renderTextInput("Phone", phone, setPhone, {
            keyboardType: "phone-pad",
          })}
          {renderTextInput("Email", email, setEmail, {
            keyboardType: "email-address",
          })}

          <Text style={inputStyles.note}>
            *Please ensure you carry a valid ID Proof
          </Text>
          <Button title="Confirm" onPress={handleSubmit} disabled={isLoading} />
        </View>
      </ScrollView>
    </View>
  );
};

const inputStyles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.white,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: "top",
  },
  note: {
    color: colors.buttonError,
    fontSize: 14,
    marginBottom: 16,
  },
});

export default PickupScreen;
