import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";

const AdminFooter = ({ activeTab = "" }: any) => {

  const isActive = (tabName: string) => activeTab.toLowerCase() === tabName;

  return (
    <View style={styles.footer}>

      {/* Home Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.AdminDashboardScreen)}
      >
        <Ionicons
          name="home"
          size={28}
          color={isActive("home") ? "#000" : "#222"}
        />
        <Text style={[styles.label, isActive("home") && styles.activeLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Orders Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.AdminSeeAllOrdersScreen)}
      >
        <Ionicons
          name="clipboard"
          size={28}
          color={isActive("orders") ? "#000" : "#222"}
        />
        <Text style={[styles.label, isActive("orders") && styles.activeLabel]}>
          Orders
        </Text>
      </TouchableOpacity>

      {/* Product Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.AdminProductDashboardScreen)}
      >
        <Ionicons
          name="cube"
          size={28}
          color={isActive("product") ? "#000" : "#222"}
        />
        <Text style={[styles.label, isActive("product") && styles.activeLabel]}>
          Product
        </Text>
      </TouchableOpacity>

      {/* Scan & Deliver Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.AdminOrderQRScanScreen)}
      >
        <Ionicons
          name="gift"
          size={28}
          color={isActive("scan") ? "#000" : "#222"}
        />
        <Text style={[styles.label, isActive("scan") && styles.activeLabel]}>
          Scan & Deliver
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    backgroundColor: "#CEF1F9",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerTab: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
    color: "#222",
  },
  activeLabel: {
    color: "#000",
  },
});

export default AdminFooter;
