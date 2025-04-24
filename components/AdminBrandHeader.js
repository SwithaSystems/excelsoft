import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { redirectToPage } from "../utilities/redirectionHelper";
import containers from "../containers";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AdminBrandHeader() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user?.firstName || "User");
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../assets/brandlogo.png")}
        style={styles.logo}
      />

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.notificationWrapper}>
          <Ionicons name="notifications" size={24} color="#000" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileWrapper}
          onPress={() => {
            if (username) {
              redirectToPage(containers.userProfileScreenScreen);
            } else {
              redirectToPage(containers.signInScreen);
            }
          }}
        >
          <Ionicons name="person-circle-outline" size={32} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationWrapper: {
    marginRight: 14,
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  profileWrapper: {
    padding: 4,
  },
});

export default AdminBrandHeader;
