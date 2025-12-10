// usePaymentHandler.web.ts
import { Alert } from "react-native";
import { loadStripe, Stripe, StripeCardElement } from "@stripe/stripe-js";
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
import { useState, useEffect } from "react";

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

export default function usePaymentHandlerWeb() {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [cardElement, setCardElement] = useState<StripeCardElement | null>(
    null
  );
  const [isStripeReady, setIsStripeReady] = useState(false);

  const cartItems = useSelector((state: any) => state.cart.items);
  const dispatch = useDispatch();

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

  // Initialize Stripe on mount
  useEffect(() => {
    let mounted = true;
    let card: StripeCardElement | null = null;

    const initStripe = async () => {
      try {
        console.log("Fetching Stripe config...");
        const configResponse = await axios.get(
          `${API_BASE_URL}/stripe-config/client_abc`
        );

        if (!configResponse.data?.stripePublishableKey) {
          console.error("No publishable key in response:", configResponse.data);
          Alert.alert("Error", "Failed to load payment system configuration");
          return;
        }

        console.log(
          "Initializing Stripe with key:",
          configResponse.data.stripePublishableKey.substring(0, 20) + "..."
        );
        const stripeInstance = await loadStripe(
          configResponse.data.stripePublishableKey
        );

        if (!stripeInstance) {
          console.error("Failed to initialize Stripe");
          Alert.alert("Error", "Failed to initialize payment system");
          return;
        }

        if (!mounted) return;
        setStripe(stripeInstance);
        console.log("Stripe instance created successfully");

        // Wait for DOM to be ready and mount card element
        const mountCard = () => {
          const cardContainer = document.getElementById("card-element");
          console.log("Looking for card-element container...", !!cardContainer);

          if (!cardContainer) {
            console.warn("Card element container not found, retrying...");
            setTimeout(mountCard, 100);
            return;
          }

          console.log("Card container found, creating elements...");

          // Create card element
          const elements = stripeInstance.elements();
          card = elements.create("card", {
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
            hidePostalCode: false,
            disableLink:true,
           
          });

          console.log("Mounting card element...");

          // Clear any existing content and mount new card element
          const container = document.getElementById("card-element");
          if (container) {
            container.innerHTML = ""; // Clear any existing content
            card.mount("#card-element");

            // Force focus on the card element after a short delay
            setTimeout(() => {
              const cardFields = container.querySelector("input");
              if (cardFields) {
                cardFields.focus();
              }
            }, 500);
          }

          // Listen for ready event
          const onReady = () => {
            console.log("✓ Card element is ready and interactive!");
            if (mounted) {
              setCardElement(card);
              setIsStripeReady(true);
              // Remove the ready listener after it's called
              // Add a null check before using card
              if (card) {
                const onReady = () => {
                  console.log("✓ Card element is ready and interactive!");
                  if (mounted) {
                    setCardElement(card);
                    setIsStripeReady(true);
                    // Remove the ready listener after it's called
                    card?.off("ready", onReady);
                  }
                };

                card.on("ready", onReady);
              }
            }
          };

          card.on("ready", onReady);

          // Listen for changes
          card.on("change", (event) => {
            console.log(
              "Card element changed:",
              event.complete ? "complete" : "incomplete"
            );
            const displayError = document.getElementById("card-errors");
            if (event.error && displayError) {
              displayError.textContent = event.error.message;
            } else if (displayError) {
              displayError.textContent = "";
            }
          });

          // Add focus/blur handlers for better UX
          card.on("focus", () => {
            console.log("Card element focused");
            const container = document.getElementById("card-element");
            if (container) {
              container.style.border = "1px solid #2684FF";
              container.style.borderRadius = "4px";
              container.style.padding = "10px";
            }
          });

          card.on("blur", () => {
            console.log("Card element blurred");
          });
        };

        // Start trying to mount after a short delay
        setTimeout(mountCard, 300);
      } catch (error) {
        console.error("Failed to initialize Stripe:", error);
        Alert.alert(
          "Error",
          "Failed to initialize payment system. Please refresh the page and try again."
        );
      }
    };

    // Add a small delay before initializing to ensure the component is fully mounted
    const initTimeout = setTimeout(initStripe, 100);

    // Cleanup
    return () => {
      mounted = false;
      if (card) {
        try {
          console.log("Cleaning up card element...");
          card.unmount();
        } catch (e) {
          console.warn("Error during card cleanup:", e);
        }
      }
      setStripe(null);
      setCardElement(null);
      setIsStripeReady(false);
    };
  }, [API_BASE_URL]);

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
          amount: Math.round(amount * 100), // Convert to cents
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
      console.error("Payment intent error:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
      return null;
    }
  };

  const handlePayment = async (cartItems: Product[], params: any) => {
    console.log("=== STARTING PAYMENT PROCESS (WEB) ===");
    console.log("Order details:", params);
    console.log("Cart items:", cartItems);
    console.log("Stripe ready status:", {
      isStripeReady,
      stripe: !!stripe,
      cardElement: !!cardElement,
    });

    // Validate Stripe is ready with retry logic
    if (!isStripeReady || !stripe || !cardElement) {
      // Attempt to reinitialize the card element if not ready
      console.warn(
        "Payment system not fully initialized, attempting recovery..."
      );

      // Force re-mount of the card element
      const cardContainer = document.getElementById("card-element");
      if (cardContainer) {
        cardContainer.innerHTML = "";
        // Trigger a re-render of the parent component to reinitialize the card element
        setStripe(null);
        setCardElement(null);
        setIsStripeReady(false);

        // Small delay to allow state to update
        setTimeout(() => {
          setStripe(stripe);
          // The useEffect will handle reinitialization
        }, 100);
      }

      Alert.alert(
        "Payment System Loading",
        "The payment system is still initializing. Please wait a moment and try again. If the issue persists, please refresh the page."
      );
      return;
    }

    console.log("✓ Stripe validation passed");

    const subtotal = calculateSubtotal(cartItems);
    const shippingCharges = params.shippingCharges || 0;
    const discounts = params.discounts || [];

    console.log("Subtotal:", subtotal);

    // Check Minimum Order Value (MOV)
    const MOV = 15; // Minimum Order Value
    if (subtotal < MOV) {
      console.error("Order value below minimum order value");
      window.alert(
        
        `Your order value ($${subtotal.toFixed(
          2
        )}) is less than the minimum order value of $${MOV}. Please add more items to your cart.`
      );
      return;
    }

    // Fetch payment intent
    const paymentData = await fetchPaymentIntent(subtotal, CLIENT_ID);
    if (!paymentData) {
      console.error("Failed to fetch payment intent");
      return;
    }

    const { clientSecret } = paymentData;
    console.log("Got client secret, confirming payment...");

    try {
      // Confirm card payment
      console.log("Confirming card payment...");
      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: params.billingAddress?.name || "",
              address: {
                city: params.billingAddress?.city || "",
                line1: params.billingAddress?.line1 || "",
                postal_code: params.billingAddress?.postalCode || "",
                state: params.billingAddress?.state || "",
              },
            },
          },
        });

      console.log("Payment confirmation result:", {
        error: paymentError,
        intentStatus: paymentIntent?.status,
      });

      if (paymentError) {
        console.error("Payment error:", paymentError);
        Alert.alert(
          "Payment Failed",
          paymentError.message || "An error occurred during payment"
        );
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("=== PAYMENT SUCCESSFUL ===");
        Alert.alert("Success", "Payment completed successfully!");

        // Create order
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
          console.log("Creating order...");
          const response = await orderService.createOrder(orderDetails);
          console.log("Order created successfully:", response);

          dispatch(clearCart());

          redirectToPage(containers.orderSuccessfulScreen, {
            orderData: JSON.stringify(response),
          });

          if (NotificationService.scheduleLocalNotification) {
            await NotificationService.scheduleLocalNotification(
              "Your Order is Placed",
              `Your order number is #ORD-${response?.orderNumber}`,
              { orderNumber: response?.orderNumber, type: "delivery_scheduled" }
            );
          }
        } catch (error) {
          console.error("=== ORDER CREATION FAILED ===", error);
          Alert.alert(
            "Error",
            "Payment successful but failed to create order. Please contact support."
          );
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      Alert.alert("Error", "An unexpected error occurred during payment");
    }
  };

  return { handlePayment, stripe, cardElement, isStripeReady };
}
