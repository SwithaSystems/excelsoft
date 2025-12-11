// StripeCardInput.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export const StripeCardInput = () => {
  useEffect(() => {
    // Debug: Check if element exists
    if (Platform.OS === "web") {
      setTimeout(() => {
        const element = document.getElementById("card-element");
        // console.log("Card element exists in DOM:", !!element);
        if (element) {
          // console.log("Card element classes:", element.className);
          // console.log("Card element children:", element.children.length);
        }
      }, 1000);
    }
  }, []);

  if (Platform.OS !== "web") {
    return null; // Don't render on mobile
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Card Details</Text>
      <Text >
        Enter your card information below
      </Text>
      <div style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#fff",
        minHeight: "44px",
        marginBottom: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}>
        {/* This is where Stripe will inject its card element */}
        <div 
          id="card-element"
          style={{
            minHeight: "20px",
          }}
        />
      </div>
      <div 
        id="card-errors" 
        role="alert"
        style={{
          color: "#fa755a",
          fontSize: "14px",
          marginTop: "4px",
          minHeight: "20px",
        }}
      />
      <Text style={styles.secureText}>
        🔒 Your payment is secure and encrypted
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  secureText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
});