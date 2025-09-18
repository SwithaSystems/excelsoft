import { Alert, Platform } from "react-native";
import axios from "axios";
import { orderService, PickupMode } from "@/services/orderService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { CURRENCY_CODE } from "@/constants/CurrencySymbol";
import { NotificationService } from "@/services/notificationService";
import { formatDateForBackend } from "../../utilities/dateTimeFormat";
import { CLIENT_ID, DELIVERY_MODE_HOME } from "../../constants/stringLiterals";
import { STORE_NAME } from "../../constants/stringLiterals";
import { useEffect, useState } from "react";

// Platform-specific import - Metro will resolve this automatically
import {
  initStripe,
  useStripe,
  isStripeSupported,
} from "../../services/stripeService";

// Define proper types for Stripe hooks
interface StripeHooks {
  initPaymentSheet: ((params: any) => Promise<{ error: any }>) | null;
  presentPaymentSheet: (() => Promise<{ error: any }>) | null;
}

type Product = {
  productId: string;
  name: string;
  quantity: number;
  discount: number;
  netPrice: number;
  isVatApplicable: boolean;
  vatRate: number;
  vatAmount: number;
};

export const usePaymentHandler = () => {
  const [isStripeInitialized, setIsStripeInitialized] = useState(
    !isStripeSupported
  );
  const [stripePublishableKey, setStripePublishableKey] = useState<
    string | null
  >(null);

  // Type-safe Stripe hooks with proper typing
  const stripeHooks: any = isStripeSupported
    ? useStripe()
    : {
        initPaymentSheet: null,
        presentPaymentSheet: null,
      };

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const clientId = "client_abc";

  const cartItems = useSelector((state: any) => state.cart.items);
  const dispatch = useDispatch();

  // Initialize Stripe when hook is first used (only if supported)
  useEffect(() => {
    if (!isStripeSupported) {
      setIsStripeInitialized(true);
      return;
    }

    const initializeStripe = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/stripe-config/${clientId}`
        );
        const publishableKey = res.data.stripePublishableKey;
        setStripePublishableKey(publishableKey);

        await initStripe({
          publishableKey: publishableKey,
          merchantIdentifier: "merchant.com.yourapp",
        });

        setIsStripeInitialized(true);
        console.log("Stripe initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Stripe", error);
        Alert.alert("Error", "Failed to initialize payment system");
      }
    };

    if (!isStripeInitialized && !stripePublishableKey) {
      initializeStripe();
    }
  }, []);

  // Product mapping logic...
  const products = cartItems.map((item: any) => {
    const netPrice = item.netPrice || 0;
    const discount = item.discount || 0;
    const quantity = item.quantity || 1;
    const vatRate = item.vatRate || 0;

    const discountedPrice = netPrice - discount;
    const vatAmount = item.isVatApplicable
      ? (discountedPrice * quantity * vatRate) / 100
      : 0;
    const netPriceIncVat = discountedPrice * quantity + vatAmount;
    const grossPrice = netPriceIncVat;

    return {
      productId: parseInt(item.id),
      name: item.name,
      quantity: quantity,
      netPrice: netPrice,
      discount: discount,
      isvatApplicable: item.isVatApplicable,
      vatRate: vatRate,
      vatAmount: vatAmount,
      netPriceIncVat: netPriceIncVat,
      grossPrice: grossPrice,
    };
  });

  const calculateSubtotal = (cartItems: Product[]) =>
    cartItems.reduce((total, item) => {
      const netPrice = item.netPrice || 0;
      const discount = item.discount || 0;
      const quantity = item.quantity || 1;
      const vatRate = item.vatRate || 0;

      const discountedPrice = netPrice - discount;
      const vatAmount = item.isVatApplicable
        ? (discountedPrice * quantity * vatRate) / 100
        : 0;

      return total + discountedPrice * quantity + vatAmount;
    }, 0);

  const fetchPaymentIntent = async (amount: number, clientId: string) => {
    try {
      console.log("Creating payment intent for amount:", amount);
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          amount: amount,
          currency: CURRENCY_CODE,
          clientId: clientId,
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

  const handleWebPayment = async (cartItems: Product[], params: any) => {
    Alert.alert(
      "Web Payment",
      "Web payments are not yet implemented. Would you like to continue with a demo order?",
      [
        {
          text: "Continue Demo",
          onPress: async () => {
            await createOrderWithoutPayment(params);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const createOrderWithoutPayment = async (params: any) => {
    const subtotal = calculateSubtotal(cartItems);
    const shippingCharges = params.shippingCharges || 0;
    const discounts = params.discounts || [];

    const orderDetails: any = {
      products: products,
      shippingCharges: shippingCharges,
      discounts: discounts,
      totalAmount: subtotal,
      paymentMethod: Platform.OS === "web" ? "demo_payment" : "credit_card",
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

    if (
      params.selectedMode !== DELIVERY_MODE_HOME &&
      params.pickupdetails?.date
    ) {
      const formattedDate = formatDateForBackend(params.pickupdetails.date);
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
    }

    try {
      const response = await orderService.createOrder(orderDetails);
      dispatch(clearCart());
      redirectToPage(containers.orderSuccessfulScreen, {
        orderData: JSON.stringify(response),
      });

      if (Platform.OS === "web") {
        Alert.alert("Success", "Demo order created successfully!");
      } else {
        await NotificationService.scheduleLocalNotification(
          "your Order is Placed",
          `Your order Number is #ORD-${response?.orderNumber}`,
          { orderNumber: response?.orderNumber, type: "delivery_scheduled" }
        );
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      Alert.alert("Error", "Failed to create order. Please try again.");
    }
  };

  // Type-safe native payment handler
  const handleNativePayment = async (cartItems: Product[], params: any) => {
    // Type guards to ensure functions exist
    if (!stripeHooks.initPaymentSheet || !stripeHooks.presentPaymentSheet) {
      Alert.alert("Error", "Payment system is not available on this platform.");
      return;
    }

    if (!isStripeInitialized) {
      Alert.alert("Error", "Payment system is not ready. Please try again.");
      return;
    }

    console.log("Processing native payment...");

    const subtotal = calculateSubtotal(cartItems);
    const paymentData = await fetchPaymentIntent(subtotal, CLIENT_ID);
    if (!paymentData) return;

    const { clientSecret, ephemeralKey, customer } = paymentData;

    const { error: initError } = await stripeHooks.initPaymentSheet({
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
      console.error("Payment sheet init error:", initError);
      Alert.alert("Setup Error", initError.message);
      return;
    }

    const { error: paymentError } = await stripeHooks.presentPaymentSheet();

    if (paymentError) {
      Alert.alert("Payment Failed", paymentError.message);
    } else {
      Alert.alert("Success", "Payment completed successfully!");
      await createOrderWithoutPayment(params);
    }
  };

  const handlePayment = async (cartItems: Product[], params: any) => {
    if (!isStripeSupported) {
      return handleWebPayment(cartItems, params);
    }

    return handleNativePayment(cartItems, params);
  };

  return {
    handlePayment,
    isStripeInitialized,
    stripePublishableKey,
    isStripeSupported,
  };
};
