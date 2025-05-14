import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView } from "react-native";
import styles from "./AdminSeeAllOrdersStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ordersData from "@/data/ordersData";
import Button from "@/components/commonComponents/Button";
import CurrencySymbol from "../../constants/CurrencySymbol";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";

const AdminSeeAllOrders = () => {
  const renderOrderItem = ({ item }) => {
    return (
      <>
        <View style={styles.eachOrderItem}>
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.justifyContentBetween,
              globalStyles.mb_1,
            ]}
          >
            <Text style={globalStyles.size_16}>{item.id}</Text>
            <Text style={globalStyles.size_16}>{item.time} ago</Text>
          </View>
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.justifyContentBetween,
              globalStyles.mb_3,
            ]}
          >
            <View>
              <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                {item.customer}
              </Text>
              <Text style={[globalStyles.size_16, globalStyles.fontWeight500]}>
                {CurrencySymbol} {item.amount}
              </Text>
            </View>
            <Text style={globalStyles.size_16}>
              Status:
              <Text
                style={[
                  globalStyles.size_16,
                  globalStyles.fontWeight500,
                  globalStyles.ml_1,
                ]}
              >
                {item.status}
              </Text>
            </Text>
          </View>
          <View
            style={[globalStyles.flexRow, globalStyles.justifyContentBetween]}
          >
            <Button
              onPress={() => {
                redirectToPage(containers.AdminOrderDetailScreen);
              }}
              title="View Details"
            />
            <Button
              onPress={() => {
                redirectToPage(containers.deliveryTrackingScreenScreen);
              }}
              title="Track Order"
            />
          </View>
        </View>
      </>
    );
  };
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={globalStyles.container}>
      <Header headerText="Orders" />
      <ScrollView>
        <View
          style={[
            globalStyles.sectionContent,
            globalStyles.pt_0,
            globalStyles.pb_0,
          ]}
        >
          <Text style={styles.heading}>
            WELCOME, Let's go through the orders details!
          </Text>
          <View style={styles.ordersContainer}>
            <FlatList
              data={[...ordersData]}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
    </SafeAreaView>
  );
};

export default AdminSeeAllOrders;
