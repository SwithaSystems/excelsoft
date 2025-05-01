import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styles from "./NotificationListingStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import { Ionicons } from "@expo/vector-icons";

const NotificationListing = () => {
  const notifications = [
    {
      id: "1",
      message: "Aleesha",
    },
    {
      id: "2",
      message: "New Order on your dashboard! Let's Check and process the order",
    },
    {
      id: "3",
      message:
        "Congratulations! Emma Thompson #order-7547 have been delivered successfully!",
    },
    {
      id: "4",
      message:
        "#Order-7547 submitted a request for replacing her strawberry juice order! Check it out!",
    },
    {
      id: "5",
      message: "Your discount price is gonna expire! Do you want to renew it?",
    },
  ];
  const NotificationItem = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.message}</Text>
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="close-outline" size={32} color="gray" />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={globalStyles.container}>
      <Header headerText="Notifications" />
      {/* <ScrollView> */}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
              <View style={[globalStyles.flexRowReverse, globalStyles.mb_3]}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={globalStyles.btnSmUnderLine}>Clear all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.notificationContainer}>
                <FlatList
                  data={notifications}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <NotificationItem item={item} />}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  nestedScrollEnabled={true}
                />
              </View>
            </View>
          </>
        }
        data={[]}
        renderItem={() => null}
      />
      {/* </ScrollView> */}
    </View>
  );
};

export default NotificationListing;
