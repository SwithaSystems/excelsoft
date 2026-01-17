// usePaymentHandler.ts (Mobile version with Apple Pay & Google Pay)
import { Alert } from "react-native";
import {
  useStripe,
  isPlatformPaySupported,
  PlatformPay,
} from "@stripe/stripe-react-native";
import axios from "axios";
import { orderService, PickupMode } from "@/services/orderService";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { CURRENCY_CODE } from "@/constants/CurrencySymbol";
import { NotificationService } from "@/services/notificationService";
import { formatDateForBackend } from "../../utilities/dateTimeFormat";
import {
  CLIENT_ID,
  DELIVERY_MODE_HOME,
  STORE_NAME,
} from "../../constants/stringLiterals";
import { useEffect, useState } from "react";

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
  const { initPaymentSheet, presentPaymentSheet, confirmPlatformPayPayment } =
    useStripe();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const cartItems = useSelector((state: any) => state.cart.items);
  const dispatch = useDispatch();
  const [MOV, setMOV] = useState<number>(0);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);

  /* -------------------- PLATFORM PAY SUPPORT CHECK -------------------- */
  useEffect(() => {
    (async () => {
      try {
        // Check Apple Pay support (iOS)
        const appleSupported = await isPlatformPaySupported();

        // Check Google Pay support (Android)
        const googleSupported = await isPlatformPaySupported({
          googlePay: { testEnv: true }, // Set to false in production
        });

        setIsApplePaySupported(!!appleSupported);
        setIsGooglePaySupported(!!googleSupported);

        console.log("Apple Pay supported:", appleSupported);
        console.log("Google Pay supported:", googleSupported);
      } catch (err) {
        console.error("Platform pay check failed", err);
        setIsApplePaySupported(false);
        setIsGooglePaySupported(false);
      }
    })();
  }, []);

  /* -------------------- MIN ORDER VALUE -------------------- */
  const getMinimumOrderValue = async (): Promise<number | null> => {
    try {
      const resp = await axios.get(
        `${API_BASE_URL}/ui-constants/minimumOrderValue`
      );
      const raw = resp?.data;
      const mov =
        typeof raw === "number"
          ? raw
          : typeof raw === "object" &&
            raw !== null &&
            typeof raw.minimumOrderValue === "number"
          ? raw.minimumOrderValue
          : null;

      return mov === null ? null : Number(mov);
    } catch (err) {
      console.error("Failed to fetch MOV", err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mov = await getMinimumOrderValue();
      if (!mounted) return;
      if (mov !== null) setMOV(mov);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* -------------------- PRODUCT MAPPING -------------------- */
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

  /* -------------------- PRICE CALCULATION -------------------- */
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

  /* -------------------- PAYMENT INTENT -------------------- */
  const fetchPaymentIntent = async (amount: number, clientId: string) => {
    try {
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
      console.error("Payment intent error:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
      return null;
    }
  };

  /* -------------------- ORDER CREATION -------------------- */
  const createOrder = async (params: any, subtotal: number) => {
    const shippingCharges = params.shippingCharges || 0;
    const discounts = params.discounts || [];

    const orderDetails: any = {
      products: products,
      shippingCharges: shippingCharges,
      discounts: discounts,
      totalAmount: subtotal,
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
      console.log("Order created successfully:", response);

      dispatch(clearCart());

      redirectToPage(containers.orderSuccessfulScreen, {
        orderData: JSON.stringify(response),
      });

      await NotificationService.scheduleLocalNotification(
        "Your Order is Placed",
        `Your order number is #ORD-${response?.orderNumber}`,
        { orderNumber: response?.orderNumber, type: "delivery_scheduled" }
      );
    } catch (error) {
      console.error("=== ORDER CREATION FAILED ===", error);
      Alert.alert(
        "Error",
        "Payment successful but failed to create order. Please contact support."
      );
    }
  };

  /* -------------------- APPLE PAY / GOOGLE PAY -------------------- */
  const handlePlatformPayPayment = async (items: Product[], params: any) => {
    console.log("=== STARTING PLATFORM PAY PROCESS ===");

    const subtotal = calculateSubtotal(items);
    console.log("Subtotal:", subtotal);

    // Check Minimum Order Value
    const currentMOV = await getMinimumOrderValue();
    if (currentMOV === null) {
      Alert.alert(
        "Error",
        "Unable to fetch minimum order value. Please try again."
      );
      return Promise.reject(new Error("Failed to fetch MOV"));
    }

    if (subtotal < currentMOV) {
      console.error("Order value below minimum order value");
      Alert.alert(
        "Minimum Order Not Met",
        `Your order value (£${subtotal.toFixed(
          2
        )}) is less than the minimum order value of £${currentMOV}. Please add more items to your cart.`
      );
      return Promise.reject(new Error("Order value below minimum order value"));
    }

    // Fetch payment intent
    const paymentData = await fetchPaymentIntent(subtotal, CLIENT_ID);
    if (!paymentData) {
      console.error("Failed to fetch payment intent");
      return;
    }

    const { clientSecret } = paymentData;
    console.log("Got payment data for platform pay");

    // Prepare cart items for platform pay (immediate payment type)
    const platformPayItems: PlatformPay.CartSummaryItem[] = items.map(
      (item) => {
        const itemTotal = (
          (item.netPrice - item.discount) * item.quantity +
          item.vatAmount
        ).toFixed(2);

        return {
          label: item.name,
          amount: itemTotal,
          paymentType: PlatformPay.PaymentType.Immediate,
        } as PlatformPay.CartSummaryItem;
      }
    );

    // Confirm platform pay payment
    const { error } = await confirmPlatformPayPayment(clientSecret, {
      applePay: {
        merchantCountryCode: "GB",
        currencyCode: CURRENCY_CODE.toUpperCase(),
        cartItems: platformPayItems,
      },
      googlePay: {
        testEnv: true, // Set to false in production
        merchantName: STORE_NAME,
        merchantCountryCode: "GB",
        currencyCode: CURRENCY_CODE.toUpperCase(),
        billingAddressConfig: {
          format: PlatformPay.BillingAddressFormat.Full,
          isPhoneNumberRequired: true,
          isRequired: true,
        },
      },
    });

    if (error) {
      console.error("Platform pay error:", error);
      Alert.alert("Payment Error", error.message);
      return;
    }

    // Payment successful
    console.log("=== PLATFORM PAY SUCCESSFUL ===");
    Alert.alert("Success", "Payment completed successfully!");

    // Create order
    await createOrder(params, subtotal);
  };

  /* -------------------- CARD / PAYMENT SHEET -------------------- */
  const handlePayment = async (cartItems: Product[], params: any) => {
    console.log("=== STARTING CARD PAYMENT PROCESS ===");
    console.log("Order details:", params);

    const subtotal = calculateSubtotal(cartItems);
    console.log("Subtotal:", subtotal);

    // Check Minimum Order Value
    const currentMOV = await getMinimumOrderValue();
    if (currentMOV === null) {
      Alert.alert(
        "Error",
        "Unable to fetch minimum order value. Please try again."
      );
      return Promise.reject(new Error("Failed to fetch MOV"));
    }

    if (subtotal < currentMOV) {
      console.error("Order value below minimum order value");
      Alert.alert(
        "Minimum Order Not Met",
        `Your order value (£${subtotal.toFixed(
          2
        )}) is less than the minimum order value of £${currentMOV}. Please add more items to your cart.`
      );
      return Promise.reject(new Error("Order value below minimum order value"));
    }

    // Fetch payment intent
    const paymentData = await fetchPaymentIntent(subtotal, CLIENT_ID);
    if (!paymentData) {
      console.error("Failed to fetch payment intent");
      return;
    }

    const { clientSecret, ephemeralKey, customer } = paymentData;
    console.log("Got payment data, initializing payment sheet...");

    // Initialize payment sheet with Apple Pay & Google Pay options
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: STORE_NAME,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
      applePay: {
        merchantCountryCode: "GB",
      },
      googlePay: {
        merchantCountryCode: "GB",
        testEnv: true, // Set to false in production
      },
      defaultBillingDetails: {
        name: params.billingAddress?.name || "",
        address: {
          city: params.billingAddress?.city || "",
          line1: params.billingAddress?.line1 || "",
          postalCode: params.billingAddress?.postalCode || "",
          state: params.billingAddress?.state || "",
        },
      },
    });

    if (initError) {
      console.error("Payment sheet init error:", initError);
      Alert.alert("Setup Error", initError.message);
      return;
    }

    console.log("Payment sheet initialized, presenting...");

    // Present payment sheet
    const { error: paymentError } = await presentPaymentSheet();

    if (paymentError) {
      console.error("Payment error:", paymentError);
      Alert.alert("Payment Cancelled", paymentError.message);
      return;
    }

    // Payment successful
    console.log("=== CARD PAYMENT SUCCESSFUL ===");
    Alert.alert("Success", "Payment completed successfully!");

    // Create order
    await createOrder(params, subtotal);
  };

  return {
    handlePayment,
    handlePlatformPayPayment,
    isApplePaySupported,
    isGooglePaySupported,
  };
};
