import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./AdminOrderTrackingStyles";
import OrderTimeline from "../deliveryTrackingScreen/components/OrderTimeline";
import { Button } from "react-native-elements";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const AdminOrderTracking = () => {
  const orderStatus = [
    "Order Recieved",
    "Order Packed",
    "Out for delivery",
    "Reached the Location",
    "Order Delivered Successully!!",
  ];

  return (
    <View style={styles.container}>
      <Header headerText="Order Tracking" />
      <ScrollView>
          <View style={styles.userDetails}>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                OrderID:
              </Text>
              <Text style={styles.orderdetails}>
                #ORD-7529
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Customer Name:
              </Text>
              <Text style={styles.orderdetails}>
                Emma Thompson
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Pickup Choice:
              </Text>
              <Text style={styles.orderdetails}>
                Home Delivery
              </Text>
            </View>
            <View style={styles.details}>
              <Text style={styles.subHeading}>
                Address:
              </Text>
              <Text style={styles.orderdetails}>
                H.No: 1-123, xyz street, that town, near mellinda cafe, ik, 123445.
              </Text>
            </View>
          </View>
          
          <View style={styles.trackingContainer}>
            <OrderTimeline statusList={orderStatus} />
          </View>
          <TouchableOpacity style={styles.requestButton}
            onPress={() => {
              redirectToPage(containers.returnOrderScreen);
            }}
            >
              <Text style = {styles.buttonText}>View Order Details</Text>
            </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AdminOrderTracking;
