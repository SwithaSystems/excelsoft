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
import globalSettingsAPI from "@/services/globalSettingsService";

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
      console.log("globalsettings", response.data.shippingCharge);
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
      const googlePaySupported = await isPlatformPaySupported({ 
        googlePay: { testEnv: true } 
      });
      
      console.log('Apple Pay supported:', applePaySupported);
      console.log('Google Pay supported:', googlePaySupported);
      
      setIsApplePaySupported(!!applePaySupported);
      setIsGooglePaySupported(!!googlePaySupported);
    } catch (error) {
      console.error('Platform pay support check failed:', error);
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
  
  // Calculate VAT per unit
  const vatPerUnit = item.isVatApplicable
    ? (netPrice * (item.vatRate || 0)) / 100
    : 0;
  
  // Price including VAT per unit
  const netPriceIncVat = netPrice + vatPerUnit;
  
  // Total VAT for all quantities
  const vatAmount = vatPerUnit * quantity;

  return {
    productId: Number(item.id),
    name: item.name,
    quantity,
    netPrice: netPrice,
    netPriceIncVat: netPriceIncVat,  
    grossPrice: netPriceIncVat,       
    isVatApplicable: item.isVatApplicable,
    vatRate: item.vatRate,
    vatAmount: vatAmount,             
  };
});
 /* -------------------- PRICE CALCULATION -------------------- */
  const calculateSubtotal = (items: Product[]) => {
  const total = items.reduce((sum, item) => {
    const itemSubtotal = item.netPrice * item.quantity;
    const itemVAT = item.isVatApplicable ? (itemSubtotal * item.vatRate) / 100 : 0;
    
    console.log(`Item: ${item.name}`);
    console.log(`  Price: ${item.netPrice} × ${item.quantity} = ${itemSubtotal}`);
    console.log("item vat rate",item.vatRate);
    console.log(`  VAT: ${itemVAT}`);
    console.log(`  Item Total: ${itemSubtotal + itemVAT}`);
    
    return sum + itemSubtotal + itemVAT;
  }, 0);
  
  console.log(`Subtotal (with VAT): ${total}`);
  return total;
};

const getFinalAmount = (items: Product[], mode: string): number => {
  const subtotal = calculateSubtotal(items);
  console.log("Subtotal:", subtotal);
  console.log("Shipping charge being used:", shippingCharge);
  console.log("Delivery mode:", mode);
  
  const total = mode === DELIVERY_MODE_HOME
    ? subtotal + shippingCharge
    : subtotal;
  
  console.log("Final total:", total);
  return total;
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

      await NotificationService.scheduleLocalNotification(
        "Your Order is Placed",
        `Your order number is #ORD-${response.orderNumber}`,
        { orderNumber: response.orderNumber }
      );
    } catch {
      Alert.alert("Error", "Payment successful but order creation failed");
    }
  };

  /* -------------------- APPLE / GOOGLE PAY -------------------- */
  const handlePlatformPayPayment = async (items: Product[], params: any) => {
    if (isLoadingSettings) {
      Alert.alert("Please Wait", "Loading payment settings...");
      return;
    }
    const totalAmount = getFinalAmount(items, params.selectedMode);

    console.log("total amount",totalAmount);

    const mov = await getMinimumOrderValue();
    if (mov !== null && totalAmount < mov) {
      Alert.alert("Minimum Order Not Met");
      return;
    }

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    const cartSummary: PlatformPay.CartSummaryItem[] = items.map((i) => ({
      label: i.name,
      amount: (
        i.netPrice * i.quantity +
        (i.isVatApplicable ? i.vatAmount : 0)
      ).toFixed(2),
      paymentType: PlatformPay.PaymentType.Immediate,
    }));

    if (params.selectedMode === DELIVERY_MODE_HOME) {
      cartSummary.push({
        label: "Delivery Charges",
        amount: shippingCharge.toFixed(2),
        paymentType: PlatformPay.PaymentType.Immediate,
      });
    }

    const { error } = await confirmPlatformPayPayment(
      paymentData.paymentIntent.client_secret,
      {
        applePay: {
          merchantCountryCode: "GB",
          currencyCode: CURRENCY_CODE.toUpperCase(),
          cartItems: cartSummary,
        },
        googlePay: {
          testEnv: true,
          merchantName: STORE_NAME,
          merchantCountryCode: "GB",
          currencyCode: CURRENCY_CODE.toUpperCase(),
        },
      }
    );

    if (error) {
      Alert.alert("Payment Error", error.message);
      return;
    }

    await createOrder(params, totalAmount);
  };

  /* -------------------- CARD PAYMENT -------------------- */
  const handlePayment = async (items: Product[], params: any) => {
    if (isLoadingSettings) {
      Alert.alert("Please Wait", "Loading payment settings...");
      return;
    }
    const totalAmount = getFinalAmount(items, params.selectedMode);
    console.log("total amount", totalAmount)

    const mov = await getMinimumOrderValue();
    if (mov !== null && totalAmount < mov) {
      Alert.alert("Minimum Order Not Met");
      return;
    }

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: STORE_NAME,
      paymentIntentClientSecret:
        paymentData.paymentIntent.client_secret,
      applePay: { merchantCountryCode: "GB" },
      googlePay: { merchantCountryCode: "GB", testEnv: true },
    });

    if (initError) {
      Alert.alert("Payment Error", initError.message);
      return;
    }

    const { error } = await presentPaymentSheet();
    if (error) return;

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
