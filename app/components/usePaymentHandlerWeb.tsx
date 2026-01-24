// usePaymentHandler.web.tsx

import { Alert } from "react-native";
import { loadStripe, Stripe, StripeCardElement, PaymentRequest } from "@stripe/stripe-js";
import axios from "axios";
import { Order, OrderProduct, orderService, PickupMode } from "@/services/orderService";
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

export default function usePaymentHandlerWeb() {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(null);
  const [isStripeReady, setIsStripeReady] = useState(false);
  
  // Payment Request (Apple Pay / Google Pay) states
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);

  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [MOV, setMOV] = useState<number | null>(null);
  const [currentMOV_Checkout, setCurrentMOV_Checkout] = useState<number | null>(null);

  /* -------------------- FETCH GLOBAL SETTINGS -------------------- */
  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/global-settings`);
        setShippingCharge(resp?.data?.shippingCharge ?? 0);
        setMOV(resp?.data?.minimumCheckoutOrderValue ?? null);
        setCurrentMOV_Checkout(resp?.data?.minimumDeliveryOrderValue ?? null);
      } catch {
        setShippingCharge(0);
        setMOV(null);
        setCurrentMOV_Checkout(null);
      }
    })();
  }, [API_BASE_URL]);

  /* -------------------- MAP CART → ORDER PRODUCTS -------------------- */
  const products: OrderProduct[] = cartItems.map((item: any) => {
    const quantity = item.quantity || 1;
    const netPrice = item.netPrice || 0;
    const vatRate = item.vatRate || 0;
    const isVatApplicable = !!item.isVatApplicable;

    const vatAmount = isVatApplicable
      ? (netPrice * quantity * vatRate) / 100
      : 0;

    const netPriceIncVat = netPrice * quantity + vatAmount;
    const grossPrice = netPriceIncVat;

    return {
      productId: String(item.id),
      name: item.name,
      quantity,
      netPrice,
      isVatApplicable,
      vatRate,
      vatAmount,
      netPriceIncVat,
      grossPrice,
      selectedColor: item.selectedColor,
    };
  });

  /* -------------------- PRICE CALCULATION -------------------- */
  const calculateSubtotal = (items: OrderProduct[]) =>
    items.reduce((sum, i) => sum + i.grossPrice, 0);

  const getFinalAmount = (items: OrderProduct[], mode: string) => {
    const subtotal = calculateSubtotal(items);
    return mode === DELIVERY_MODE_HOME
      ? subtotal + shippingCharge
      : subtotal;
  };

  /* -------------------- STRIPE INITIALIZATION -------------------- */
  useEffect(() => {
    let mounted = true;
    let card: StripeCardElement | null = null;

    const initStripe = async () => {
      try {
        const resp = await axios.get(
          `${API_BASE_URL}/stripe-config/client_abc`
        );

        const stripeInstance = await loadStripe(
          resp.data.stripePublishableKey
        );
        if (!stripeInstance || !mounted) return;

        setStripe(stripeInstance);

        // Initialize Payment Request for Apple Pay / Google Pay
        const pr = stripeInstance.paymentRequest({
          country: "GB", // Change to your country code
          currency: CURRENCY_CODE.toLowerCase(),
          total: {
            label: STORE_NAME || "Order Total",
            amount: 0, // Will be updated dynamically
          },
          requestPayerName: true,
          requestPayerEmail: true,
        });

        // Check if browser supports Apple Pay or Google Pay
        const result = await pr.canMakePayment();
        if (result && mounted) {
          setPaymentRequest(pr);
          setCanMakePayment(true);
          
          // Detect which wallet is available
          if (result.applePay) {
            setIsApplePaySupported(true);
          }
          if (result.googlePay) {
            setIsGooglePaySupported(true);
          }
        }

        // Mount card element
        const mountCard = () => {
          const container = document.getElementById("card-element");
          if (!container) {
            setTimeout(mountCard, 100);
            return;
          }

          const elements = stripeInstance.elements();
          card = elements.create("card");
          container.innerHTML = "";
          card.mount("#card-element");

          card.on("ready", () => {
            if (mounted) {
              setCardElement(card);
              setIsStripeReady(true);
            }
          });
        };

        setTimeout(mountCard, 300);
      } catch (error) {
        console.error("Stripe initialization error:", error);
        Alert.alert("Error", "Failed to initialize payment system");
      }
    };

    initStripe();

    return () => {
      mounted = false;
      card?.unmount();
      setStripe(null);
      setCardElement(null);
      setIsStripeReady(false);
      setPaymentRequest(null);
      setCanMakePayment(false);
    };
  }, [API_BASE_URL]);

  /* -------------------- PAYMENT INTENT -------------------- */
  const fetchPaymentIntent = async (amount: number) => {
    try {
      const resp = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          amount: Math.round(amount * 100), // cents
          currency: CURRENCY_CODE,
          clientId: CLIENT_ID,
        }
      );
      return resp.data;
    } catch (error) {
      console.error("Payment intent error:", error);
      Alert.alert("Error", "Failed to initialize payment");
      return null;
    }
  };

  /* -------------------- CREATE ORDER HELPER -------------------- */
  const createOrder = async (params: any, totalAmount: number) => {
    try {
      const orderDetails: Partial<Order> = {
        products,
        shippingCharges:
          params.selectedMode === DELIVERY_MODE_HOME
            ? shippingCharge
            : 0,
        tax: 0,
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

      return response;
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  /* -------------------- CARD PAYMENT -------------------- */
  const handlePayment = async (items: any[], params: any) => {
    if (!stripe || !cardElement || !isStripeReady) {
      Alert.alert("Payment system is still loading");
      return;
    }

    const totalAmount = getFinalAmount(products, params.selectedMode);

    // Check appropriate MOV based on delivery mode
    const applicableMOV = 
      params.selectedMode === DELIVERY_MODE_HOME
        ? (currentMOV_Checkout !== null ? currentMOV_Checkout : MOV)
        : MOV;

    if (applicableMOV !== null && totalAmount < applicableMOV) {
      const movLabel = params.selectedMode === DELIVERY_MODE_HOME 
        ? "minimum checkout order value" 
        : "minimum order value";
      Alert.alert(
        "Minimum Order Not Met",
        `Your order value (£${totalAmount.toFixed(2)}) is less than the ${movLabel} of £${applicableMOV}.`
      );
      return;
    }

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    const { error, paymentIntent } =
      await stripe.confirmCardPayment(
        paymentData.paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: params.billingAddress?.name || "",
            },
          },
        }
      );

    if (error || paymentIntent?.status !== "succeeded") {
      Alert.alert("Payment Failed", error?.message);
      return;
    }

    /* -------------------- CREATE ORDER -------------------- */
    try {
      await createOrder(params, totalAmount);
    } catch {
      Alert.alert(
        "Error",
        "Payment successful but order creation failed"
      );
    }
  };

  /* -------------------- WALLET PAYMENT (Apple Pay / Google Pay) -------------------- */
  const handlePlatformPayPayment = async (items: any[], params: any) => {
    if (!stripe || !paymentRequest || !canMakePayment) {
      Alert.alert("Digital wallet payment not available");
      return;
    }

    const totalAmount = getFinalAmount(products, params.selectedMode);

    // Check appropriate MOV based on delivery mode
    const applicableMOV = 
      params.selectedMode === DELIVERY_MODE_HOME
        ? (currentMOV_Checkout !== null ? currentMOV_Checkout : MOV)
        : MOV;

    if (applicableMOV !== null && totalAmount < applicableMOV) {
      const movLabel = params.selectedMode === DELIVERY_MODE_HOME 
        ? "minimum checkout order value" 
        : "minimum order value";
      Alert.alert(
        "Minimum Order Not Met",
        `Your order value (£${totalAmount.toFixed(2)}) is less than the ${movLabel} of £${applicableMOV}.`
      );
      return;
    }

    // Update payment request amount
    paymentRequest.update({
      total: {
        label: STORE_NAME || "Order Total",
        amount: Math.round(totalAmount * 100), // cents
      },
    });

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    // Set up payment method handler
    paymentRequest.on("paymentmethod", async (ev) => {
      try {
        const { error: confirmError, paymentIntent } = 
          await stripe.confirmCardPayment(
            paymentData.paymentIntent.client_secret,
            {
              payment_method: ev.paymentMethod.id,
            },
            { handleActions: false }
          );

        if (confirmError) {
          ev.complete("fail");
          Alert.alert("Payment Failed", confirmError.message);
          return;
        }

        if (paymentIntent?.status === "requires_action") {
          const { error: actionError } = await stripe.confirmCardPayment(
            paymentData.paymentIntent.client_secret
          );
          
          if (actionError) {
            ev.complete("fail");
            Alert.alert("Payment Failed", actionError.message);
            return;
          }
        }

        ev.complete("success");

        // Create order
        await createOrder(params, totalAmount);
      } catch (error) {
        ev.complete("fail");
        console.error("Wallet payment error:", error);
        Alert.alert("Error", "Payment processing failed");
      }
    });

    // Show the payment UI
    paymentRequest.show();
  };

  return {
    handlePayment,
    handlePlatformPayPayment,
    stripe,
    cardElement,
    isStripeReady,
    isApplePaySupported,
    isGooglePaySupported,
    canMakePayment,
    paymentRequest,
  };
}