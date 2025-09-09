import {
  DELIVERY_MODE_CURBSIDE,
  DELIVERY_MODE_HOME,
  DELIVERY_MODE_STORE,
  ORDER_SUMMARY_SCREEN_TITLE,
} from "../../../constants/stringLiterals";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Animated,
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
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
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
import { usePaymentHandler } from "../../components/usePaymentHandler";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { add, set } from "date-fns";

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
  const [addressData, setAddressData] = useState<Address[]>([]);
  const params = useLocalSearchParams<any>();
  const [aselectedBillingAddress, asetSelectedBillingAddress] = useState<any>();
  const [substitutionSelected, setSubstitutionSelected] = useState(false);
  const cartItems = useSelector((state: any) => [...state.cart.items]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState<any>(null);

  // UPDATED: Only default to true for home delivery
  const [useSameAddress, setUseSameAddress] = useState(
    params?.selectedMode === DELIVERY_MODE_HOME
  );
  const [accordionOpen, setAccordionOpen] = useState(false);
  const rotateAnimation = new Animated.Value(0);
  const { handlePayment } = usePaymentHandler();

  // Extract pickup data from route params or use default values
  const pickupAddress = params?.pickupAddress
    ? JSON.parse(params.pickupAddress as string)
    : null;
  const pickupDetails = JSON.parse(params?.pickupDetails) || "";
  console.log("pickup details", pickupDetails);
  const selectedMode = params?.selectedMode || "Delivery";

  const { selectedBillingAddress, setSelectedBillingAddress } = useAppContext();

  // Create shipping address object properly
  const shippingAddress: shippingAddressDTo | undefined = pickupAddress
    ? {
        name:
          pickupAddress.name ||
          `${pickupAddress.firstName} ${pickupAddress.lastName}`,
        line1: pickupAddress.line1 || pickupAddress.address,
        line2: pickupAddress.line2,
        city: pickupAddress.city,
        state: pickupAddress.state,
        postalCode: pickupAddress.postalCode,
        phone: pickupAddress.phone,
        addressType: pickupAddress.addressType,
      }
    : undefined;

  let displayMode = "";
  if (selectedMode === DELIVERY_MODE_CURBSIDE) {
    displayMode = "Curbside Pickup";
  } else if (selectedMode === DELIVERY_MODE_STORE) {
    displayMode = "Store Pickup";
  } else if (selectedMode === DELIVERY_MODE_HOME) {
    displayMode = "Home Delivery";
  } else {
    displayMode = selectedMode;
  }

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
    Animated.timing(rotateAnimation, {
      toValue: accordionOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addresses = await addressService.getAllAddress();
        setAddressData(addresses);

        if (selectedBillingAddress && selectedBillingAddress._id) {
          setSelectedId(selectedBillingAddress._id);
        }
      } catch (error) {
        console.error("Failed to fetch billing addresses:", error);
      }
    };

    fetchAddresses();
  }, [selectedBillingAddress]);

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

      setSelectedBillingAddress(billingFromShipping);
      setSelectedId(billingFromShipping._id);
    }
  }, [shippingAddress, useSameAddress, selectedMode]);

  const handleSameAddressToggle = () => {
    const newValue = !useSameAddress;
    setUseSameAddress(newValue);

    if (newValue && shippingAddress) {
      const billingFromShipping: any = {
        name: shippingAddress.name,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        addressType: shippingAddress.addressType,
        phone: shippingAddress.phone,
      };

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
    } else {
      setSelectedBillingAddress(null);
      setSelectedId(null);
    }
  };

  const handleEdit = (item: Address) => {
    setSelectedBillingAddress(item);
    redirectToPage(containers.billingAddressScreen, {
      edit_address: JSON.stringify(item),
    });
  };

  const handleAddBillingAddress = async () => {
    redirectToPage(containers.billingAddressScreen, {
      onAddressAdded: async () => {
        try {
          const addresses = await addressService.getAllAddress();
          setAddressData(addresses);
        } catch (error) {
          console.error("Failed to refresh addresses:", error);
        }
      },
    });
  };

  const handleBillingAddressDelete = async (item: Address) => {
    try {
      const { success } = await addressService.deleteAddress(item._id);
      if (success) {
        const addresses = await addressService.getAllAddress();
        setAddressData(addresses);

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
  };

  // Handle billing address selection
  const handleSelectBillingAddress = (item: Address) => {
    if (selectedMode === DELIVERY_MODE_HOME) {
      setUseSameAddress(false);
    }

    setSelectedId(item._id);
    setSelectedBillingAddress(item);
    console.log("Selected billing address:", item);
  };

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    if (itemToDelete) {
      const itemtoSave = cartItems.find((item) => item.id === itemToDelete.id);
      if (itemtoSave) {
        dispatch(addToSavedItems(itemtoSave));
        dispatch(removeFromCart(itemToDelete.id));
      }
    }
    setIsModalVisible(false);
    setItemToDelete(null);
  };

  const isPickupMode =
    selectedMode === DELIVERY_MODE_CURBSIDE ||
    selectedMode === DELIVERY_MODE_STORE;
  const isPaymentEnabled =
    cartItems.length > 0 &&
    selectedBillingAddress &&
    (isPickupMode || shippingAddress?.line1) &&
    pickupDetails?.date &&
    pickupDetails?.time &&
    selectedMode &&
    (Array.isArray(selectedMode) ? selectedMode[0] : selectedMode);

  return (
    <PageLayout
      hasHeader
      headerComponent={<Header headerText={ORDER_SUMMARY_SCREEN_TITLE} />}
      hasFooter={false}
      scrollable={false}
    >
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
                  {selectedMode === DELIVERY_MODE_STORE ? (
                    <Text style={styles.addressTextBox}>
                      {`${pickupAddress.firstName || ""} ${
                        pickupAddress.lastName || ""
                      }
Email: ${pickupAddress.email}
Contact Number: ${pickupAddress.phone}`}
                    </Text>
                  ) : selectedMode === DELIVERY_MODE_CURBSIDE ? (
                    <Text style={styles.addressTextBox}>
                      {`${pickupAddress.firstName || ""} ${
                        pickupAddress.lastName || ""
                      }
Vehicle Type: ${pickupAddress.vehicleType || ""}
Vehicle Number: ${pickupAddress.vehicleNumber || ""}
Additional Details: ${pickupAddress.additionalDetails || "None"}
Email: ${pickupAddress.email}
Contact Number: ${pickupAddress.phone}`}
                    </Text>
                  ) : (
                    <Text style={styles.addressTextBox}>
                      {`${pickupAddress.name}, ${pickupAddress.line1}${
                        pickupAddress.line2 ? `, ${pickupAddress.line2}` : ""
                      }, ${pickupAddress.city}, ${pickupAddress.postalCode}
Contact Number: ${pickupAddress.phone}`}
                    </Text>
                  )}
                </View>
              </View>

              {/* UPDATED: Show checkbox only for home delivery */}
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
              {/* UPDATED: Show billing address section for all modes, but hide when home delivery checkbox is checked */}
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
                          {`${selectedBillingAddress.name}, ${selectedBillingAddress.city}`}
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
                              onSelect={() => handleSelectBillingAddress(item)}
                            />
                          )}
                          keyExtractor={(item, index) =>
                            item._id?.toString() || `address-${index}`
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
                    ? `${displayMode} scheduled for ${pickupDetails?.date} at ${pickupDetails?.time}`
                    : `${displayMode} scheduled for ${pickupAddress?.date} at ${pickupAddress?.time}`}
                </Text>
              </View>
            </View>
            {/* <View style={styles.section}>
              <Text style={styles.sectionHeading}>Substitutions</Text>
              <View style={globalStyles.pl_3}>
                <CheckBox
                  title="Choose Substitutions for my orders."
                  checked={substitutionSelected}
                  onPress={() =>
                    setSubstitutionSelected(
                      (substitutionSelected) => !substitutionSelected
                    )
                  }
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                />
                <Text style={styles.sectionText}>
                  If the product you picked is not available a similar product
                  or brand will be picked.
                </Text>
              </View>
            </View> */}
            <View style={[styles.section, globalStyles.mb_0]}>
              <Text style={styles.sectionHeading}>Order Details</Text>
              <View style={[globalStyles.pl_3, { marginBottom: 16 }]}>
                {cartItems.map((eachCartItem) => {
                  return (
                    <CartItem
                      itemContainerStyle={styles.cartItemContainerStyle}
                      handleDelete={handleDelete}
                      key={eachCartItem.id}
                      cartItem={eachCartItem}
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

          <View
            style={{
              paddingHorizontal: 24,
            }}
          >
            <Button
              title="Proceed for Payment"
              disabled={!isPaymentEnabled}
              onPress={() =>
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
                })
              }
              style={isPaymentEnabled ? styles.activeBtn : styles.disabledBtn}
              textStyle={styles.buttonText}
            />
          </View>
        </ScrollView>

        <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this? You can save this item for later too."
          submitText="Delete Item"
          handleSubmit={confirmDelete}
          cancelText="Save for Later"
          handleCancel={cancelDelete}
        />
      </View>
      {/*</SafeAreaView> */}
    </PageLayout>
  );
};

export default orderSummeryScreen;
