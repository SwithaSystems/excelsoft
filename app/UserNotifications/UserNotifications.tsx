import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const UserNotifications = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={globalStyles.container}>
        <Header headerText="Notifications" />

        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style = {styles.emptyNotifContainer}>
            <Image
              source={require("assets/emptynotification.png")} 
              style={styles.bellIcon}
            />
          <Text style={styles.noNotificationText}>
            No Notifications yet
          </Text>
          <Text style={styles.subText}>
            You are all caught up! Check back some other time!
          </Text>
          </View>
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default UserNotifications;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  emptyNotifContainer:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 118,
  },
  iconBackground: {
    backgroundColor: "#C2F0F9",
    borderRadius: 60,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  bellIcon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  noNotificationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,    
    paddingTop: 16,
  },
  subText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});
