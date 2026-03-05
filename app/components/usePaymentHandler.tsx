// usePaymentHandler.ts (Mobile version with Apple Pay & Google Pay)
// FIXED VERSION - with proper Apple Pay configuration

import { Alert } from "react-native";
import {
  useStripe,
  isPlatformPaySupported,
  PlatformPay,
  AddressCollectionMode,
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
import globalSettingsAPI from "@/services/globalSettingsService";
import { PaymentIntent } from "@stripe/stripe-react-native";


type Product = {
  productId: string;
  name: string;
  quantity: number;
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

  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  /* -------------------- FETCH SHIPPING CHARGE -------------------- */
  const fetchSettings = async () => {
    try {
      setIsLoadingSettings(true);
      const response = await globalSettingsAPI.getSettings();
      setShippingCharge(response.data.shippingCharge);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      Alert.alert("Error", "Failed to load settings. Please try again.");
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  /* -------------------- PLATFORM PAY SUPPORT -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const applePaySupported = await isPlatformPaySupported();
        // Use testEnv only in development; production must use false for real charges
        const googlePaySupported = await isPlatformPaySupported({
          googlePay: { testEnv: __DEV__ },
        });

        console.log(' Apple Pay supported:', applePaySupported);
        console.log(' Google Pay supported:', googlePaySupported);

        setIsApplePaySupported(!!applePaySupported);
        setIsGooglePaySupported(!!googlePaySupported);
      } catch (error) {
        console.error(" Platform pay support check failed:", error);
        setIsApplePaySupported(false);
        setIsGooglePaySupported(false);
      }
    })();
  }, []);

  /* -------------------- MIN ORDER VALUE -------------------- */
  const getMinimumOrderValue = async (): Promise<number | null> => {
    try {
      const resp = await axios.get(
        `${API_BASE_URL}/ui-constants/minimumCheckoutOrderValue`
      );
      return typeof resp.data === "number"
        ? resp.data
        : resp.data?.minimumCheckoutOrderValue ?? null;
    } catch {
      return null;
    }
  };

  /* -------------------- PRODUCT MAPPING -------------------- */
  const products = cartItems.map((item: any) => {
    const quantity = item.quantity || 1;
    const netPrice = item.netPrice;

    // Calculate net price excluding VAT
    const netPriceExVAT = item.isVatApplicable
      ? netPrice / (1 + item.vatRate)
      : netPrice;

    // Calculate VAT amount per unit
    const vatPerUnit = item.isVatApplicable ? netPrice - netPriceExVAT : 0;
    // Total VAT for all quantities
    const vatAmount = Number((vatPerUnit * quantity).toFixed(2));
    // Total price including VAT (which is just netPrice * quantity since netPrice is RRP)
    const netPriceIncVat = Number((netPrice * quantity).toFixed(2));
    const grossPrice = netPriceIncVat;

    return {
      productId: Number(item.id),
      name: item.name,
      quantity,
      netPrice: netPrice,
      netPriceIncVat: netPriceIncVat,
      grossPrice: grossPrice,
      isVatApplicable: item.isVatApplicable,
      vatRate: item.vatRate || 20,
      vatAmount: vatAmount,
    };
  });

  /* -------------------- PRICE CALCULATION -------------------- */
  const calculateSubtotal = (items: Product[]) => {
    const total = items.reduce((sum, item) => {
      return sum + (item.netPrice * item.quantity);  // ✅ netPrice already includes VAT
    }, 0);

    return total;
  };

  const getFinalAmount = (items: Product[], mode: string): number => {
    const subtotal = calculateSubtotal(items);
    const total =
      mode === DELIVERY_MODE_HOME ? subtotal + shippingCharge : subtotal;

    console.log(" Payment Calculation:", {
      subtotal: subtotal.toFixed(2),
      shippingCharge: shippingCharge.toFixed(2),
      mode,
      finalTotal: total.toFixed(2),
    });

    return Number(total.toFixed(2));
  };

  /* -------------------- PAYMENT INTENT -------------------- */
  const fetchPaymentIntent = async (amount: number) => {
    try {
      const resp = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          amount,
          currency: CURRENCY_CODE,
          clientId: CLIENT_ID,
        }
      );
      return resp.data;
    } catch {
      Alert.alert("Error", "Failed to initialize payment");
      return null;
    }
  };

  /* -------------------- ORDER CREATION -------------------- */
  const createOrder = async (params: any, totalAmount: number) => {
    try {
      const orderDetails = {
        products,
        shippingCharges:
          params.selectedMode === DELIVERY_MODE_HOME ? shippingCharge : 0,
        totalAmount,
        paymentMethod: "credit_card",
        pickupMode: params.selectedMode as PickupMode,
        deliveryDate: formatDateForBackend(params.deliveryDate),
        deliveryTime: params.deliveryTime,
        billingAddress: params.billingAddress,
        shippingAddress: params.shippingAddress,
      };

      const response = await orderService.createOrder(orderDetails);
      dispatch(clearCart());

      redirectToPage(containers.orderSuccessfulScreen, {
        orderData: JSON.stringify(response),
      });
      await orderService.notifyOrderPlaced(response);

      await NotificationService.scheduleLocalNotification(
        "Your Order is Placed",
        `Your order number is #ORD-${response.orderNumber}`,
        { orderNumber: response.orderNumber }
      );
    } catch (error) {
      console.error(" Order creation failed:", error);
      Alert.alert("Order Could Not Be Placed", "Your payment was processed but the order could not be created. Please contact support.");
    }
  };

  /* -------------------- APPLE / GOOGLE PAY -------------------- */
  const handlePlatformPayPayment = async (items: Product[], params: any) => {
    if (isLoadingSettings) {
      Alert.alert("Please Wait", "Loading payment settings...");
      return;
    }

    const totalAmount = getFinalAmount(items, params.selectedMode);

    const mov = await getMinimumOrderValue();
    if (mov !== null && totalAmount < mov) {
      Alert.alert("Minimum Order Not Met", "Please add more items to your cart to meet the minimum order value.");
      return;
    }

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    // Build cart summary
    const cartSummary: PlatformPay.CartSummaryItem[] = items.map((i) => ({
      label: i.name,
      amount: (
        i.netPrice * i.quantity).toFixed(2),
      paymentType: PlatformPay.PaymentType.Immediate,
    }));

    if (params.selectedMode === DELIVERY_MODE_HOME) {
      cartSummary.push({
        label: "Delivery Charges",
        amount: shippingCharge.toFixed(2),
        paymentType: PlatformPay.PaymentType.Immediate,
      });
    }

    //  FIXED: Verify cart total matches PaymentIntent
    const cartTotal = cartSummary.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const expectedTotal = totalAmount;

    if (Math.abs(cartTotal - expectedTotal) > 0.01) {
      console.error(" Cart total mismatch:", {
        cartTotal: cartTotal.toFixed(2),
        expectedTotal: expectedTotal.toFixed(2),
        difference: (cartTotal - expectedTotal).toFixed(2),
      });
      Alert.alert("Error", "Payment amount mismatch. Please try again.");
      return;
    }

    console.log(" Cart Summary:", {
      items: cartSummary.length,
      total: cartTotal.toFixed(2),
      expectedTotal: expectedTotal.toFixed(2),
    });

    const result = await confirmPlatformPayPayment(
      paymentData.paymentIntent.client_secret,
      {
        applePay: {
          merchantCountryCode: "GB",
          currencyCode: CURRENCY_CODE.toUpperCase(),
          cartItems: cartSummary,
        },
        googlePay: {
          testEnv: __DEV__,
          merchantName: STORE_NAME,
          merchantCountryCode: "GB",
          currencyCode: CURRENCY_CODE.toUpperCase(),
          label: STORE_NAME,
          amount: totalAmount
        },
      }
    );

    console.log("PlatformPay Result:", result);

    if (result.error) {
      console.error("PlatformPay Error:", result.error, {
        code: result.error.code,
        message: result.error.message,
        declineCode: (result.error as any)?.declineCode,
        stripeErrorCode: (result.error as any)?.stripeErrorCode,
      });

      // ✅ TRUST STRIPE PAYMENT STATUS, NOT JUST SDK ERROR
      if (
        result.paymentIntent?.status === "Succeeded"
      ) {
        console.log("Payment succeeded despite SDK error");
        await createOrder(params, totalAmount);
        return;
      }

      Alert.alert(
        "Payment Failed",
        result.error.message || "Payment failed. Please try again."
      );
      return;
    }

    // Normal success
    if (result.paymentIntent?.status === "Succeeded") {
      await createOrder(params, totalAmount);
    }
  }

  /* -------------------- CARD PAYMENT -------------------- */
  const handlePayment = async (items: Product[], params: any) => {
    if (isLoadingSettings) {
      Alert.alert("Please Wait", "Loading payment settings...");
      return;
    }

    const totalAmount = getFinalAmount(items, params.selectedMode);

    const mov = await getMinimumOrderValue();
    if (mov !== null && totalAmount < mov) {
      Alert.alert("Minimum Order Not Met");
      return;
    }

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: STORE_NAME,
      paymentIntentClientSecret: paymentData.paymentIntent.client_secret,
      defaultBillingDetails: {
        address: { country: "GB" },
      },
      billingDetailsCollectionConfiguration: {
        address: AddressCollectionMode.NEVER,
      },
      applePay: {
        merchantCountryCode: "GB",
      },
      googlePay: { merchantCountryCode: "GB", testEnv: __DEV__ },
    });

    if (initError) {
      console.error(" Payment sheet init error:", initError);
      Alert.alert("Payment Error", initError.message);
      return;
    }

    const { error } = await presentPaymentSheet();
    if (error) {
      console.error(" Payment sheet error:", error);
      return;
    }

    console.log(" Card payment confirmed");
    await createOrder(params, totalAmount);
  };

  return {
    handlePayment,
    handlePlatformPayPayment,
    isApplePaySupported,
    isGooglePaySupported,
    isLoadingSettings,
  };
};