import {
  DELIVERY_MODE_CURBSIDE,
  DELIVERY_MODE_HOME,
  DELIVERY_MODE_STORE,
  ORDER_SUMMARY_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
  Platform,
  useWindowDimensions,
} from "react-native";
import styles from "./OrderSummeryStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
import { useLocalSearchParams } from "expo-router";
import { CheckBox } from "react-native-elements";
import CartItem from "../cart/Components/CartItem";
import OrderSummary from "@/app/components/OrderSummary";
import Button from "@/app/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { removeFromCart } from "@/store/slices/cartSlice";
import { addToSavedItems } from "@/store/slices/savedItemsSlice";
import { orderService, PickupMode } from "@/services/orderService";
import { Address, addressService } from "@/services/addressService";
import { RootState } from "@/store/store";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import AddressItem from "../../components/AddressItem";
import { useAppContext } from "@/context/AppContext";
// import { usePaymentHandler } from "../../components/usePaymentHandler";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { ProductsAPI } from "@/services/productService";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import { StripeCardInput } from "@/app/components/StripeCardInput";
import usePaymentHandlerWeb from "@/app/components/usePaymentHandlerWeb";
import * as All from "@/app/components/usePaymentHandlerWeb";
import { usePaymentHandler } from "@/app/components/usePaymentHandlerWrapper";
import { DebugPaymentTest } from "@/app/components/DebugPaymentTest";
// type OrderSummeryScreenParams = {
//   orderId: string;
//   address?: string;
//   pickupAddress?: string;
//   selectedDate?: string;
//   selectedSlot?: string;
//   selectedMode?: string;
//   firstName?: string;
//   lastName?: string;
//   phone?: string;
//   email?: string;
//   additionalDetails?: string;
// };

type shippingAddressDTo = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  addressType: string[];
  phone: string;
};

const orderSummeryScreen = () => {
  // Use ref to track component mount status
  const isMountedRef = useRef(true);
  const [addressData, setAddressData] = useState<Address[]>([]);
  const params = useLocalSearchParams<any>();
  // const [aselectedBillingAddress, asetSelectedBillingAddress] = useState<any>();
  // const [substitutionSelected, setSubstitutionSelected] = useState(false);
  // const cartItems = useSelector((state: any) => [...state.cart.items]);
  const cartItemsBefore = useSelector((state: any) => state.cart.items);
  // Safe cart items selection with proper typing
  // const cartItemsFromStore = useSelector((state: RootState) => {
  //   return Array.isArray(state?.cart?.items) ? state.cart.items : [];
  // });
  const cartItems = useMemo(() => {
    try {
      return cartItemsBefore.filter(
        (item: any) =>
          item && typeof item === "object" && (item.quantity || 0) > 0
      );
    } catch (error) {
      console.error("Error filtering cart items:", error);
      return [];
    }
  }, [cartItemsBefore]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<any>(null);

  // UPDATED: Only default to true for home delivery
  const [useSameAddress, setUseSameAddress] = useState(
    params?.selectedMode === DELIVERY_MODE_HOME
  );
  const [accordionOpen, setAccordionOpen] = useState(false);
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const isWeb = Platform.OS === "web";

  console.log("All module:", All);
  // console.log("usePaymentHandlerWeb typeof:", typeof All.usePaymentHandlerWeb);
  console.log("usePaymentHandlerWeb type:", typeof usePaymentHandlerWeb);

  const { handlePayment } = usePaymentHandler();

  // Safe JSON parsing with comprehensive error handling
  const parseJsonSafely = useCallback(
    (jsonString: string | undefined, fallback: any = null) => {
      if (!jsonString || typeof jsonString !== "string") {
        return fallback;
      }

      try {
        const parsed = JSON.parse(jsonString);
        return parsed && typeof parsed === "object" ? parsed : fallback;
      } catch (error) {
        console.error("JSON parsing error:", error, "Input:", jsonString);
        return fallback;
      }
    },
    []
  );

  // Extract pickup data from route params or use default values
  const pickupAddress = useMemo(() => {
    try {
      const parsed = parseJsonSafely(params?.pickupAddress);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
      return null;
    }
  }, [params?.pickupAddress, parseJsonSafely]);

  const pickupDetails = useMemo(() => {
    try {
      const parsed = parseJsonSafely(params?.pickupDetails, {});
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      console.error("Invalid pickupDetails JSON:", e);
      return {};
    }
  }, [params?.pickupDetails, parseJsonSafely]);

  // useEffect(() => {
  //   console.log("pickup details", pickupDetails);
  // }, [pickupDetails]);

  const selectedMode = params?.selectedMode || "Delivery";

  const { selectedBillingAddress, setSelectedBillingAddress } = useAppContext();
  const [stockAvailable, setStockAvailable] = useState<Record<string, number>>(
    {}
  );

  // FIXED: Memoize shippingAddress to prevent recreating on every render
  const shippingAddress: shippingAddressDTo | undefined = useMemo(() => {
    if (!pickupAddress || typeof pickupAddress !== "object") {
      return undefined;
    }
    try {
      return {
        name:
          String(
            pickupAddress.name ||
              `${pickupAddress.firstName || ""} ${pickupAddress.lastName || ""}`
          ).trim() || "Unknown",
        line1: String(pickupAddress.line1 || pickupAddress.address || ""),
        line2: String(pickupAddress.line2 || ""),
        city: String(pickupAddress.city || ""),
        state: String(pickupAddress.state || ""),
        postalCode: String(pickupAddress.postalCode || ""),
        phone: String(pickupAddress.phone || ""),
        addressType: Array.isArray(pickupAddress.addressType)
          ? pickupAddress.addressType
          : [],
      };
    } catch (error) {
      console.error("Error creating shipping address:", error);
      return undefined;
    }
  }, [pickupAddress]);

  // Cleanup function
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    if (!cartItems || cartItems.length === 0) {
      if (isActive && isMountedRef.current) {
        setStockAvailable({});
      }
      return;
    }
    const fetchStock = async () => {
      try {
        const ids = cartItems
          .map((item: any) => String(item?._id || ""))
          .filter(Boolean);

        if (ids.length === 0) {
          if (isActive && isMountedRef.current) {
            setStockAvailable({});
          }
          return;
        }

        const results = await Promise.allSettled(
          ids.map((_id: any) => ProductsAPI.getProductBy_mongoID(_id))
        );

        const newStock: Record<string, number> = {};
        ids.forEach((id: any, idx: any) => {
          const result = results[idx];
          if (
            result.status === "fulfilled" &&
            result.value?.stock !== undefined
          ) {
            newStock[id] = Number(result.value.stock) || 0;
          } else {
            newStock[id] = 0;
          }
        });

        if (isActive && isMountedRef.current) {
          setStockAvailable((prev) => {
            const hasChanges = Object.keys(newStock).some(
              (key) => newStock[key] !== (prev[key] || 0)
            );
            return hasChanges ? newStock : prev;
          });
        }
      } catch (error) {
        console.error("Error fetching stock:", error);
        if (isActive && isMountedRef.current) {
          setStockAvailable({});
        }
      }
    };

    fetchStock();

    return () => {
      isActive = false;
    };
  }, [cartItems]);

  const displayMode = useMemo(() => {
    switch (selectedMode) {
      case DELIVERY_MODE_CURBSIDE:
        return "Curbside Pickup";
      case DELIVERY_MODE_STORE:
        return "Store Pickup";
      case DELIVERY_MODE_HOME:
        return "Home Delivery";
      default:
        return String(selectedMode || "Delivery");
    }
  }, [selectedMode]);

  const toggleAccordion = useCallback(() => {
    const newState = !accordionOpen;
    setAccordionOpen(newState);

    Animated.timing(rotateAnimation, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [accordionOpen, rotateAnimation]);

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  // Fetch addresses with proper error handling
  useEffect(() => {
    let isActive = true;

    const fetchAddresses = async () => {
      try {
        const addresses = await addressService.getAllAddress();
        console.log("Address Data", addresses);

        if (isActive && isMountedRef.current) {
          setAddressData(Array.isArray(addresses) ? addresses : []);

          if (selectedBillingAddress?._id) {
            setSelectedId(selectedBillingAddress._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch billing addresses:", error);
        if (isActive && isMountedRef.current) {
          setAddressData([]);
        }
      }
    };

    fetchAddresses();

    return () => {
      isActive = false;
    };
  }, [selectedBillingAddress]);

  const setBillingAddress_Default = () => {
    if (selectedMode === DELIVERY_MODE_HOME) {
      return;
    }

    // Only proceed if we don't already have a selected billing address
    if (selectedBillingAddress && selectedBillingAddress._id) {
      return;
    }
    let isActive = true;
    const defaultAddress = addressData.find(
      (address) => address.isDefault === true
    );
    console.log("defalut address", defaultAddress);
    let addressToSelect = null;
    if (addressData.length > 1) {
      if (defaultAddress) {
        addressToSelect = defaultAddress;
      } else return;
    } else if (addressData.length === 1) {
      addressToSelect = addressData[0];
    }
    if (addressToSelect && isActive && isMountedRef.current) {
      setSelectedBillingAddress(addressToSelect);
      setSelectedId(addressToSelect._id);
      console.log("Auto-selected billing address:", addressToSelect);
    }
    return () => {
      isActive = false;
    };
  };
  useEffect(() => {
    setBillingAddress_Default();
  }, [
    addressData,
    selectedMode,
    setSelectedBillingAddress,
    selectedBillingAddress,
  ]);

  useEffect(() => {
    if (
      selectedMode === DELIVERY_MODE_HOME &&
      shippingAddress &&
      useSameAddress &&
      !selectedBillingAddress
    ) {
      const billingFromShipping: any = {
        name: shippingAddress.name,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
      };

      if (
        !selectedBillingAddress ||
        selectedBillingAddress.line1 !== billingFromShipping.line1 ||
        selectedBillingAddress.name !== billingFromShipping.name
      ) {
        setSelectedBillingAddress(billingFromShipping);
        setSelectedId(billingFromShipping._id || null);
      }
    }
  }, [shippingAddress, useSameAddress, selectedMode, selectedBillingAddress]);

  const handleSameAddressToggle = useCallback(() => {
    if (!isMountedRef.current) return;

    const newValue = !useSameAddress;
    setUseSameAddress(newValue);

    if (newValue && shippingAddress?.line1) {
      const billingFromShipping = {
        _id: `shipping-${Date.now()}`,
        name: shippingAddress.name,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        addressType: shippingAddress.addressType || [],
        phone: shippingAddress.phone,
      };

      try {
        setSelectedBillingAddress(billingFromShipping);
        setSelectedId(billingFromShipping._id);

        if (accordionOpen) {
          setAccordionOpen(false);
          Animated.timing(rotateAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      } catch (error) {
        console.error("Error setting billing from shipping:", error);
      }
    } else {
      setSelectedBillingAddress(null);
      setSelectedId(null);
    }
  }, [
    useSameAddress,
    shippingAddress,
    accordionOpen,
    rotateAnimation,
    setSelectedBillingAddress,
  ]);

  const handleEdit = useCallback(
    (item: Address) => {
      if (!isMountedRef.current) return;

      try {
        setSelectedBillingAddress(item);
        redirectToPage(containers.billingAddressScreen, {
          edit_address: JSON.stringify(item),
        });
      } catch (error) {
        console.error("Error handling edit:", error);
        Alert.alert("Error", "Failed to edit address. Please try again.");
      }
    },
    [setSelectedBillingAddress]
  );

  const handleAddBillingAddress = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      redirectToPage(containers.billingAddressScreen, {
        onAddressAdded: async () => {
          try {
            if (isMountedRef.current) {
              const addresses = await addressService.getAllAddress();
              setAddressData(Array.isArray(addresses) ? addresses : []);
            }
          } catch (error) {
            console.error("Failed to refresh addresses:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error navigating to add address:", error);
      Alert.alert("Error", "Failed to open add address screen.");
    }
  }, [setSelectedBillingAddress]);

  const handleBillingAddressDelete = useCallback(
    async (item: Address) => {
      if (!isMountedRef.current || !item?._id) return;

      try {
        const { success } = await addressService.deleteAddress(item._id);

        if (success && isMountedRef.current) {
          const addresses = await addressService.getAllAddress();
          setAddressData(Array.isArray(addresses) ? addresses : []);

          // Clear selection if deleted address was selected
          if (selectedId === item._id) {
            setSelectedId(null);
            setSelectedBillingAddress(null);
          }

          Alert.alert("Success", "Billing address deleted successfully");
        } else {
          Alert.alert("Error", "Failed to delete billing address");
        }
      } catch (error) {
        console.error("Failed to delete billing address:", error);
        Alert.alert("Error", "Failed to delete billing address");
      }
    },
    [selectedId, setSelectedBillingAddress]
  );

  // Handle billing address selection
  const handleSelectBillingAddress = useCallback(
    (item: Address) => {
      console.log("Address item", item);
      if (!isMountedRef.current || !item) return;

      try {
        if (selectedMode === DELIVERY_MODE_HOME) {
          setUseSameAddress(false);
        }

        setSelectedId(item._id || null);
        setSelectedBillingAddress(item);
        console.log("Selected billing address:", item);
      } catch (error) {
        console.error("Error selecting billing address:", error);
      }
    },
    [selectedMode, setSelectedBillingAddress]
  );
  const handleDelete = useCallback((item: any) => {
    if (!isMountedRef.current) return;
    setItemToDelete(item);
    setIsModalVisible(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!isMountedRef.current || !itemToDelete) return;

    try {
      dispatch(removeFromCart(itemToDelete.id));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }

    setIsModalVisible(false);
    setItemToDelete(null);
  }, [itemToDelete, dispatch]);

  const cancelDelete = useCallback(() => {
    if (!isMountedRef.current || !itemToDelete) return;

    try {
      const itemToSave = cartItems.find(
        (item: any) => item?.id === itemToDelete.id
      );

      if (itemToSave) {
        dispatch(addToSavedItems(itemToSave));
        dispatch(removeFromCart(itemToDelete.id));
      }
    } catch (error) {
      console.error("Error saving item for later:", error);
    }

    setIsModalVisible(false);
    setItemToDelete(null);
  }, [itemToDelete, cartItems, dispatch]);

  // Payment enablement logic
  const isPickupMode = useMemo(() => {
    return (
      selectedMode === DELIVERY_MODE_CURBSIDE ||
      selectedMode === DELIVERY_MODE_STORE
    );
  }, [selectedMode]);

  const isPaymentEnabled = useMemo(() => {
    try {
      const hasCartItems = cartItems && cartItems.length > 0;
      const hasBillingAddress =
        selectedBillingAddress &&
        Object.keys(selectedBillingAddress).length > 0;
      const hasShippingForDelivery = isPickupMode || shippingAddress?.line1;
      const hasPickupDetails = isPickupMode
        ? pickupDetails?.date && pickupDetails?.time
        : true;

      const hasValidMode =
        selectedMode &&
        (Array.isArray(selectedMode) ? selectedMode[0] : selectedMode);

      return (
        hasCartItems &&
        hasBillingAddress &&
        hasShippingForDelivery &&
        hasPickupDetails &&
        hasValidMode
      );
    } catch (error) {
      console.error("Error calculating payment enabled state:", error);
      return false;
    }
  }, [
    cartItems,
    selectedBillingAddress,
    isPickupMode,
    shippingAddress,
    pickupDetails,
    selectedMode,
  ]);

  // Safe render functions
  const renderAddressText = useCallback(() => {
    if (!pickupAddress) return "No address available";

    try {
      if (selectedMode === DELIVERY_MODE_STORE) {
        return `${pickupAddress.firstName || ""} ${pickupAddress.lastName || ""}
Email: ${pickupAddress.email || ""}
Contact Number: ${pickupAddress.phone || ""}`;
      } else if (selectedMode === DELIVERY_MODE_CURBSIDE) {
        return `${pickupAddress.firstName || ""} ${pickupAddress.lastName || ""}
Vehicle Type: ${pickupAddress.vehicleType || ""}
Vehicle Number: ${pickupAddress.vehicleNumber || ""}
Additional Details: ${pickupAddress.additionalDetails || "None"}
Email: ${pickupAddress.email || ""}
Contact Number: ${pickupAddress.phone || ""}`;
      } else {
        return `${pickupAddress.name || ""}, ${pickupAddress.line1 || ""}${
          pickupAddress.line2 ? `, ${pickupAddress.line2}` : ""
        }, ${pickupAddress.city || ""}, ${pickupAddress.postalCode || ""}
Contact Number: ${pickupAddress.phone || ""}`;
      }
    } catch (error) {
      console.error("Error rendering address text:", error);
      return "Error displaying address";
    }
  }, [pickupAddress, selectedMode]);

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={ORDER_SUMMARY_SCREEN_TITLE} />
  );

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter={isTabOrDesktop}
      footerComponent={isTabOrDesktop ? <FooterWeb /> : undefined}
      scrollable={false}
    >
      {isTabOrDesktop ? (
        // WEB LAYOUT
        <View style={styles.webContainer}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingRight: 0, paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            <Text style={styles.webPageTitle}>Order Details</Text>

            <View style={styles.webContentWrapper}>
              {/* Left Section - Cart Items */}
              <View style={styles.webLeftSection}>
                {cartItems.map((eachCartItem: any) => (
                  <CartItem
                    handleDelete={handleDelete}
                    key={eachCartItem.id}
                    cartItem={eachCartItem}
                    stockAvailable={stockAvailable[eachCartItem._id] || 0}
                  />
                ))}
              </View>

              {/* Right Section - Order Summary */}
              <View style={styles.webRightSection}>
                {/* Address Section */}
                <View style={styles.webSectionCard}>
                  <Text style={styles.webSectionTitle}>Address</Text>
                  <View style={styles.webAddressBox}>
                    <Text style={styles.webAddressText}>
                      {renderAddressText()}
                    </Text>
                  </View>
                </View>

                {/* Your Slot Section */}
                <View style={styles.webSectionCard}>
                  <Text style={styles.webSectionTitle}>Your Slot</Text>
                  <Text style={styles.webSlotText}>
                    You've selected a delivery slot for{" "}
                    {selectedMode === DELIVERY_MODE_HOME
                      ? pickupDetails?.date
                      : pickupAddress?.date}{" "}
                    from{" "}
                    {selectedMode === DELIVERY_MODE_HOME
                      ? pickupDetails?.time
                      : pickupAddress?.time}{" "}
                    with {displayMode} as your chosen mode.
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.webChangeSlotLink}>
                      change the slot
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.webSectionCard}>
                  <Text style={styles.webSectionTitle}>Billing Address</Text>

                  {selectedMode === DELIVERY_MODE_HOME && (
                    <View style={styles.webCheckboxRow}>
                      <CheckBox
                        checked={useSameAddress}
                        onPress={handleSameAddressToggle}
                        checkedColor={colors.primary}
                        uncheckedColor={colors.primary}
                        containerStyle={styles.webCheckboxContainer}
                      />
                      <Text style={styles.webCheckboxLabel}>
                        Set Delivery Address as Billing Address
                      </Text>
                    </View>
                  )}

                  {/* Show selected billing address or address selector */}
                  {!(selectedMode === DELIVERY_MODE_HOME && useSameAddress) && (
                    <View>
                      {/* Currently Selected Billing Address */}
                      {selectedBillingAddress && (
                        <View style={styles.webAddressBox}>
                          <Text style={styles.webAddressText}>
                            {`${selectedBillingAddress.name || "Unknown"}, ${
                              selectedBillingAddress.line1 || ""
                            }${
                              selectedBillingAddress.line2
                                ? `, ${selectedBillingAddress.line2}`
                                : ""
                            }, ${
                              selectedBillingAddress.city || "Unknown City"
                            }, ${selectedBillingAddress.state || ""} ${
                              selectedBillingAddress.postalCode || ""
                            }`}
                          </Text>
                        </View>
                      )}

                      {/* Accordion Toggle */}
                      <TouchableOpacity
                        style={styles.webAccordionToggle}
                        onPress={toggleAccordion}
                      >
                        <Text style={styles.webChangeSlotLink}>
                          {accordionOpen ? "Hide" : "Change"} billing address
                        </Text>
                        <Animated.View
                          style={{ transform: [{ rotate: spin }] }}
                        >
                          <Ionicons
                            name="chevron-down-circle"
                            size={20}
                            color={colors.primary}
                          />
                        </Animated.View>
                      </TouchableOpacity>

                      {/* Accordion Content - Address List */}
                      {accordionOpen && (
                        <View style={styles.webAccordionContent}>
                          {addressData.length > 0 ? (
                            <View>
                              {addressData.map((item) => (
                                <AddressItem
                                  key={
                                    item._id?.toString() ||
                                    `address-${Math.random()}`
                                  }
                                  item={item}
                                  onEdit={handleEdit}
                                  onDelete={handleBillingAddressDelete}
                                  showRadio
                                  isSelected={item._id === selectedId}
                                  onSelect={() =>
                                    handleSelectBillingAddress(item)
                                  }
                                />
                              ))}
                            </View>
                          ) : (
                            <View style={styles.webNoAddressContainer}>
                              <Text style={styles.webNoAddressText}>
                                No billing addresses found
                              </Text>
                            </View>
                          )}
                          <Button
                            onPress={handleAddBillingAddress}
                            title="Add Billing Address"
                            style={{ marginTop: 16 }}
                          />
                        </View>
                      )}
                    </View>
                  )}

                  {/* Show message if using same address */}
                  {selectedMode === DELIVERY_MODE_HOME && useSameAddress && (
                    <View style={styles.webAddressBox}>
                      <Text style={styles.webAddressText}>
                        Same as delivery address
                      </Text>
                    </View>
                  )}
                </View>
                {/* Substitutions Section */}
                {/* <View style={styles.webSectionCard}>
                  <Text style={styles.webSectionTitle}>Substitutions</Text>
                  <View style={styles.webCheckboxRow}>
                    <CheckBox
                      checked={substitutionSelected}
                      onPress={() =>
                        setSubstitutionSelected(!substitutionSelected)
                      }
                      checkedColor={colors.primary}
                      uncheckedColor={colors.primary}
                      containerStyle={styles.webCheckboxContainer}
                    />
                    <Text style={styles.webCheckboxLabel}>
                      Choose Substitutions for my orders.
                    </Text>
                  </View>
                  <Text style={styles.webSubText}>
                    If the product you picked is not available a similar product
                    or brand will be picked.
                  </Text>
                </View> */}

                {/* Order Details Section */}
                {/* <View style={styles.webSectionCard}>
                  <Text style={styles.webSectionTitle}>Order Details</Text> */}

                {/* Table Header */}
                {/* <View style={styles.webTableHeader}>
                    <Text style={[styles.webTableCell, { flex: 2 }]}>
                      Item Name
                    </Text>
                    <Text
                      style={[
                        styles.webTableCell,
                        { flex: 1, textAlign: "center" },
                      ]}
                    >
                      Total Items
                    </Text>
                    <Text
                      style={[
                        styles.webTableCell,
                        { flex: 1, textAlign: "right" },
                      ]}
                    >
                      Price
                    </Text>
                  </View> */}

                {/* Table Rows */}
                {/* {cartItems.map((item: any) => (
                    <View key={item.id} style={styles.webTableRow}>
                      <Text style={[styles.webTableCell, { flex: 2 }]}>
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          styles.webTableCell,
                          { flex: 1, textAlign: "center" },
                        ]}
                      >
                        {String(item.quantity).padStart(2, "0")}
                      </Text>
                      <Text
                        style={[
                          styles.webTableCell,
                          { flex: 1, textAlign: "right" },
                        ]}
                      >
                        {item.discount}$
                      </Text>
                    </View>
                  ))} */}

                {/* Summary Rows */}
                {/* <View style={styles.webSummaryRow}>
                    <Text style={styles.webSummaryLabel}>Total Price</Text>
                    <Text style={styles.webSummaryValue}>
                      {cartItems.reduce(
                        (sum: number, item: any) =>
                          sum + item.discount * item.quantity,
                        0
                      )}
                      $
                    </Text>
                  </View>
                  <View style={styles.webSummaryRow}>
                    <Text style={styles.webSummaryLabel}>Discount</Text>
                    <Text style={styles.webSummaryValue}>
                      -
                      {cartItems.reduce(
                        (sum: number, item: any) =>
                          sum + (item.netPrice - item.discount) * item.quantity,
                        0
                      )}
                      $
                    </Text>
                  </View>
                  <View style={styles.webSummaryRow}>
                    <Text
                      style={[
                        styles.webSummaryLabel,
                        { color: colors.primary },
                      ]}
                    >
                      Shipping
                    </Text>
                    <Text style={styles.webSummaryValue}>3$</Text>
                  </View>
                  <View style={[styles.webSummaryRow, styles.webSubtotalRow]}>
                    <Text style={styles.webSubtotalLabel}>SubTotal</Text>
                    <Text style={styles.webSubtotalValue}>
                      {cartItems.reduce(
                        (sum: number, item: any) =>
                          sum + item.discount * item.quantity,
                        0
                      ) + 3}
                      $
                    </Text>
                  </View> */}
                {/* </View>  */}

                {/* Order Summary */}
                <OrderSummary
                  cartItems={cartItems}
                  containerStyle={styles.compactOrderSummary}
                  sectionHeadingStyle={styles.compactOrderSummaryHeading}
                />
                {/* Place Order Button */}
                {isTabOrDesktop && <StripeCardInput />}

                <Button
                  title="Proceed for Payment"
                  disabled={!isPaymentEnabled}
                  onPress={() => {
                    try {
                      handlePayment(cartItems, {
                        shippingAddress: shippingAddress,
                        billingAddress: selectedBillingAddress,
                        pickupdetails: pickupDetails,
                        deliveryDate: pickupDetails?.date,
                        deliveryTime: pickupDetails?.time,
                        selectedSlot: Array.isArray(selectedMode)
                          ? selectedMode[0]
                          : selectedMode,
                        selectedMode: Array.isArray(selectedMode)
                          ? selectedMode[0]
                          : selectedMode,
                      });
                    } catch (error) {
                      console.error("Payment handler error:", error);
                      Alert.alert(
                        "Error",
                        "Failed to process payment. Please try again."
                      );
                    }
                  }}
                  style={
                    isTabOrDesktop
                      ? [
                          styles.webPlaceOrderButton,
                          !isPaymentEnabled && {
                            backgroundColor: colors.lightgrey,
                          },
                        ]
                      : isPaymentEnabled
                      ? styles.activeBtn
                      : styles.disabledBtn
                  }
                  textStyle={styles.buttonText}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        // MOBILE LAYOUT
        <View style={globalStyles.container}>
          <ScrollView>
            <View style={[globalStyles.pt_0, globalStyles.pb_0]}>
              <View style={styles.section}>
                {selectedMode === DELIVERY_MODE_STORE ||
                selectedMode === DELIVERY_MODE_CURBSIDE ? (
                  <Text style={styles.sectionHeading}>User Details</Text>
                ) : (
                  <Text style={styles.sectionHeading}>Address:</Text>
                )}

                <View style={[globalStyles.pl_3, styles.deliverAddress]}>
                  {selectedMode === DELIVERY_MODE_STORE ? (
                    <Ionicons
                      name="storefront"
                      size={24}
                      color={colors.primary}
                      style={{ marginRight: 10 }}
                    />
                  ) : selectedMode === DELIVERY_MODE_CURBSIDE ? (
                    <Ionicons
                      name="car"
                      size={24}
                      color={colors.primary}
                      style={{ marginRight: 10 }}
                    />
                  ) : (
                    <Ionicons
                      name="home"
                      size={24}
                      color={colors.primary}
                      style={{ marginRight: 10 }}
                    />
                  )}

                  <View style={styles.addressContainer}>
                    {selectedMode === DELIVERY_MODE_STORE ||
                    selectedMode === DELIVERY_MODE_CURBSIDE ? (
                      <Text style={styles.subheading}>Pickup Details:</Text>
                    ) : (
                      <Text style={styles.subheading}>Delivery Address:</Text>
                    )}
                    <Text style={styles.addressTextBox}>
                      {renderAddressText()}
                    </Text>
                  </View>
                </View>

                {selectedMode === DELIVERY_MODE_HOME && (
                  <View style={styles.checkBox}>
                    <CheckBox
                      title="Set Delivery Address as Billing Address?"
                      checked={useSameAddress}
                      onPress={handleSameAddressToggle}
                      checkedColor={colors.primary}
                      uncheckedColor={colors.primary}
                      containerStyle={styles.checkBoxContainer}
                    />
                  </View>
                )}

                {!(selectedMode === DELIVERY_MODE_HOME && useSameAddress) && (
                  <View>
                    <View style={styles.billingAddress}>
                      <Ionicons
                        name="receipt"
                        size={24}
                        color={colors.primary}
                        style={{ marginRight: 10 }}
                      />
                      <View style={styles.billingAddressAccordian}>
                        <Text style={styles.subheading}>Billing Address: </Text>
                        {selectedBillingAddress && (
                          <Text>
                            {`${selectedBillingAddress.name || "Unknown"}, ${
                              selectedBillingAddress.postalCode || "Unknown"
                            }, ${
                              selectedBillingAddress.city || "Unknown City"
                            }`}
                          </Text>
                        )}
                        <TouchableOpacity
                          style={styles.accordian}
                          onPress={toggleAccordion}
                        >
                          <Animated.View
                            style={{ transform: [{ rotate: spin }] }}
                          >
                            <Ionicons
                              name="chevron-down-circle"
                              size={24}
                              color={colors.primary}
                              style={styles.accordianIcon}
                            />
                          </Animated.View>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {accordionOpen && (
                      <View style={styles.accordionContent}>
                        {addressData.length > 0 ? (
                          <FlatList
                            data={addressData}
                            renderItem={({ item }) => (
                              <AddressItem
                                item={item}
                                onEdit={handleEdit}
                                onDelete={handleBillingAddressDelete}
                                showRadio
                                isSelected={item._id === selectedId}
                                onSelect={() =>
                                  handleSelectBillingAddress(item)
                                }
                              />
                            )}
                            keyExtractor={(item, index) =>
                              item?._id?.toString() || `address-${index}`
                            }
                            contentContainerStyle={styles.addressList}
                            showsVerticalScrollIndicator={false}
                          />
                        ) : (
                          <View style={styles.noAddressContainer}>
                            <Text style={styles.noAddressText}>
                              No billing addresses found
                            </Text>
                          </View>
                        )}
                        <Button
                          onPress={handleAddBillingAddress}
                          title="Add Billing Address"
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>Your Slot</Text>
                <View style={globalStyles.pl_3}>
                  <Text>
                    {selectedMode === DELIVERY_MODE_HOME
                      ? `${displayMode} scheduled for ${
                          pickupDetails?.date || "TBD"
                        } at ${pickupDetails?.time || "TBD"}`
                      : `${displayMode} scheduled for ${
                          pickupAddress?.date || "TBD"
                        } at ${pickupAddress?.time || "TBD"}`}
                  </Text>
                </View>
              </View>

              <View style={[styles.section, globalStyles.mb_0]}>
                <Text style={styles.sectionHeading}>Order Details</Text>
                <View style={[globalStyles.pl_3]}>
                  {cartItems.map((eachCartItem: any) => {
                    return (
                      <CartItem
                        handleDelete={handleDelete}
                        key={eachCartItem.id}
                        cartItem={eachCartItem}
                        stockAvailable={stockAvailable[eachCartItem._id] || 0}
                      />
                    );
                  })}
                </View>
                <OrderSummary
                  cartItems={cartItems}
                  sectionHeadingStyle={styles.sectionHeading}
                  hideHeading={true}
                  containerStyle={styles.orderSummaryContainer}
                />
              </View>
            </View>
            <Text style={styles.noteText}>
              *please select a billing address before proceeding to payment
            </Text>
            <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
              <Button
                title="Proceed for Payment"
                disabled={!isPaymentEnabled}
                onPress={() => {
                  try {
                    handlePayment(cartItems, {
                      shippingAddress: shippingAddress,
                      billingAddress: selectedBillingAddress,
                      pickupdetails: pickupDetails,
                      deliveryDate: pickupDetails?.date,
                      deliveryTime: pickupDetails?.time,
                      selectedSlot: Array.isArray(selectedMode)
                        ? selectedMode[0]
                        : selectedMode,
                      selectedMode: Array.isArray(selectedMode)
                        ? selectedMode[0]
                        : selectedMode,
                    });
                  } catch (error) {
                    console.error("Payment handler error:", error);
                    Alert.alert(
                      "Error",
                      "Failed to process payment. Please try again."
                    );
                  }
                }}
                style={isPaymentEnabled ? styles.activeBtn : styles.disabledBtn}
                textStyle={styles.buttonText}
              />
            </View>
          </ScrollView>
        </View>
      )}
      <ConfirmationModal
        onClose={() => setIsModalVisible(false)}
        isModalVisible={isModalVisible}
        title="Delete Product"
        text="Are you sure you want to delete this? You can save this item for later too."
        submitText="Delete Item"
        handleSubmit={confirmDelete}
        cancelText="Save for Later"
        handleCancel={cancelDelete}
      />
    </LayoutComponent>
  );
};

export default orderSummeryScreen;
