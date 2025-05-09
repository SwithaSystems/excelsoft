import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import OrderTimeline from "./components/OrderTimeline";
import styles from "./deliveryTrackingScreenStyles";
import Footer from "@/components/Footer";
import { router } from "expo-router";
import colors from "../config/colors";

const deliveryTrackingScreen = () => {
  const orderStatus = [
    "Order Placed",
    "Order Packed",
    "Out for delivery",
    "Reached the Location",
    "Order Delivered Successully!!",
  ];

  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={[globalStyles.container]}>
      <Header headerText="Order Tracking" />
      <ScrollView>
        <View style={[globalStyles.sectionContent]}>
          <Text style={styles.headingNote}>
            Your Order packed Successfully!! Let’s see the Progress!
          </Text>
          <View style={styles.trackingContainer}>
            <OrderTimeline statusList={orderStatus} />
          </View>
        </View>
      </ScrollView>
      <Footer navigation={router} />
    </View>
    </SafeAreaView>
  );
};

export default deliveryTrackingScreen;
