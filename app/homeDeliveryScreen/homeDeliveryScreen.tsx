import {
  DEFAULT_PICKUP_HOURS,
  DELIVERY_MODE_HOME,
  STORE_CLOSING_TIMINGS,
  STORE_OPENING_TIMINGS,
} from "./../config/stringLiterals";
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
import { useAuth } from "@/context/AuthContext";
import { NotificationService } from "@/services/notificationService";
import colors from "../config/colors";
import { Address, addressService } from "@/services/addressService";
import AddressItem from "../components/AddressItem";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import ModalSelector from "react-native-modal-selector";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatToDDMMYYYY } from "../config/dateTimeFormat";
import { showErrorAlert } from "../config/showErrorAlert";
import {
  MISSING_REQUIRED_FIELDS,
  PICKUP_TIME_REQUIRED,
  PICKUP_TIME_IN_PAST,
  ADDRESS_NOT_SAVED,
} from "../config/customErrorMessages";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Minimum pickup time (30 minutes from now)
const MIN_PICKUP_MINUTES = 30;

const HomeDeliveryScreen = () => {
  const { orderId, mode } = useLocalSearchParams();
  // Date and time state
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [pickerMode, setPickerMode] = useState("date");

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<string[] | null>([]);

  // Redux state
  const userData = useSelector((state: RootState) => state.user.user);

  // Refs
  const minutesRef = useRef(null);

  const [address, setAddress] = useState<any>("");
  const [additionalDetails, setAdditionalDetails] = useState("");
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

  // Initialize default time values based on new business rules
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    let targetDate, targetHour, targetMinute;

    // Check if current time is between 7AM (7) and 5PM (17)
    if (
      currentHour >= STORE_OPENING_TIMINGS &&
      currentHour < STORE_CLOSING_TIMINGS
    ) {
      // Within business hours: add 2 hours
      const twoHoursLater = new Date(
        now.getTime() + DEFAULT_PICKUP_HOURS * 60 * 60 * 1000
      );
      targetDate = twoHoursLater;
      targetHour = twoHoursLater.getHours();
      targetMinute = twoHoursLater.getMinutes();
    } else if (currentHour < STORE_OPENING_TIMINGS) {
      // Before business hours: push to next day 7AM
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate());
      tomorrow.setHours(STORE_OPENING_TIMINGS, 0, 0, 0); // Set to 7:00:00.000
      targetDate = tomorrow;
      targetHour = STORE_OPENING_TIMINGS;
      targetMinute = 0;
    } else {
      // Outside business hours: push to next day 10AM
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0); // Set to 10:00:00.000
      targetDate = tomorrow;
      targetHour = 10;
      targetMinute = 0;
    }
    // Format the date for state
    // const formattedDate = targetDate.toISOString().split("T")[0];
    console.log("target date", targetDate);
    const formattedDate = formatToDDMMYYYY(targetDate);
    console.log("formatted date", formattedDate);
    setDate(formattedDate);

    // Convert target hour to 12-hour format
    const periodValue = targetHour >= 12 ? "pm" : "am";
    let displayHour = targetHour % 12;
    if (displayHour === 0) displayHour = 12;

    // Format minutes to always be two digits
    const minutesValue = targetMinute.toString().padStart(2, "0");

    // Update state with calculated values
    setHours(displayHour.toString());
    setMinutes(minutesValue);
    setPeriod(periodValue);

    // Validate the default time
    validateTime(
      formattedDate,
      displayHour.toString(),
      minutesValue,
      periodValue
    );
  }, []);

  // Validate if selected time is in the future and at least 30 minutes ahead
  const validateTime = (
    selectedDate: any,
    hrs: any,
    mins: any,
    per: any,
    updateErrorState = true
  ) => {
    // Return early if any value is missing
    if (!selectedDate || !hrs || !mins) {
      if (updateErrorState) setError(null);
      return { isValid: false, message: "Time is incomplete" };
    }

    const numHours = parseInt(hrs, 10);
    const numMinutes = parseInt(mins, 10);

    // Basic validation
    if (isNaN(numHours) || isNaN(numMinutes)) {
      const message = "Please enter valid hour and minute values";
      if (updateErrorState) setError(message);
      return { isValid: false, message };
    }

    if (numHours < 1 || numHours > 12) {
      const message = "Hours must be between 1 and 12";
      if (updateErrorState) setError(message);
      return { isValid: false, message };
    }

    if (numMinutes < 0 || numMinutes > 59) {
      const message = "Minutes must be between 0 and 59";
      if (updateErrorState) setError(message);
      return { isValid: false, message };
    }

    // Convert to 24-hour format for comparison
    let hours24 = numHours;
    if (per === "pm" && numHours !== 12) {
      hours24 += 12;
    } else if (per === "am" && numHours === 12) {
      hours24 = 0;
    }

    // Create date object for selected date and time
    const selectedDateTime = new Date(`${selectedDate}T00:00:00`);
    selectedDateTime.setHours(hours24, numMinutes, 0);

    // Get current date and time
    const now = new Date();

    // Calculate minimum time (current time + 30 minutes)
    const minTime = new Date(now.getTime() + MIN_PICKUP_MINUTES * 60 * 1000);

    // Check if selected time is at least 30 minutes in the future
    if (selectedDateTime < minTime) {
      const message = `Please select a time at least ${MIN_PICKUP_MINUTES} minutes in the future`;
      if (updateErrorState) setError(message);
      return { isValid: false, message };
    }

    if (updateErrorState) setError(null);
    return { isValid: true };
  };

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

  // Check form validity whenever any input changes
  useEffect(() => {
    validateFormFields();
  }, [hours, minutes, period, date, selectedAddressId]);

  const validateFormFields = () => {
    // First check if time is valid
    if (hours && minutes) {
      const timeValidation = validateFutureTime(hours, minutes, period, date);

      if (!timeValidation.isValid) {
        setError(timeValidation.message?.toString() ?? null);
        setIsFormValid(false);
        return;
      } else {
        setError(null);
      }
    } else {
      // Time not complete yet
      setIsFormValid(false);
      return;
    }

    // Check if all required fields are filled
    const formValid = Boolean(
      date &&
        hours &&
        minutes &&
        existingShippingAddress.length > 0 &&
        selectedAddressId
    );

    setIsFormValid(formValid);
  };

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(formatToDDMMYYYY(currentDate));

    // Validate time with new date
    setTimeout(() => {
      validateTime(
        currentDate.toISOString().split("T")[0],
        hours,
        minutes,
        period
      );
    }, 100);
  };

  const validateForm = () => {
    if (!date) {
      showErrorAlert({
        title: "Select Pickup Date",
        message: PICKUP_TIME_REQUIRED,
      });
      return false;
    }
    if (!hours || !minutes) {
      showErrorAlert({
        title: "Select Pickup Time",
        message: PICKUP_TIME_REQUIRED,
      });
      return false;
    }
    if (!selectedAddressId) {
      showErrorAlert({
        title: "Oops",
        message: MISSING_REQUIRED_FIELDS,
      });
      return false;
    }
    const timeValidation = validateFutureTime(hours, minutes, period, date);
    if (!timeValidation.isValid) {
      showErrorAlert({
        title: "Oops",
        message: timeValidation.message || PICKUP_TIME_IN_PAST,
      });
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    try {
      // Final validation check right before submission
      if (!validateForm()) {
        return;
      }

      // Double check time is valid
      const timeValidation = validateFutureTime(hours, minutes, period, date);
      if (!timeValidation.isValid) {
        showErrorAlert({
          title: "Oops",
          message: timeValidation.message || PICKUP_TIME_IN_PAST,
        });
        return;
      }

      setIsLoading(true);

      const shippingAddress = existingShippingAddress.find(
        (addr) => addr._id === selectedAddressId
      );
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
        pickupAddress: JSON.stringify(address),
        selectedMode: "homeDelivery",
        shippingAddress: JSON.stringify(shippingAddress),
        pickupDetails: JSON.stringify(pickupDetails),
      });
    } catch (error) {
      console.error("Error submitting delivery request:", error);
      showErrorAlert({
        title: "Oops",
        message: ADDRESS_NOT_SAVED,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const renderTextInput = (
  //   label: string,
  //   value: string,
  //   onChangeText: (text: string) => void,
  //   props = {}
  // ) => (
  //   <View style={styles.inputContainer}>
  //     <Text style={styles.inputLabel}>
  //       {label} <Text style={styles.required}>*</Text>
  //     </Text>
  //     <TextInput
  //       style={styles.textInput}
  //       value={value}
  //       onChangeText={onChangeText}
  //       {...props}
  //     />
  //   </View>
  // );

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await addressService.deleteShippingAddress(
          itemToDelete.id
        );
        if (response.success) {
          setExistingSelectedShippingAddress((prev) =>
            prev.filter((item) => item._id !== itemToDelete.id)
          );

          // If deleted address was selected, clear selection
          if (selectedAddressId === itemToDelete.id) {
            setSelectedAddressId(null);
            setAddress("");
          }
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

    // Convert 12-hour format to 24-hour format
    let hours24 = numHours;
    if (period === "pm" && numHours !== 12) {
      hours24 += 12;
    } else if (period === "am" && numHours === 12) {
      hours24 = 0;
    }

    // Create a proper date object for the selected date and time
    // Parse the selectedDate (YYYY-MM-DD format) and create new Date
    const [year, month, day] = selectedDate
      .split("-")
      .map((num) => parseInt(num, 10));
    const selectedDateTime = new Date(
      year,
      month - 1,
      day,
      hours24,
      numMinutes,
      0,
      0
    );

    // Calculate minimum valid time (current time + 30 minutes)
    const minValidTime = new Date(
      now.getTime() + MIN_PICKUP_MINUTES * 60 * 1000
    );

    // Check if selected date/time is at least 30 minutes in the future
    if (selectedDateTime <= minValidTime) {
      return {
        isValid: false,
        message: `Please select a time at least ${MIN_PICKUP_MINUTES} minutes in the future.`,
      };
    }

    return { isValid: true };
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

    // Validate time after change
    setTimeout(() => {
      validateTime(date, hours, numericText, period);
    }, 100);
  };

  // Handle minutes input changes
  const handleMinutesChange = (text: any) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");
    setMinutes(numericText);

    // Validate when leaving the minutes field
    if (numericText.length === 2) {
      setTimeout(() => {
        validateTime(date, hours, numericText, period);
      }, 100);
    }
  };

  // Handle period changes
  const handlePeriodChange = (value: any) => {
    setPeriod(value);
    // Validate immediately when period changes
    setTimeout(() => {
      validateTime(date, hours, minutes, value);
    }, 100);
  };

  // Handle blur events to validate when leaving a field
  const handleBlur = () => {
    validateTime(date, hours, minutes, period);
  };

  return (
    <PageLayout
      hasHeader
      headerComponent={<Header headerText={DELIVERY_MODE_HOME} />}
      hasFooter={false}
      scrollable
    >
      <KeyBoardWrapper>
        {/* <View style={globalStyles.container}> */}
        {/* <Header headerText={DELIVERY_MODE_HOME} /> */}
        <FlatList
          ListHeaderComponent={
            <>
              <View
                style={[globalStyles.pt_0]}
              >
                <Text style={styles.label}>
                  Do you prefer home delivery? Let us know your available day
                  and time.
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
                    // <DateTimePicker
                    //   value={new Date(date)}
                    //   mode="date"
                    //   display="default"
                    //   onChange={onDateChange}
                    //   minimumDate={new Date()}
                    // />
                    <DateTimePickerModal
                      isVisible={showDatePicker}
                      mode="date"
                      onConfirm={(selectedDate) => {
                        setShowDatePicker(false);
                        setDate(formatToDDMMYYYY(selectedDate));
                        setTimeout(() => {
                          validateTime(
                            formatToDDMMYYYY(selectedDate),
                            hours,
                            minutes,
                            period
                          );
                        }, 100);
                      }}
                      onCancel={() => setShowDatePicker(false)}
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
                  <View style={styles.toggleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        period === "am" && styles.activeToggle,
                      ]}
                      onPress={() => handlePeriodChange("am")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          period === "am" && styles.activeText,
                        ]}
                      >
                        AM
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.toggleButton,
                        period === "pm" && styles.activeToggle,
                      ]}
                      onPress={() => handlePeriodChange("pm")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          period === "pm" && styles.activeText,
                        ]}
                      >
                        PM
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {error ? (
                  <Text style={{ color: "red", marginTop: 5 }}>{error}</Text>
                ) : null}

                {/* Shipping Address Section */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Shipping Address: *</Text>
                  {existingShippingAddress.length === 0 && (
                    <Button
                      title="Add Address"
                      onPress={() => {
                        redirectToPage(containers.addAddressScreenScreen, {
                          from: "homeDelivery",
                        });
                      }}
                    />
                  )}
                </View>

                {/* Address List */}
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
                      onEdit={() => handleEditAddress(item)}
                      onDelete={() => handleDeleteAddress(item)}
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
                  disabled={isLoading || !isFormValid}
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
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default HomeDeliveryScreen;
