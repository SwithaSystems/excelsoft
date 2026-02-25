import {
  DATE_FORMAT_Display,
  // DEFAULT_PICKUP_HOURS,
  DELIVERY_MODE_HOME,
  STORE_CLOSING_TIMINGS,
  STORE_OPENING_TIMINGS,
} from "../../../constants/stringLiterals";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import styles from "./HomeDeliveryStyles";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Button from "@/app/components/commonComponents/Button";
import { useLocalSearchParams } from "expo-router";
import { Address, addressService } from "@/services/addressService";
import AddressItem from "../../components/AddressItem";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  MISSING_REQUIRED_FIELDS,
  PICKUP_TIME_REQUIRED,
  PICKUP_TIME_IN_PAST,
  ADDRESS_NOT_SAVED,
} from "../../../constants/customErrorMessages";
import { format, parse } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import Footer from "@/app/components/Footer";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Minimum pickup time (30 minutes from now)
const MIN_PICKUP_MINUTES = 30;

const HomeDeliveryScreen = () => {
  const { orderId, mode } = useLocalSearchParams();
  // Date and time state (default to today on web so the date input shows and submits correctly)
  const [date, setDate] = useState(() =>
    Platform.OS === "web" ? format(new Date(), DATE_FORMAT_Display) : ""
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");

  const isWeb = Platform.OS === "web";
      
  const { isMobile } = useWebMediaQuery();
  const isMobileWeb = isWeb && isMobile;

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
  const [existingAddress, setExistingAddress] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [errorModalState, setErrorModalState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttonLabel: "OK",
  });

  const showErrorAlert = ({
    title,
    message,
    buttonLabel = "OK",
  }: {
    title: string;
    message: string;
    buttonLabel?: string;
  }) => {
    setErrorModalState({
      isVisible: true,
      title,
      message,
      buttonLabel,
    });
  };

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
        now.getTime() + /*DEFAULT_PICKUP_HOURS */ 2 * 60 * 60 * 1000
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

    const formattedDate = format(targetDate, DATE_FORMAT_Display);
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
  const selectedAddressIdRef = useRef(selectedAddressId);
useEffect(() => {
  selectedAddressIdRef.current = selectedAddressId;
}, [selectedAddressId]);
const fetchAddresses = useCallback(async (retryCount = 0) => {
  const MAX_RETRIES = 3;
  setIsLoadingAddresses(true);

  try {
    const token = await SecureStore.getItemAsync("token");
    const refreshToken = await SecureStore.getItemAsync("refreshtoken");

    if (!token && !refreshToken) {
      setIsLoadingAddresses(false);
      showErrorAlert({
        title: "Session Expired",
        message: "Please login again to continue.",
      });
      return;
    }

    const response = await addressService.getAllAddress();
    setExistingAddress(response);

    // ✅ Use ref instead of state value — no dependency needed
    if (response.length === 1 && !selectedAddressIdRef.current) {
      setSelectedAddressId(response[0]._id);
      setAddress(response[0]);
    }
    setIsLoadingAddresses(false);
  } catch (err: any) {
    if (err.response?.status === 401 && retryCount < MAX_RETRIES) {
      setIsLoadingAddresses(false);
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
      setTimeout(() => fetchAddresses(retryCount + 1), delay);
    } else {
      setIsLoadingAddresses(false);
      if (retryCount >= MAX_RETRIES) {
        const errorMessage = err.response?.status === 401
          ? "Session expired. Please login again."
          : "Failed to load addresses. Please check your connection and try again.";
        showErrorAlert({ title: "Error Loading Addresses", message: errorMessage });
      }
    }
  }
}, []);

  // Fetch addresses function with retry logic and token check
  // const fetchAddresses = useCallback(async (retryCount = 0) => {
  //   const MAX_RETRIES = 3;
  //   setIsLoadingAddresses(true);
    
  //   try {
  //     // First, verify token exists
  //     const token = await SecureStore.getItemAsync("token");
  //     const refreshToken = await SecureStore.getItemAsync("refreshtoken");
      
  //     // console.log("=== Fetch Addresses Debug ===");
  //     // console.log("Token exists:", !!token);
  //     // console.log("Refresh token exists:", !!refreshToken);
  //     // console.log("Retry attempt:", retryCount);
      
  //     if (!token && !refreshToken) {
  //       console.error("No tokens found - user may need to login again");
  //       setIsLoadingAddresses(false);
  //       showErrorAlert({
  //         title: "Session Expired",
  //         message: "Please login again to continue.",
  //       });
  //       // Optionally redirect to login
  //       // redirectToPage(containers.signInScreen);
  //       return;
  //     }
      
  //     // console.log("Attempting to fetch addresses...");
  //     const response = await addressService.getAllAddress();
  //     // console.log("Successfully fetched addresses:", response.length, "addresses");
  //     setExistingAddress(response);
      
  //     // If there's only one address and none is selected, auto-select it
  //     if (response.length === 1 && !selectedAddressId) {
  //       // console.log("Auto-selecting single address");
  //       setSelectedAddressId(response[0]._id);
  //       setAddress(response[0]);
  //     }
  //     setIsLoadingAddresses(false);
  //   } catch (err: any) {
  //     console.error("=== Error fetching addresses ===");
  //     console.error("Attempt:", retryCount + 1, "of", MAX_RETRIES + 1);
  //     console.error("Error:", err);
  //     console.error("Error message:", err.message);
  //     console.error("Error response:", err.response?.data);
  //     console.error("Error status:", err.response?.status);
      
  //     // If it's a 401 error and we haven't exceeded retries, wait and retry
  //     if (err.response?.status === 401 && retryCount < MAX_RETRIES) {
  //       // console.log("Got 401 error, waiting before retry...");
  //       setIsLoadingAddresses(false);
        
  //       // Exponential backoff: wait longer with each retry
  //       const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
  //       // console.log(`Retrying in ${delay}ms...`);
        
  //       setTimeout(() => {
  //         fetchAddresses(retryCount + 1);
  //       }, delay);
  //     } else {
  //       setIsLoadingAddresses(false);
        
  //       // Only show error alert after all retries exhausted
  //       if (retryCount >= MAX_RETRIES) {
  //         const errorMessage = err.response?.status === 401 
  //           ? "Session expired. Please login again."
  //           : "Failed to load addresses. Please check your connection and try again.";
            
  //         showErrorAlert({
  //           title: "Error Loading Addresses",
  //           message: errorMessage,
  //         });
          
  //         // If 401 after all retries, consider redirecting to login
  //         if (err.response?.status === 401) {
  //           // console.log("Authentication failed after retries, may need to login");
  //           // Uncomment to auto-redirect to login:
  //           // setTimeout(() => redirectToPage(containers.signInScreen), 2000);
  //         }
  //       }
  //     }
  //   }
  // }, [selectedAddressId]);

  // Use useFocusEffect to refresh addresses when screen comes into focus
  // This ensures addresses are fetched when navigating back from add address screen
  useFocusEffect(
    useCallback(() => {
      // console.log("HomeDeliveryScreen focused - fetching addresses");
      fetchAddresses(0);
    }, [fetchAddresses])
  );

  // Also fetch on mount
  // useEffect(() => {
  //   // console.log("HomeDeliveryScreen mounted - initial address fetch");
  //   fetchAddresses(0);
  // }, []);
useFocusEffect(
  useCallback(() => {
    fetchAddresses(0);
  }, [fetchAddresses]) // fetchAddresses is now stable, so this only runs on focus
);
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

  // Check form validity whenever any input changes
  useEffect(() => {
    validateFormFields();
  }, [hours, minutes, period, date, selectedAddressId, existingAddress]);

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
        existingAddress.length > 0 &&
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
    setDate(format(currentDate, DATE_FORMAT_Display));

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

      const shippingAddress = existingAddress.find(
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
      redirectToPage(containers.orderSummaryScreen, {
        pickupAddress: JSON.stringify(address),
        selectedMode: DELIVERY_MODE_HOME,
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

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const response = await addressService.deleteAddress(itemToDelete.id);
        if (response.success) {
          setExistingAddress((prev) =>
            prev.filter((item) => item._id !== itemToDelete.id)
          );

          // If deleted address was selected, clear selection
          if (selectedAddressId === itemToDelete.id) {
            setSelectedAddressId(null);
            setAddress("");
          }
        } else {
          showErrorAlert({
            title: "Error",
            message: "Failed to delete address.",
          });
        }
      } catch (err) {
        console.error("Delete error:", err);
        showErrorAlert({
          title: "Error",
          message: "Something went wrong while deleting the address.",
        });
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
    redirectToPage(containers.addAddressScreen, {
      edit_address: JSON.stringify(item),
      from: "homeDelivery",
    });
  };

  const handleDeleteAddress = (item: Address) => {
    setItemToDelete({ id: item._id });
    setIsModalVisible(true);
  };

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
    const numericText = text.replace(/[^0-9]/g, "");
    setHours(numericText);

    if (numericText.length === 2) {
      if (minutesRef.current) {
        (minutesRef.current as any).focus();
      }
    }

    setTimeout(() => {
      validateTime(date, numericText, minutes, period);
    }, 100);
  };

  // Handle minutes input changes
  const handleMinutesChange = (text: any) => {
    const numericText = text.replace(/[^0-9]/g, "");
    setMinutes(numericText);

    if (numericText.length === 2) {
      setTimeout(() => {
        validateTime(date, hours, numericText, period);
      }, 100);
    }
  };

  // Handle period changes
  const handlePeriodChange = (value: any) => {
    setPeriod(value);
    setTimeout(() => {
      validateTime(date, hours, minutes, value);
    }, 100);
  };

  // Handle blur events to validate when leaving a field
  const handleBlur = () => {
    validateTime(date, hours, minutes, period);
  };

  // const isWeb = Platform.OS === "web";
  
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={DELIVERY_MODE_HOME} />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <Footer />;
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isWeb}
      footerComponent={isWeb ? <FooterWeb /> : undefined}
      scrollable={true}
    >
      <View
        style={[
          globalStyles.pt_0,
           isWeb
                ? {
                    width: isMobileWeb ? "95%" : "70%",
                    alignSelf: "center",
                    paddingVertical: isMobileWeb ? 12 : 20,
                  }
                : { paddingHorizontal: 0 },
            ]}
      >
        <KeyBoardWrapper>
          {isWeb && (
            <Text
              style={{
                fontSize: 28,
                fontWeight: "300",
                marginBottom: 20,
                color: colors.black,
                textAlign: "center",
                width: "100%",
                marginTop: 20,
              }}
            >
              {DELIVERY_MODE_HOME}
            </Text>
          )}

          <FlatList
            ListHeaderComponent={
              <>
                <View style={[globalStyles.pt_0]}>
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
                        value={
                          date
                            ? format(
                                parse(date, DATE_FORMAT_Display, new Date()),
                                "yyyy-MM-dd"
                              )
                            : format(new Date(), "yyyy-MM-dd")
                        }
                        onChange={(e) => {
                          const isoDate = e.target.value;
                          setDate(
                            isoDate
                              ? format(new Date(isoDate), DATE_FORMAT_Display)
                              : ""
                          );
                        }}
                        min={format(new Date(), "yyyy-MM-dd")}
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
                      <DateTimePickerModal
                        isVisible={showDatePicker}
                        mode="date"
                        onConfirm={(selectedDate) => {
                          setShowDatePicker(false);
                          setDate(format(selectedDate, DATE_FORMAT_Display));
                          setTimeout(() => {
                            validateTime(
                              format(selectedDate, DATE_FORMAT_Display),
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.inputLabel}>Shipping Address: *</Text>
                      <TouchableOpacity
                        onPress={() => {
                          redirectToPage(containers.addAddressScreen, {
                            from: "homeDelivery",
                          });
                        }}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text style={styles.linkText}>Add Address</Text>
                        <Ionicons
                          name="add-circle-outline"
                          size={16}
                          color={colors.primary}
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Address List */}
                  {isLoadingAddresses ? (
                    <View style={{ alignItems: 'center', marginVertical: 20 }}>
                      <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                        Loading addresses...
                      </Text>
                    </View>
                  ) : existingAddress.length === 0 ? (
                    <View style={{ alignItems: 'center', marginVertical: 20 }}>
                      <Text style={{ textAlign: 'center', marginBottom: 10, color: colors.darkGray }}>
                        No addresses found. Please add an address to continue.
                      </Text>
                      <TouchableOpacity 
                        onPress={() => fetchAddresses(0)}
                        style={{
                          padding: 10,
                          backgroundColor: colors.primary,
                          borderRadius: 5,
                          marginTop: 10,
                          alignSelf: 'center',
                        }}
                      >
                        <Text style={{ color: 'white', fontWeight: '600' }}>
                          Retry Loading Addresses
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <FlatList
                      data={existingAddress}
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
                  )}

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
                  title="Delete Address"
                  text="Are you sure you want to delete this address?"
                  submitText="Delete Address"
                  handleSubmit={confirmDelete}
                  cancelText="Cancel"
                  handleCancel={cancelDelete}
                  isDestructive={true}
                />
                <ConfirmationModal
                  onClose={() =>
                    setErrorModalState((prev) => ({ ...prev, isVisible: false }))
                  }
                  isModalVisible={errorModalState.isVisible}
                  title={errorModalState.title}
                  text={errorModalState.message}
                  submitText={errorModalState.buttonLabel}
                  handleSubmit={() =>
                    setErrorModalState((prev) => ({ ...prev, isVisible: false }))
                  }
                />
              </>
            }
            data={[]}
            renderItem={null}
          />
        </KeyBoardWrapper>
      </View>
    </LayoutComponent>
  );
};

export default HomeDeliveryScreen;