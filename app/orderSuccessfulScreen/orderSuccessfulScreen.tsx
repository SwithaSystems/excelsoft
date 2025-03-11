import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import styles from "./orderSuccessfulScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import { router } from "expo-router";

const orderSuccessfulScreen = () => {
  const isOrderPlacedSuccess = true;
  const successCartImg = require("../../assets/images/successCartImg.png");
  const failedCartImg = require("../../assets/images/failedCartImg.png");
  function redirectToOrderDetails() {
    router.replace({
      pathname: "/orderDetailsScreen/orderDetailsScreen",
    });
  }
  let handleRedirectTimeOut: any = null;
  useEffect(() => {
    handleRedirectTimeOut = setTimeout(redirectToOrderDetails, 5000);
  }, []);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        clearInterval(handleRedirectTimeOut);
        redirectToOrderDetails();
      }}
    >
      <View
        style={[
          styles.container,
          globalStyles.container,
          { paddingHorizontal: 20 },
        ]}
      >
        <Image
          source={isOrderPlacedSuccess ? successCartImg : failedCartImg}
          style={{}}
          alt={
            isOrderPlacedSuccess
              ? "Order placed successfull"
              : "Order placemewnt failed"
          }
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 48,
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          {isOrderPlacedSuccess
            ? "Order Placed Successfully!!!"
            : "Uh-oh. Something went wrong. Let’s go back and re-place the order"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default orderSuccessfulScreen;
