import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import styles from "./orderSuccessfulScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useLocalSearchParams, router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";

const orderSuccessfulScreen = () => {
  const { orderData } = useLocalSearchParams();
  console.log("orderData", orderData);
  const isOrderPlacedSuccess = true;
  const successCartImg = require("../../assets/checkmark.png");
  const failedCartImg = require("../../assets/cancel.png");

  function redirectToOrderDetails() {
    // router.replace({
    //   pathname: "/orderDetailsScreen/orderDetailsScreen",
    //   params: { orderData },
    // });

    redirectToPage(containers.orderDetailsScreenScreen, {
      orderData: orderData,
      //from: 'cart',
    });
  }

  useEffect(() => {
    const handleRedirectTimeOut = setTimeout(redirectToOrderDetails, 5000);
    return () => clearTimeout(handleRedirectTimeOut);
  }, []);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <TouchableWithoutFeedback onPress={redirectToOrderDetails}>
      <View
        style={[
          styles.container,
          globalStyles.container,
          { paddingHorizontal: 20 },
        ]}
      >
        <Image
          source={isOrderPlacedSuccess ? successCartImg : failedCartImg}
          style={{height:325, width: 325}}
          alt={
            isOrderPlacedSuccess
              ? "Order placed successfull"
              : "Order placement failed"
          }
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 48,
            fontSize: 24,
            fontWeight: "600",
          }}
        >
          {isOrderPlacedSuccess
            ? "Order Placed Successfully!!!"
            : "Sorry, something went wrong. Please go back and try placing your order again"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default orderSuccessfulScreen;
