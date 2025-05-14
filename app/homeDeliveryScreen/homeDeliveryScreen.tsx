import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
  FlatList,
  SafeAreaView,
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
import { Address, addressService } from "@/services/addressService";
import AddressItem from "../components/AddressItem";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const HomeDeliveryScreen = () => {
  const { orderId, mode } = useLocalSearchParams();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [address, setAddress] = useState<any>("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [existingShippingAddress, setExistingSelectedShippingAddress] =
    useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const [addressData, setAddressData] = useState<Address[]>([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await addressService.getAllShppingAddress_userId();
        setExistingSelectedShippingAddress(response);
        console.log("Shipping addresses:", response);
      } catch (err) {
        console.error("Error fetching shipping addresses:", err);
      }
    };

    fetchAddresses();
  }, []);
  console.log("shipping address saved address", existingShippingAddress);

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
      !minutes
      // !address ||
      // !firstName ||
      // !lastName ||
      // !phone ||
      // !email
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

      const shippingAddress = existingShippingAddress;
      const pickupDetails = {
        date: date,
        time: `${hours}:${minutes} ${period}`,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        additionalDetails: additionalDetails,
      };
      redirectToPage(containers.orderSummeryScreenScreen, {
        // orderId,
        // selectedDate: date,
        // selectedSlot: `${hours}:${minutes} ${period}`,
        pickupAddress: JSON.stringify(address),
        selectedMode: "homeDelivery",
        // firstName,
        // lastName,
        // phone,
        // email,
        // additionalDetails,
        shippingAddress: JSON.stringify(shippingAddress),
        pickupDetails: JSON.stringify(pickupDetails),
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
  const handleEditAddress = (item: Address) => {
    setSelectedAddressId(item);
    redirectToPage(containers.editAddressScreenScreen);
  };
  const handleDeleteAddress = (item: Address) => {
    setItemToDelete({ id: item._id });
    setIsModalVisible(true);
  };
  // Function to validate if the selected time is in the future
  const validateFutureTime = (
    hours: any,
    minutes: any,
    period: any,
    selectedDate: string
  ) => {
    // Convert input values to numbers
    const numHours = parseInt(hours, 10);
    const numMinutes = parseInt(minutes, 10);

    // Validate the input format first
    if (isNaN(numHours) || isNaN(numMinutes)) {
      return {
        isValid: false,
        message: "Please enter valid hour and minute values.",
      };
    }

    if (numHours < 1 || numHours > 12) {
      return { isValid: false, message: "Hours must be between 1 and 12." };
    }

    if (numMinutes < 0 || numMinutes > 59) {
      return { isValid: false, message: "Minutes must be between 0 and 59." };
    }

    // Get current date and time
    const now = new Date();

    // Create a date object for the selected time
    const selectedTime = new Date(selectedDate);

    // Convert 12-hour format to 24-hour format
    let hours24 = numHours;
    if (period === "pm" && numHours !== 12) {
      hours24 += 12;
    } else if (period === "am" && numHours === 12) {
      hours24 = 0;
    }

    // Set hours and minutes for the selected time
    selectedTime.setHours(hours24);
    selectedTime.setMinutes(numMinutes);
    selectedTime.setSeconds(0);

    // If selected date is today, compare with current time
    const isSameDay = now.toISOString().split("T")[0] === selectedDate;

    // Compare with current time
    if (isSameDay && selectedTime <= now) {
      return {
        isValid: false,
        message: "Please select a future time.",
      };
    }

    return { isValid: true };
  };
  // Use refs to focus between fields
  const minutesRef = useRef(null);

  // Validate the time whenever any input changes
  const validateTime = () => {
    // Only validate if both hours and minutes have values
    if (hours && minutes) {
      const validation = validateFutureTime(hours, minutes, period, date);

      if (!validation.isValid) {
        setError(validation.message?.toString() ?? null);
        return false;
      } else {
        setError("");
        return true;
      }
    }
    return true; // Don't show error while incomplete
  };

  // Handle hours input changes
  const handleHoursChange = (text: any) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");
    setHours(numericText);

    // Auto-move to minutes input when 2 digits entered
    if (numericText.length === 2) {
      if (minutesRef.current) {
        (minutesRef.current as any).focus();
      }
    }
  };

  // Handle minutes input changes
  const handleMinutesChange = (text: any) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");
    setMinutes(numericText);

    // Validate when leaving the minutes field
    if (numericText.length === 2) {
      setTimeout(() => {
        validateTime();
      }, 100);
    }
  };

  // Handle period changes
  const handlePeriodChange = (value: any) => {
    setPeriod(value);
    // Validate immediately when period changes
    setTimeout(() => {
      validateTime();
    }, 100);
  };

  // Handle blur events to validate when leaving a field
  const handleBlur = () => {
    validateTime();
  };

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={globalStyles.container}>
      <Header headerText="Home Delivery" />
      {/* <ScrollView> */}
      <FlatList
        ListHeaderComponent={
          <>
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
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                {/* Time Input */}
                <Text style={styles.inputLabel}>Time: *</Text>
                <View style={globalStyles.timeContainer}>
                  <TextInput
                    style={[
                      globalStyles.timeInput,
                      error ? { borderColor: "red" } : {},
                    ]}
                    placeholder="HH"
                    keyboardType="numeric"
                    maxLength={2}
                    value={hours}
                    onChangeText={handleHoursChange}
                    onBlur={handleBlur}
                  />
                  <Text>:</Text>
                  <TextInput
                    ref={minutesRef}
                    style={[
                      globalStyles.timeInput,
                      error ? { borderColor: "red" } : {},
                    ]}
                    placeholder="MM"
                    keyboardType="numeric"
                    maxLength={2}
                    value={minutes}
                    onChangeText={handleMinutesChange}
                    onBlur={handleBlur}
                  />
                  <View
                    style={{
                      borderColor: error ? "red" : colors.primary,
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
                      onValueChange={handlePeriodChange}
                    >
                      <Picker.Item label="AM" value="am" />
                      <Picker.Item label="PM" value="pm" />
                    </Picker>
                  </View>
                </View>
                {error ? (
                  <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
                ) : null}
                {/* Contact Information */}
                {existingShippingAddress.length == 0 && (
                  <>
                    {/* {renderTextInput("First Name", firstName, setFirstName)}
              {renderTextInput("Last Name", lastName, setLastName)}
              {renderTextInput("Phone", phone, setPhone, {
                keyboardType: "phone-pad",
              })}
              {renderTextInput("Email", email, setEmail, {
                keyboardType: "email-address",
              })}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address: *</Text>
                <TextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={4}
                />
              </View> */}
                    <Button
                      title="Add Address"
                      onPress={() => {
                        redirectToPage(containers.addAddressScreenScreen, {
                          from: "homeDelivery",
                        });
                      }}
                    ></Button>
                  </>
                )}
                {/* Address */}
                <FlatList
                  data={existingShippingAddress}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <AddressItem
                      item={item}
                      showRadio={true}
                      isSelected={item._id === selectedAddressId}
                      onSelect={() => {
                        setSelectedAddressId(item._id);
                        setAddress(item);
                      }}
                      onEdit={handleEditAddress}
                      onDelete={handleDeleteAddress}
                    />
                  )}
                />

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
                <Button
                  title="Confirm"
                  onPress={handleSubmit}
                  disabled={isLoading}
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
            </>
          }
          data={[]}
          renderItem={null}
        />

        {/* </ScrollView> */}
      </View>
    </SafeAreaView>
  );
};

export default HomeDeliveryScreen;
