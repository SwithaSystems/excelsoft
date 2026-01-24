import React from 'react';
import { View } from 'react-native';

interface PaymentRequestButtonProps {
  paymentRequest?: any;
  onPaymentMethod?: (event: any) => void;
  style?: any;
}

const PaymentRequestButton: React.FC<PaymentRequestButtonProps> = () => {
  // Payment Request Button is not available on mobile
  // Mobile uses native Apple Pay/Google Pay instead
  return null;
};

export default PaymentRequestButton;