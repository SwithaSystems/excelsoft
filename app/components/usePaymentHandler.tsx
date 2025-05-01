import { Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { orderService, PickupMode } from "@/services/orderService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useSelector } from "react-redux";

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

  const calculateSubtotal = (cartItems: Product[]) =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const fetchPaymentIntent = async (amount: number) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          amount: Math.round(amount * 100),
          currency: "usd",
        }
      );

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

  const handlePayment = async (
    cartItems: Product[],
    params: {
      billingAddress?: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      shippingAddress?: {
        name: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      pickupdetails?: {
        time: string;
        date: string;
        vehicleType?: string;
        vehicleNumber?: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        additionalDetails?: string;
      };
      deliveryDate?: string;
      deliveryTime?: string;
      selectedSlot?: string;
      selectedMode?: string;
    }
  ) => {
    const subtotal = calculateSubtotal(cartItems);
    const paymentData = await fetchPaymentIntent(subtotal);
    if (!paymentData) return;

    const { clientSecret, ephemeralKey, customer } = paymentData;

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: "Store Name",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
    });

    if (initError) {
      Alert.alert("Error", initError.message);
      return;
    }

    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      Alert.alert("Payment Failed", paymentError.message);
    } else {
      Alert.alert("Success", "Payment completed successfully!");

      const response = await orderService.createOrder({
        products: products,
        shippingCharges: 10,
        discounts: [10],
        tax: 2.99,
        totalAmount: subtotal + 10 + 2.99 - 10,
        paymentMethod: "credit_card",
        pickupMode: (params.selectedMode || "Delivery") as PickupMode,
        deliveryDate: params.deliveryDate ?? "N/A",
        deliveryTime: params.deliveryTime,
        billingAddress: {
          name: params.billingAddress?.name ?? "N/A",
          line1: params.billingAddress?.line1 ?? "N/A",
          line2: params.billingAddress?.line2 ?? "",
          city: params.billingAddress?.city ?? "N/A",
          state: params.billingAddress?.state ?? "N/A",
          postalCode: params.billingAddress?.postalCode ?? "N/A",
          country: params.billingAddress?.country ?? "N/A",
        },
        shippingAddress: {
          name: params.shippingAddress?.name ?? "N/A",
          line1: params.shippingAddress?.line1 ?? "N/A",
          line2: params.shippingAddress?.line2 ?? "",
          city: params.shippingAddress?.city ?? "N/A",
          state: params.shippingAddress?.state ?? "N/A",
          postalCode: params.shippingAddress?.postalCode ?? "N/A",
          country: params.shippingAddress?.country ?? "N/A",
        },
        // timeslot: params.selectedSlot
        //   ? new Date(params.selectedSlot)
        //   : undefined,
        pickupDetails: {
          date: params.pickupdetails?.date ?? "N/A",
          time: params.pickupdetails?.time ?? "N/A",
          firstName: params.pickupdetails?.firstName ?? "N/A",
          lastName: params.pickupdetails?.lastName ?? "N/A",
          phone: params.pickupdetails?.phone ?? "N/A",
          email: params.pickupdetails?.email ?? "N/A",
          vehicleType: params.pickupdetails?.vehicleType,
          vehicleNumber: params.pickupdetails?.vehicleNumber,
          additionalDetails: params.pickupdetails?.additionalDetails,
        },
      });
      console.log("after order placed", response);
      redirectToPage(containers.orderSuccessfulScreenScreen, {
        orderData: JSON.stringify(response),
      });
    }
  };

  return { handlePayment };
};
