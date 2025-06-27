import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  TextInputProps,
} from "react-native";
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
import { UserAPI } from "@/services/userService";
import { useSelector } from "react-redux";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import ModalSelector from "react-native-modal-selector";
import { RootState } from "@/store/store";
import PageLayout from "../pageLayoutProps";
import {
  DEFAULT_PICKUP_HOURS,
  STORE_CLOSING_TIMINGS,
  STORE_OPENING_TIMINGS,
} from "../config/stringLiterals";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatToDDMMYYYY } from "../config/dateTimeFormat";
import {
  PICKUP_TIME_IN_PAST,
  PICKUP_TIME_REQUIRED,
  PICKUP_DETAILS_REQUIRED,
} from "../config/customErrorMessages";
import { showErrorAlert } from "../config/showErrorAlert";

// Vehicle type options for dropdown
const VEHICLE_TYPE_OPTIONS = [
  { key: 1, label: "Car", value: "Car" },
  { key: 2, label: "MotorCycle", value: "MotorCycle" },
  { key: 3, label: "Bike", value: "Bike" },
  { key: 4, label: "Van", value: "Van" },
];

// Time period options
const TIME_PERIOD_OPTIONS = [
  { key: 1, label: "AM", value: "am" },
  { key: 2, label: "PM", value: "pm" },
];

// Minimum pickup time (30 minutes from now)
const MIN_PICKUP_MINUTES = 30;

const PickupScreen = () => {
  const { mode, orderId } = useLocalSearchParams();
  const isStorePickup = mode === "store";
  const isCurbsidePickup = mode === "curbside";

  // Date and time state
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [timeError, setTimeError] = useState<any>(null);
  const [pickupDate, setPickupDate] = useState("");
  const [isPickupDatePickerVisible, setPickupDatePickerVisibility] =
    useState(false);

  // User state
  const [collector, setCollector] = useState("myself");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<any>(null);

  // Curbside specific state
  const [vehicleType, setVehicleType] = useState("Car");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<string[] | null>([]);

  // Redux state
  const userData = useSelector((state: RootState) => state.user.user);
  console.log("userData in pickupscreen", userData);

  // Refs for focusing fields
  const hoursRef = useRef<TextInput>(null);
  const minutesRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const vehicleNumberRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Store original user data for toggling between collectors
  const [originalUserData, setOriginalUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

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
    const formattedDate = targetDate.toISOString().split("T")[0];
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

  const displayDatePicker = () => setPickupDatePickerVisibility(true);
  const hideDatePicker = () => setPickupDatePickerVisibility(false);

  const handlePickupDateConfirm = (date: Date) => {
    const formattedDate = formatToDDMMYYYY(date);
    setPickupDate(formattedDate);
    hideDatePicker();
  };

  // Validate form on every field change to enable/disable the submit button
  useEffect(() => {
    const errors = [];

    // Check required fields
    if (!date) errors.push("Date is required");
    if (!hours) errors.push("Hour is required");
    if (!minutes) errors.push("Minute is required");
    if (!firstName) errors.push("First name is required");
    if (!lastName) errors.push("Last name is required");
    if (!phone) errors.push("Phone is required");
    if (!email) errors.push("Email is required");

    // Validate time if all time fields are filled
    if (date && hours && minutes && period) {
      const timeValidation = validateTime(date, hours, minutes, period, false);
      if (!timeValidation.isValid && timeValidation.message) {
        errors.push(timeValidation.message);
      }
    }

    // Validate email if entered
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("Email format is invalid");
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError(null);
      }
    }

    // Validate curbside-specific fields
    if (isCurbsidePickup) {
      if (!vehicleType) errors.push("Vehicle type is required");
      if (!vehicleNumber) errors.push("Vehicle number is required");
    }

    setFormErrors(errors);
    setIsFormValid(errors.length === 0);
  }, [
    date,
    hours,
    minutes,
    period,
    firstName,
    lastName,
    phone,
    email,
    isCurbsidePickup,
    vehicleType,
    vehicleNumber,
  ]);

  // Load user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      // if (!userData?.phone) return;

      try {
        const response = await UserAPI.getUserById(
          userData?._id ? userData?._id : userData?.id
        );
        console.log("response in pickup", response);
        if (response?.data) {
          const fetchedUserData = {
            firstName: response.data.firstName || "",
            lastName: response.data.lastName || "",
            phone: response.data.phone || "",
            email: response.data.email || "",
          };

          setOriginalUserData(fetchedUserData);

          // Populate fields if collector is "myself"
          if (collector === "myself") {
            setFirstName(fetchedUserData.firstName);
            setLastName(fetchedUserData.lastName);
            setPhone(fetchedUserData.phone);
            setEmail(fetchedUserData.email);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [userData, collector]);

  // Function to focus on the first field with error
  const focusFirstErrorField = () => {
    // Check each field in order and focus on the first one with an error
    if (!date) {
      // For date, we can show date picker or scroll to that section
      setShowDatePicker(true);
      return;
    }

    if (!hours) {
      hoursRef.current?.focus();
      return;
    }

    if (!minutes) {
      minutesRef.current?.focus();
      return;
    }

    // Check for time validation error
    if (date && hours && minutes && period) {
      const timeValidation = validateTime(date, hours, minutes, period, false);
      if (!timeValidation.isValid) {
        hoursRef.current?.focus();
        return;
      }
    }

    if (!firstName) {
      firstNameRef.current?.focus();
      return;
    }

    if (!lastName) {
      lastNameRef.current?.focus();
      return;
    }

    if (!phone) {
      phoneRef.current?.focus();
      return;
    }

    if (!email) {
      emailRef.current?.focus();
      return;
    }

    // Check email format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailRef.current?.focus();
        return;
      }
    }

    // Check curbside-specific fields
    if (isCurbsidePickup) {
      if (!vehicleType) {
        // For modal selector, we can't focus, but we can scroll to it
        // You might want to show an alert or highlight the field
        Alert.alert("Required Field", "Please select a vehicle type");
        return;
      }

      if (!vehicleNumber) {
        vehicleNumberRef.current?.focus();
        return;
      }
    }
  };

  // Handle date picker change
  const handleDateChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]);
    validateTime(
      currentDate.toISOString().split("T")[0],
      hours,
      minutes,
      period
    );
  };

  // Handle hours input changes with auto-focus to minutes
  const handleHoursChange = (text: any) => {
    const numericText = text.replace(/[^0-9]/g, "");

    // Validate hours range (1-12)
    if (
      numericText &&
      (parseInt(numericText) < 1 || parseInt(numericText) > 12)
    ) {
      setTimeError("Hours must be between 1 and 12");
    } else {
      setTimeError(null);
    }

    setHours(numericText);

    // Auto-focus to minutes field when 2 digits entered
    if (numericText.length === 2 && minutesRef.current) {
      minutesRef.current.focus();
    }

    validateTime(date, numericText, minutes, period);
  };

  // Handle minutes input changes
  const handleMinutesChange = (text: any) => {
    const numericText = text.replace(/[^0-9]/g, "");

    // Validate minutes range (0-59)
    if (
      numericText &&
      (parseInt(numericText) < 0 || parseInt(numericText) > 59)
    ) {
      setTimeError("Minutes must be between 0 and 59");
    } else {
      setTimeError(null);
    }

    setMinutes(numericText);
    validateTime(date, hours, numericText, period);
  };

  // Handle period changes
  const handlePeriodChange = (value: any) => {
    setPeriod(value);
    // Validate immediately when period changes
    setTimeout(() => {
      validateTime(date, hours, minutes, value);
    }, 100);
  };

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
      if (updateErrorState) setTimeError(null);
      return { isValid: false, message: "Time is incomplete" };
    }

    const numHours = parseInt(hrs, 10);
    const numMinutes = parseInt(mins, 10);

    // Basic validation
    if (isNaN(numHours) || isNaN(numMinutes)) {
      const message = "Please enter valid hour and minute values";
      if (updateErrorState) setTimeError(message);
      return { isValid: false, message };
    }

    if (numHours < 1 || numHours > 12) {
      const message = "Hours must be between 1 and 12";
      if (updateErrorState) setTimeError(message);
      return { isValid: false, message };
    }

    if (numMinutes < 0 || numMinutes > 59) {
      const message = "Minutes must be between 0 and 59";
      if (updateErrorState) setTimeError(message);
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
      if (updateErrorState) setTimeError(message);
      return { isValid: false, message };
    }

    if (updateErrorState) setTimeError(null);
    return { isValid: true };
  };

  // Handle collector change (myself vs someone else)
  const handleCollectorChange = (newCollector: any) => {
    setCollector(newCollector);

    if (newCollector === "myself") {
      // Restore original user data
      setFirstName(originalUserData.firstName);
      setLastName(originalUserData.lastName);
      setPhone(originalUserData.phone);
      setEmail(originalUserData.email);
    } else {
      // Clear fields for someone else
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // If the form isn't valid, focus on first error field and return
      if (!isFormValid) {
        focusFirstErrorField();

        if (!date || !hours || !minutes) {
          showErrorAlert({
            title: "Time Required",
            message: PICKUP_TIME_REQUIRED,
          });
          return;
        }

        const timeValidation = validateTime(
          date,
          hours,
          minutes,
          period,
          false
        );
        if (!timeValidation.isValid) {
          showErrorAlert({
            title: "Invalid Time",
            message: PICKUP_TIME_IN_PAST,
          });
          return;
        }

        if (!firstName || !lastName || !phone || !email) {
          showErrorAlert({
            title: "Missing details",
            message: PICKUP_DETAILS_REQUIRED,
          });
          return;
        }

        if (isCurbsidePickup && (!vehicleType || !vehicleNumber)) {
          showErrorAlert({
            title: "Missing vehicle info",
            message: PICKUP_DETAILS_REQUIRED,
          });
          return;
        }

        return;
      }

      setIsLoading(true);

      // Format time string
      const formattedTime = `${hours}:${minutes} ${period}`;

      // Prepare pickup details
      const pickupDetails = {
        date,
        time: formattedTime,
        firstName,
        lastName,
        phone,
        email,
        vehicleType: isCurbsidePickup ? vehicleType : null,
        vehicleNumber: isCurbsidePickup ? vehicleNumber : null,
        additionalDetails: isCurbsidePickup ? additionalDetails : null,
      };

      // Navigate to order summary screen
      redirectToPage(containers.orderSummeryScreenScreen, {
        pickupDetails: JSON.stringify(pickupDetails),
        pickupAddress: JSON.stringify(pickupDetails),
        selectedMode: isStorePickup ? "storePickup" : "curbsidePickup",
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

  // Handle email input change with validation
  const handleEmailChange = (text: any) => {
    console.log("Email input: ", text);
    setEmail(text);

    if (!text) {
      setEmailError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text.trim())) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError(null);
    }
  };

  // Reusable text input component
  const renderTextInput = (
    label: any,
    value: any,
    onChangeText: any,
    required = true,
    props: TextInputProps = {},
    error = null,
    ref?: React.Ref<TextInput> | null
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        style={[
          inputStyles.textInput,
          error && inputStyles.inputError,
          props?.editable === false && { backgroundColor: colors.paleWhite },
        ]}
        {...props}
      />
      {error && <Text style={inputStyles.errorText}>{error}</Text>}
    </View>
  );

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      hasFooter={false}
      hasHeader
      scrollable={false}
      headerComponent={
        <Header
          headerText={
            isStorePickup ? PickupMode.STORE_PICKUP : PickupMode.CURBSIDE_PICKUP
          }
        />
      }
    >
      <KeyBoardWrapper>
        <ScrollView ref={scrollViewRef}>
          <View
            style={[
              // globalStyles.sectionContent,
              globalStyles.pt_0,
            ]}
          >
            {/* Instructions */}
            <Text style={styles.label}>
              {isStorePickup
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
                  onChange={(e) => {
                    setDate(e.target.value);
                    validateTime(e.target.value, hours, minutes, period);
                  }}
                  min={new Date().toISOString().split("T")[0]}
                />
              ) : (
                <TouchableOpacity
                  style={globalStyles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>{formatToDDMMYYYY(date)}</Text>
                </TouchableOpacity>
              )}
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={(selectedDate) => {
                  const isoDate = selectedDate.toISOString().split("T")[0];
                  setDate(isoDate);
                  setPickupDate(formatToDDMMYYYY(selectedDate));
                  validateTime(isoDate, hours, minutes, period);
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
                minimumDate={new Date()}
              />
            </View>

            {/* Time Input */}
            <Text style={styles.inputLabel}>Time: *</Text>
            <View style={globalStyles.timeContainer}>
              {/* Hours */}
              <TextInput
                ref={hoursRef}
                style={[
                  globalStyles.timeInput,
                  timeError ? { borderColor: "red" } : {},
                ]}
                placeholder="HH"
                keyboardType="numeric"
                maxLength={2}
                value={hours}
                onChangeText={handleHoursChange}
                accessibilityLabel="Hours"
              />
              <Text>:</Text>
              {/* Minutes */}
              <TextInput
                ref={minutesRef}
                style={[
                  globalStyles.timeInput,
                  timeError ? { borderColor: "red" } : {},
                ]}
                placeholder="MM"
                keyboardType="numeric"
                maxLength={2}
                value={minutes}
                onChangeText={handleMinutesChange}
                accessibilityLabel="Minutes"
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

            {/* Time validation error message */}
            {timeError ? (
              <Text style={inputStyles.errorText}>{timeError}</Text>
            ) : null}

            {/* Curbside Specific Fields */}
            {isCurbsidePickup && (
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
                    <ModalSelector
                      data={VEHICLE_TYPE_OPTIONS}
                      initValue="Select Vehicle Type"
                      onChange={(option) => setVehicleType(option.value)}
                      optionTextStyle={{ color: colors.primary }}
                      optionContainerStyle={{ backgroundColor: colors.white }}
                      cancelStyle={{ backgroundColor: colors.white }}
                      accessible={true}
                      accessibilityLabel="Select vehicle type"
                    >
                      <TextInput
                        style={globalStyles.picker_50}
                        editable={false}
                        value={vehicleType}
                      />
                    </ModalSelector>
                  </View>
                </View>

                {renderTextInput(
                  "Vehicle Number",
                  vehicleNumber,
                  setVehicleNumber,
                  true,
                  {},
                  null,
                  vehicleNumberRef
                )}

                {renderTextInput(
                  "Additional Details",
                  additionalDetails,
                  setAdditionalDetails,
                  false,
                  {
                    multiline: true,
                    numberOfLines: 3,
                  }
                )}
              </>
            )}

            {/* Collector Information */}
            <Text style={styles.sectionTitle}>
              Let us know who is collecting?
            </Text>

            <View style={styles.collectorOptions}>
              {/* Myself option */}
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleCollectorChange("myself")}
                accessible={true}
                accessibilityLabel="Select myself as collector"
                accessibilityRole="radio"
                accessibilityState={{ checked: collector === "myself" }}
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

              {/* Someone else option */}
              <TouchableOpacity
                style={styles.radioOption}
                onPress={() => handleCollectorChange("someone_else")}
                accessible={true}
                accessibilityLabel="Select someone else as collector"
                accessibilityRole="radio"
                accessibilityState={{ checked: collector === "someone_else" }}
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

            {/* User information fields */}
            {renderTextInput(
              "First Name",
              firstName,
              setFirstName,
              true,
              { editable: collector !== "myself" },
              null,
              firstNameRef
            )}
            {renderTextInput(
              "Last Name",
              lastName,
              setLastName,
              true,
              { editable: collector !== "myself" },
              null,
              lastNameRef
            )}
            {renderTextInput(
              "Phone",
              phone,
              setPhone,
              true,
              {
                keyboardType: "phone-pad",
              },
              null,
              phoneRef
            )}
            {renderTextInput(
              "Email",
              email,
              handleEmailChange,
              true,
              {
                keyboardType: "email-address",
                autoCapitalize: "none",
              },
              emailError,
              emailRef
            )}

            <Text style={inputStyles.note}>
              *Please ensure you carry a valid ID Proof
            </Text>

            {/* Submit button */}
            <Button
              title="Confirm"
              onPress={handleSubmit}
              disabled={isLoading}
              style={isLoading ? inputStyles.disabledButton : {}}
            />
          </View>
        </ScrollView>
        {/* </View> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 5,
  },
  inputError: {
    borderColor: "red",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default PickupScreen;
