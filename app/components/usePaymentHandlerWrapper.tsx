// usePaymentHandlerWrapper.ts
import { Platform } from "react-native";

// Import both implementations at the top level
let usePaymentHandlerWeb: any;
let usePaymentHandlerMobile: any;

if (Platform.OS === "web") {
  usePaymentHandlerWeb = require("./usePaymentHandlerWeb").default;
} else {
  const mobileModule = require("./usePaymentHandler");
  usePaymentHandlerMobile = mobileModule.usePaymentHandler;
}

// Wrapper hook that uses the correct implementation
export const usePaymentHandler = () => {
  // console.log("usePaymentHandler wrapper called, platform:", Platform.OS);
  
  if (Platform.OS === "web") {
    // console.log("Using web payment handler");
    return usePaymentHandlerWeb();
  } else {
    // console.log("Using mobile payment handler");
    return usePaymentHandlerMobile();
  }
};

export default usePaymentHandler;