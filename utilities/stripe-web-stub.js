// Stripe web stub - empty implementations for web platform only
// Real Stripe will work on iOS/Android

export const StripeProvider = ({ children }) => children;

export const CardField = () => null;
export const CardForm = () => null;
export const ApplePayButton = () => null;
export const GooglePayButton = () => null;
export const AuBECSDebitForm = () => null;
export const PaymentSheet = () => null;

export const useStripe = () => ({
  confirmPayment: async () => ({ error: { message: 'Stripe not available on web' } }),
  createPaymentMethod: async () => ({ error: { message: 'Stripe not available on web' } }),
  retrievePaymentIntent: async () => ({ error: { message: 'Stripe not available on web' } }),
  confirmSetupIntent: async () => ({ error: { message: 'Stripe not available on web' } }),
  createToken: async () => ({ error: { message: 'Stripe not available on web' } }),
  handleCardAction: async () => ({ error: { message: 'Stripe not available on web' } }),
});

export const useConfirmPayment = () => ({
  confirmPayment: async () => ({ error: { message: 'Stripe not available on web' } }),
});

export const initStripe = async () => {
  console.log('Stripe initialization skipped on web');
};

export const initPaymentSheet = async () => ({
  error: { message: 'Stripe not available on web' },
});

export const presentPaymentSheet = async () => ({
  error: { message: 'Stripe not available on web' },
});

export default {
  StripeProvider,
  CardField,
  CardForm,
  ApplePayButton,
  GooglePayButton,
  useStripe,
  useConfirmPayment,
  initStripe,
  initPaymentSheet,
  presentPaymentSheet,
};