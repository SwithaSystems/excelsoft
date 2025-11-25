// DebugPaymentTest.tsx
// Add this temporarily to your OrderSummary screen to debug

import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import { usePaymentHandler } from '@/app/components/usePaymentHandlerWrapper';

export const DebugPaymentTest = () => {
  const paymentHandler = usePaymentHandler();
  const [cardElementStatus, setCardElementStatus] = useState('checking...');

  useEffect(() => {
    console.log("=== PAYMENT HANDLER DEBUG ===");
    console.log("Platform:", Platform.OS);
    console.log("Payment handler object:", paymentHandler);
    console.log("Has handlePayment:", typeof paymentHandler?.handlePayment);
    
    if (Platform.OS === 'web') {
      console.log("Stripe ready:", paymentHandler?.isStripeReady);
      console.log("Has stripe:", !!paymentHandler?.stripe);
      console.log("Has cardElement:", !!paymentHandler?.cardElement);
    }

    // Check if card element exists in DOM
    if (Platform.OS === 'web') {
      const checkCardElement = () => {
        const cardElement = document.getElementById('card-element');
        const hasElement = !!cardElement;
        const hasIframe = cardElement?.querySelector('iframe');
        
        console.log("=== CARD ELEMENT CHECK ===");
        console.log("Card element exists:", hasElement);
        console.log("Has iframe (Stripe mounted):", !!hasIframe);
        
        if (cardElement) {
          console.log("Card element HTML:", cardElement.innerHTML.substring(0, 200));
          console.log("Card element children:", cardElement.children.length);
        }
        
        setCardElementStatus(
          hasIframe ? '✓ Ready' : hasElement ? '⚠ Not mounted' : '✗ Missing'
        );
      };

      // Check immediately and after delays
      setTimeout(checkCardElement, 500);
      setTimeout(checkCardElement, 2000);
      setTimeout(checkCardElement, 5000);
    }
  }, [paymentHandler]);

  const testCardElement = () => {
    if (Platform.OS !== 'web') return;
    
    const cardElement = document.getElementById('card-element');
    console.log("=== MANUAL CARD ELEMENT TEST ===");
    console.log("Element:", cardElement);
    console.log("Parent:", cardElement?.parentElement);
    console.log("Computed style:", cardElement ? window.getComputedStyle(cardElement) : 'N/A');
    
    if (paymentHandler?.cardElement) {
      console.log("Card element object exists in hook");
      // Try to focus the card element
      try {
        (paymentHandler.cardElement as any).focus();
        console.log("Successfully focused card element");
      } catch (e) {
        console.error("Failed to focus:", e);
      }
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0', margin: 10, borderRadius: 8 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>
        🔍 Debug Payment Info:
      </Text>
      <Text>Platform: {Platform.OS}</Text>
      <Text>Has Payment Handler: {paymentHandler ? '✓' : '✗'}</Text>
      <Text>Has handlePayment: {paymentHandler?.handlePayment ? '✓' : '✗'}</Text>
      {Platform.OS === 'web' && (
        <>
          <Text>Stripe Ready: {paymentHandler?.isStripeReady ? '✓' : '✗'}</Text>
          <Text>Has Stripe Instance: {paymentHandler?.stripe ? '✓' : '✗'}</Text>
          <Text>Has Card Element: {paymentHandler?.cardElement ? '✓' : '✗'}</Text>
          <Text>Card Element DOM: {cardElementStatus}</Text>
        </>
      )}
      <View style={{ marginTop: 10 }}>
        <Button title="Test Card Element" onPress={testCardElement} />
      </View>
    </View>
  );
};