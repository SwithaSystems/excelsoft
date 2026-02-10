// usePaymentHandler.web.tsx
// FIXED VERSION with proper Apple Pay configuration

import { Alert } from "react-native";
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  PaymentRequest,
} from "@stripe/stripe-js";
import axios from "axios";
import {
  Order,
  OrderProduct,
  orderService,
  PickupMode,
} from "@/services/orderService";
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
import { useEffect, useRef, useState } from "react";

export default function usePaymentHandlerWeb() {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(
    null
  );
  const [isStripeReady, setIsStripeReady] = useState(false);

  // Payment Request (Apple Pay / Google Pay) states
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const [canMakePayment, setCanMakePayment] = useState(false);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);

  // Refs for wallet payment: single handler reads these so we don't add duplicate listeners
  const stripeRef = useRef<Stripe | null>(null);
  const walletPaymentDataRef = useRef<{
    paymentIntent: { client_secret: string };
  } | null>(null);
  const walletParamsRef = useRef<any>(null);
  const walletTotalRef = useRef<number | null>(null);
  const createOrderRef = useRef<
    ((params: any, totalAmount: number) => Promise<any>) | null
  >(null);

  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [MOV, setMOV] = useState<number | null>(null);
  const [currentMOV_Checkout, setCurrentMOV_Checkout] = useState<number | null>(
    null
  );

  const VAT_RATE = 0.2; // 20% VAT

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
    const netPrice = item.netPrice || 0; // This is RRP (includes VAT if applicable)
    const isVatApplicable = !!item.isVatApplicable;

    // Calculate net price excluding VAT
    const netPriceExVAT = isVatApplicable
      ? netPrice / (1 + VAT_RATE)
      : netPrice;

    // Calculate VAT amount per unit
    const vatPerUnit = isVatApplicable ? netPrice - netPriceExVAT : 0;

    // Total VAT for all quantities
    const vatAmount = vatPerUnit * quantity;

    // Total price including VAT (which is just netPrice * quantity since netPrice is RRP)
    const netPriceIncVat = netPrice * quantity;
    const grossPrice = netPriceIncVat;

    return {
      productId: String(item.id),
      name: item.name,
      quantity,
      netPrice, // RRP (VAT-inclusive)
      netPriceExVAT, // Net price without VAT
      isVatApplicable,
      vatRate: item.vatRate || 20,
      vatAmount,
      netPriceIncVat,
      grossPrice,
      selectedColor: item.selectedColor,
    };
  });

  /* -------------------- PRICE CALCULATION -------------------- */
  const calculateSubtotal = (items: OrderProduct[]) => {
    // Subtotal excluding VAT
    const subtotalExVAT = items.reduce((sum, item) => {
      const netExVAT = item.isVatApplicable
        ? (item.netPrice / (1 + VAT_RATE)) * item.quantity
        : item.netPrice * item.quantity;
      return sum + netExVAT;
    }, 0);

    // Total VAT
    const totalVAT = items.reduce((sum, item) => sum + item.vatAmount, 0);

    // Subtotal including VAT (sum of all RRP * quantity)
    const subtotalIncVAT = items.reduce(
      (sum, item) => sum + item.netPrice * item.quantity,
      0
    );

    return subtotalIncVAT;
  };

  const getFinalAmount = (items: OrderProduct[], mode: string) => {
    const subtotal = calculateSubtotal(items);
    return mode === DELIVERY_MODE_HOME ? subtotal + shippingCharge : subtotal;
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

        const stripeInstance = await loadStripe(resp.data.stripePublishableKey);
        if (!stripeInstance || !mounted) return;

        setStripe(stripeInstance);
        stripeRef.current = stripeInstance;

        console.log(" Initializing Apple Pay / Google Pay...");

        //  FIXED: Initialize Payment Request for Apple Pay / Google Pay
        const pr = stripeInstance.paymentRequest({
          country: "GB", // Your country code
          currency: CURRENCY_CODE.toLowerCase(), // Must be lowercase (e.g., "gbp")
          total: {
            label: STORE_NAME || "Order Total",
            amount: 0, // Will be updated dynamically (in pence/cents)
          },
          requestPayerName: true,
          requestPayerEmail: true,
          requestShipping: false, // Set to true if you need shipping address from Apple Pay
          disableWallets: [], // Don't disable any wallets
        });

        // Check if browser supports Apple Pay or Google Pay
        const result = await pr.canMakePayment();
        console.log(" Wallet payment check result:", result);

        if (result && mounted) {
          setPaymentRequest(pr);
          setCanMakePayment(true);

          // Detect which wallet is available
          if (result.applePay) {
            console.log(" Apple Pay is available");
            setIsApplePaySupported(true);
          }
          if (result.googlePay) {
            console.log(" Google Pay is available");
            setIsGooglePaySupported(true);
          }

          // Register paymentmethod handler ONCE so we don't accumulate listeners on each click
          pr.on("paymentmethod", async (ev) => {
            console.log(" Processing wallet payment...");

            const paymentData = walletPaymentDataRef.current;
            const params = walletParamsRef.current;
            const totalAmount = walletTotalRef.current;
            const createOrderFn = createOrderRef.current;
            const stripeObj = stripeRef.current;

            if (
              !paymentData?.paymentIntent?.client_secret ||
              !params ||
              totalAmount == null ||
              !createOrderFn ||
              !stripeObj
            ) {
              console.error(" Missing payment data");
              ev.complete("fail");
              Alert.alert(
                "Error",
                "Payment session expired. Please try again."
              );
              return;
            }

            try {
              console.log(" Confirming payment...");

              const { error: confirmError, paymentIntent } =
                await stripeObj.confirmCardPayment(
                  paymentData.paymentIntent.client_secret,
                  {
                    payment_method: ev.paymentMethod.id,
                  },
                  { handleActions: false }
                );

              if (confirmError) {
                console.error(" Payment confirmation failed:", confirmError);
                ev.complete("fail");
                Alert.alert("Payment Failed", confirmError.message);
                return;
              }

              if (paymentIntent?.status === "requires_action") {
                console.log(" Payment requires additional action...");
                const { error: actionError } =
                  await stripeObj.confirmCardPayment(
                    paymentData.paymentIntent.client_secret
                  );

                if (actionError) {
                  console.error(" Action failed:", actionError);
                  ev.complete("fail");
                  Alert.alert("Payment Failed", actionError.message);
                  return;
                }
              }

              console.log(" Payment successful");
              ev.complete("success");

              await createOrderFn(params, totalAmount);
            } catch (error) {
              console.error(" Wallet payment error:", error);
              ev.complete("fail");
              Alert.alert("Error", "Payment processing failed");
            }
          });
        } else {
          console.log(" No wallet payment methods available");
        }

        // Mount card element
        const mountCard = () => {
          const container = document.getElementById("card-element");
          if (!container) {
            setTimeout(mountCard, 100);
            return;
          }

          const elements = stripeInstance.elements();
          card = elements.create("card", {
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
          });
          container.innerHTML = "";
          card.mount("#card-element");

          card.on("ready", () => {
            console.log(" Card element ready");
            if (mounted) {
              setCardElement(card);
              setIsStripeReady(true);
            }
          });

          card.on("change", (event) => {
            if (event.error) {
              console.log("Card validation error:", event.error.message);
            }
          });
        };

        setTimeout(mountCard, 300);
      } catch (error) {
        console.error(" Stripe initialization error:", error);
        Alert.alert("Error", "Failed to initialize payment system");
      }
    };

    initStripe();

    return () => {
      mounted = false;
      stripeRef.current = null;
      walletPaymentDataRef.current = null;
      walletParamsRef.current = null;
      walletTotalRef.current = null;
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
      const amountInCents = Math.round(amount * 100);

      console.log(" Creating PaymentIntent:", {
        amount: amount.toFixed(2),
        amountInCents,
        currency: CURRENCY_CODE.toUpperCase(),
      });

      const resp = await axios.post(
        `${API_BASE_URL}/payments/create-payment-intent`,
        {
          amount: amountInCents, // cents/pence
          currency: CURRENCY_CODE.toUpperCase(), //  Uppercase for backend
          clientId: CLIENT_ID,
        }
      );

      console.log(" PaymentIntent created");
      return resp.data;
    } catch (error) {
      console.error(" Payment intent error:", error);
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
          params.selectedMode === DELIVERY_MODE_HOME ? shippingCharge : 0,
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
      console.error(" Order creation error:", error);
      throw error;
    }
  };

  createOrderRef.current = createOrder;

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
        ? currentMOV_Checkout !== null
          ? currentMOV_Checkout
          : MOV
        : MOV;

    if (applicableMOV !== null && totalAmount < applicableMOV) {
      const movLabel =
        params.selectedMode === DELIVERY_MODE_HOME
          ? "minimum checkout order value"
          : "minimum order value";
      Alert.alert(
        "Minimum Order Not Met",
        `Your order value (£${totalAmount.toFixed(
          2
        )}) is less than the ${movLabel} of £${applicableMOV}.`
      );
      return;
    }

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    console.log(" Confirming card payment...");

    const { error, paymentIntent } = await stripe.confirmCardPayment(
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
      console.error(" Card payment failed:", error);
      Alert.alert("Payment Failed", error?.message);
      return;
    }

    console.log(" Card payment successful");

    /* -------------------- CREATE ORDER -------------------- */
    try {
      await createOrder(params, totalAmount);
    } catch {
      Alert.alert("Error", "Payment successful but order creation failed");
    }
  };

  /* -------------------- WALLET PAYMENT (Apple Pay / Google Pay) -------------------- */
  const handlePlatformPayPayment = async (items: any[], params: any) => {
    if (!stripe || !paymentRequest || !canMakePayment) {
      console.log(" Wallet payment not available:", {
        stripe: !!stripe,
        paymentRequest: !!paymentRequest,
        canMakePayment,
      });
      Alert.alert(
        "Digital Wallet Not Available",
        "Apple Pay or Google Pay is not available in this browser or device."
      );
      return;
    }

    const totalAmount = getFinalAmount(products, params.selectedMode);

    // Check appropriate MOV based on delivery mode
    const applicableMOV =
      params.selectedMode === DELIVERY_MODE_HOME
        ? currentMOV_Checkout !== null
          ? currentMOV_Checkout
          : MOV
        : MOV;

    if (applicableMOV !== null && totalAmount < applicableMOV) {
      const movLabel =
        params.selectedMode === DELIVERY_MODE_HOME
          ? "minimum checkout order value"
          : "minimum order value";
      Alert.alert(
        "Minimum Order Not Met",
        `Your order value (£${totalAmount.toFixed(
          2
        )}) is less than the ${movLabel} of £${applicableMOV}.`
      );
      return;
    }

    console.log(" Initiating wallet payment:", {
      totalAmount: totalAmount.toFixed(2),
      amountInCents: Math.round(totalAmount * 100),
    });

    // Update payment request amount
    paymentRequest.update({
      total: {
        label: STORE_NAME || "Order Total",
        amount: Math.round(totalAmount * 100), // pence/cents
      },
    });

    const paymentData = await fetchPaymentIntent(totalAmount);
    if (!paymentData) return;

    // Store current payment data for the single paymentmethod handler (registered at init)
    walletPaymentDataRef.current = paymentData;
    walletParamsRef.current = params;
    walletTotalRef.current = totalAmount;

    console.log(" Showing wallet payment UI");

    // Show the payment UI (handler already registered once in init)
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