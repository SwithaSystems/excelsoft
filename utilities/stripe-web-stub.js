// Stripe Web Stub
export const StripeProvider = ({ children }) => children;
export const useStripe = () => ({
  initPaymentSheet: async () => ({ error: null }),
  presentPaymentSheet: async () => ({ error: null }),
});
export const CardField = () => null;

export default {
  StripeProvider,
  useStripe,
  CardField,
};