import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { StripePaymentRequestButtonElement } from '@stripe/stripe-js';

interface PaymentRequestButtonProps {
  paymentRequest: any;
  onReady?: () => void;
  style?: any;
}

export const PaymentRequestButton: React.FC<PaymentRequestButtonProps> = ({
  paymentRequest,
  onReady,
  style,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<StripePaymentRequestButtonElement | null>(null);

  useEffect(() => {
    if (!paymentRequest || !buttonRef.current) return;

    // Create the Payment Request Button element
    const elements = paymentRequest._stripeInstance?.elements();
    if (!elements) return;

    const prButton = elements.create('paymentRequestButton', {
      paymentRequest,
    });

    // Mount the button
    prButton.mount(buttonRef.current);
    elementRef.current = prButton;

    if (onReady) {
      onReady();
    }

    return () => {
      prButton.unmount();
    };
  }, [paymentRequest, onReady]);

  return (
    <View style={[styles.container, style]}>
      <div ref={buttonRef} style={{ width: '100%' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
});