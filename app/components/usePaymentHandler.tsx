import { Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { orderService, PickupMode } from "@/services/orderService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart } from "@/store/slices/cartSlice";
import { CURRENCY_CODE } from "@/constants/CurrencySymbol";
import { NotificationService } from "@/services/notificationService";
import { formatDateForBackend } from "../../utilities/dateTimeFormat";
import { DELIVERY_MODE_HOME } from "../../constants/stringLiterals";
import { STORE_NAME } from "../../constants/stringLiterals";

type Product = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export const usePaymentHandler = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const cartItems = useSelector((state: any) => [...state.cart.items]);
  const products = cartItems.map((item) => ({
    productId: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));
  const dispatch = useDispatch();

  const calculateSubtotal = (cartItems: Product[]) =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const fetchPaymentIntent = async (amount: number, clientId: string) => {
    try {
      console.log(" Creating payment intent for amount:", amount);
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          amount: amount,
          currency: CURRENCY_CODE,
          clientId: clientId,
        }
      );
      console.log("Payment Intent Backend response:", response.data);
      return {
        clientSecret: response.data.paymentIntent.client_secret,
        ephemeralKey: response.data.ephemeralKey,
        customer: response.data.customer,
      };
    } catch (error) {
      Alert.alert("Error", "Failed to get payment intent.");
      console.error(error);
      return null;
    }
  };

  // Add this enhanced debugging to your handlePayment function
  const handlePayment = async (cartItems: Product[], params: any) => {
    console.log("all order details", params);
    console.log("cartItems", cartItems);
    const subtotal = calculateSubtotal(cartItems);
    const paymentData = await fetchPaymentIntent(subtotal, "client_abc");
    if (!paymentData) return;

    const { clientSecret, ephemeralKey, customer } = paymentData;

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: STORE_NAME,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: params.customerName || "",
        address: {
          city: params.city || "",
          line1: params.address || "",
          postalCode: params.postalCode || "",
          state: params.state || "",
        },
      },
    });

    if (initError) {
      console.error(" Payment sheet init error:", initError);
      Alert.alert("Setup Error", initError.message);
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert("Payment Failed", paymentError.message);
    } else {
      console.log("=== PAYMENT SUCCESSFUL - STARTING ORDER CREATION ===");
      Alert.alert("Success", "Payment completed successfully!");

      const orderDetails: any = {
        products: products,
        shippingCharges: 10,
        discounts: [10],
        tax: 2.99,
        totalAmount: subtotal + 10 + 2.99 - 10,
        paymentMethod: "credit_card",
        pickupMode: (params.selectedMode || "Delivery") as PickupMode,
        deliveryDate: formatDateForBackend(params.deliveryDate) ?? "N/A",
        deliveryTime: params.deliveryTime,
        billingAddress: {
          name: params.billingAddress?.name ?? "N/A",
          line1: params.billingAddress?.line1 ?? "N/A",
          line2: params.billingAddress?.line2 ?? "",
          city: params.billingAddress?.city ?? "N/A",
          state: params.billingAddress?.state ?? "N/A",
          postalCode: params.billingAddress?.postalCode ?? "N/A",
        },
        shippingAddress: {
          name: params.shippingAddress?.name ?? "N/A",
          line1: params.shippingAddress?.line1 ?? "N/A",
          line2: params.shippingAddress?.line2 ?? "",
          city: params.shippingAddress?.city ?? "N/A",
          state: params.shippingAddress?.state ?? "N/A",
          postalCode: params.shippingAddress?.postalCode ?? "N/A",
        },
      };

      console.log("=== BEFORE PICKUP DETAILS CHECK ===");
      console.log("selectedMode:", params.selectedMode);
      console.log(
        `selectedMode !==${DELIVERY_MODE_HOME}:`,
        params.selectedMode !== DELIVERY_MODE_HOME
      );
      console.log("pickupdetails?.date:", params.pickupdetails?.date);
      console.log(
        "Condition result:",
        params.selectedMode !== DELIVERY_MODE_HOME && params.pickupdetails?.date
      );

      // Enhanced conditional check with more logging
      if (
        params.selectedMode !== DELIVERY_MODE_HOME &&
        params.pickupdetails?.date
      ) {
        console.log("=== ADDING PICKUP DETAILS ===");

        const formattedDate = formatDateForBackend(params.pickupdetails.date);
        console.log("Formatted date:", formattedDate);

        orderDetails.pickupDetails = {
          date: formattedDate ?? "N/A",
          time: params.pickupdetails?.time ?? "N/A",
          firstName: params.pickupdetails?.firstName ?? "N/A",
          lastName: params.pickupdetails?.lastName ?? "N/A",
          phone: params.pickupdetails?.phone ?? "N/A",
          email: params.pickupdetails?.email ?? "N/A",
          vehicleType: params.pickupdetails?.vehicleType,
          vehicleNumber: params.pickupdetails?.vehicleNumber,
          additionalDetails: params.pickupdetails.additionalDetails,
        };

        console.log("=== PICKUP DETAILS ADDED ===");
        console.log("pickupDetails:", orderDetails.pickupDetails);
      } else {
        console.log("=== PICKUP DETAILS NOT ADDED ===");
        console.log(
          "Reason: selectedMode is homeDelivery OR pickupdetails.date is missing"
        );
      }

      console.log("=== FINAL ORDER DETAILS ===");
      console.log("orderDetails:", JSON.stringify(orderDetails, null, 2));

      try {
        console.log("=== CALLING ORDER SERVICE ===");
        const response = await orderService.createOrder(orderDetails);
        console.log("=== ORDER SERVICE RESPONSE ===");
        console.log("Response:", JSON.stringify(response, null, 2));

        console.log("=== CLEARING CART ===");
        dispatch(clearCart());

        console.log("=== REDIRECTING TO SUCCESS PAGE ===");
        redirectToPage(containers.orderSuccessfulScreen, {
          orderData: JSON.stringify(response),
        });
        await NotificationService.scheduleLocalNotification(
          "your Order is Placed",
          `Your order Number is #ORD-${response?.orderNumber}`,
          { orderNumber: response?.orderNumber, type: "delivery_scheduled" }
        );
      } catch (error) {
        console.error("=== ORDER CREATION FAILED ===");
        console.error("Error:", error);
        // console.error("Error message:", error?.message);
        // console.error("Error response:", error?.response?.data);
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    }
  };

  return { handlePayment };
};
