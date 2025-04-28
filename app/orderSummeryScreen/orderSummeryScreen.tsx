import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import styles from "./orderSummeryScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import { CheckBox } from "react-native-elements";
import CartItem from "../cartScreen/components/CartItem";
import OrderSummary from "@/components/OrderSummary";
import Button from "@/components/commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import ConfirmationModal from "@/components/commonComponents/ConfirmationModal";
import { removeFromCart } from "@/store/slices/cartSlice";
import { addToSavedItems } from "@/store/slices/savedItemsSlice";
import { orderService, PickupMode } from "@/services/orderService";

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

const orderSummeryScreen = () => {
  const params = useLocalSearchParams<OrderSummeryScreenParams>();
  const [substitutionSelected, setSubstitutionSelected] = useState(false);
  const cartItems = useSelector((state: any) => [...state.cart.items]);
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string } | null>(null);
  const dispatch = useDispatch();

  // Extract pickup data from route params or use default values
  const pickupAddress = params.pickupAddress || "";
  const selectedDate = params.selectedDate || "";
  const selectedSlot = params.selectedSlot || "";
  const selectedMode = params.selectedMode || "Delivery";
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  // const calculateSubtotal = () => {
  //   return cartItems.reduce(
  //     (total, item) => total + item.price * item.quantity,
  //     0
  //   );
  // };

  // const fetchPaymentIntent = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       //`http://192.168.1.9:3002/payments/create-payment-intent`,
  //       `${API_BASE_URL}/payments/create-payment-intent`,
  //       {
  //         amount: Math.round(calculateSubtotal() * 100),
  //         currency: "usd",
  //       }
  //     );

  //     return {
  //       clientSecret: response.data.paymentIntent.client_secret,
  //       ephemeralKey: response.data.ephemeralKey,
  //       customer: response.data.customer,
  //     };
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to get payment intent.");
  //     console.error(error);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const products = cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));
  // const handlePayment = async () => {
  //   const paymentData = await fetchPaymentIntent();
  //   if (!paymentData) return;

  //   const { clientSecret, ephemeralKey, customer } = paymentData;

  //   const { error: initError } = await initPaymentSheet({
  //     merchantDisplayName: "Store Name",
  //     customerId: customer,
  //     customerEphemeralKeySecret: ephemeralKey,
  //     paymentIntentClientSecret: clientSecret,
  //     allowsDelayedPaymentMethods: true,
  //   });

  //   if (initError) {
  //     Alert.alert("Error", initError.message);
  //     return;
  //   }

  //   const { error: paymentError } = await presentPaymentSheet();

  //   if (paymentError) {
  //     Alert.alert("Payment Failed", paymentError.message);
  //   } else {
  //     Alert.alert("Success", "Payment completed successfully!");

  //     const response = await orderService.createOrder({
  //       products: products,
  //       shippingCharges: 10,
  //       discounts: [10],
  //       tax: 2.99,
  //       totalAmount:
  //         Math.round(calculateSubtotal() * 100) / 100 + 10 + 2.99 - 10,
  //       paymentMethod: "credit_card",
  //       pickupModeId: (params.selectedMode
  //         ? params.selectedMode
  //         : "Delivery") as PickupMode,
  //       timeslot: params.selectedSlot?.toString()
  //         ? new Date(params.selectedSlot)
  //         : undefined,
  //       // shippingAddress: {
  //       //   line1: "123 Street",
  //       //   city: "Cityville",
  //       //   state: "Stateburg",
  //       //   postalCode: "123456",
  //       //   country: "Countryland",
  //       // },
  //       shippingAddress: {
  //         line1: params.address ? String(params.address) : "N/A",
  //         city: "Cityville",
  //         state: "Stateburg",
  //         postalCode: "123456",
  //         country: "Countryland",
  //       },
  //     });
  //     console.log("after order placed", response);
  //     redirectToPage(containers.orderSuccessfulScreenScreen, {
  //       orderData: JSON.stringify(response),
  //     });
  //   }
  // };
  const handlePress = async () => {
    redirectToPage(containers.selectBillingAddressScreenScreen, {
      selectedMode: selectedMode,
      selectedSlot: selectedSlot,
      selectedDate: selectedDate,
      shippingAddress: pickupAddress,
    });
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
  console.log("cartItems", cartItems);

  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <Header headerText="Order Summary" />
        <View
          style={[
            globalStyles.sectionContent,
            globalStyles.pt_0,
            globalStyles.pb_0,
            { paddingHorizontal: 26 },
          ]}
        >
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Address</Text>
            <View style={globalStyles.pl_3}>
              <Text style={styles.addressTextBox}>{pickupAddress}</Text>
            </View>
          </View>
          76
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Your Slot</Text>
            <View style={globalStyles.pl_3}>
              <Text>
                {selectedMode} scheduled for {selectedDate} at {selectedSlot}
                <TouchableOpacity
                  onPress={() => {
                    redirectToPage(containers.pickUpModescreenScreen);
                  }}
                >
                  <Text style={styles.changeSlotText}>Change the slot</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
          <View style={styles.section}>
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
                If the product you picked is not available a similar product or
                brand will be picked.
              </Text>
            </View>
          </View>
          <View style={[styles.section, globalStyles.mb_0]}>
            <Text style={styles.sectionHeading}>Order Details</Text>
            <View style={globalStyles.pl_3}>
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
      </ScrollView>

      <View style={{ paddingHorizontal: 24, paddingBottom: 14 }}>
        <Button
          onPress={() => {
            handlePress();
            // redirectToPage(containers.billingAddressScreenScreen);
          }}
          title="Confirm Billing Address"
        />
      </View>
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
  );
};

export default orderSummeryScreen;
