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
  const successCartImg = require("../../assets/images/successCartImg.png");
  const failedCartImg = require("../../assets/images/failedCartImg.png");

  function redirectToOrderDetails() {
    // router.replace({
    //   pathname: "/orderDetailsScreen/orderDetailsScreen",
    //   params: { orderData },
    // });

    redirectToPage(containers.orderDetailsScreenScreen, {
      orderData: orderData,
    });
  }

  useEffect(() => {
    const handleRedirectTimeOut = setTimeout(redirectToOrderDetails, 5000);
    return () => clearTimeout(handleRedirectTimeOut);
  }, []);

  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
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
            : "Uh-oh. Something went wrong. Let’s go back and re-place the order"}
        </Text>
      </View>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default orderSuccessfulScreen;
