import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import colors from "@/app/config/colors";

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
          size={24}
          color={activeTab.toLowerCase() === "home" ? colors.primary : "#666"}
        />
        <Text
          style={{
            fontSize: 10,
            color: activeTab.toLowerCase() == "home" ? colors.primary : "#666",
          }}
        >
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
          size={24}
          color={activeTab.toLowerCase() === "orders" ? colors.primary : colors.iconBlack}
        />
        <Text 
            style={{
                fontSize:10,
                color: activeTab.toLowerCase()=="orders"?colors.primary:colors.iconBlack
            }}
            >
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
          size={24}
          color={activeTab.toLowerCase() === "products" ? colors.primary : colors.iconBlack}
        />
       <Text 
            style={{
                fontSize:10,
                color: activeTab.toLowerCase()=="products"?colors.primary:colors.iconBlack
            }}
            >
          Products
        </Text>
      </TouchableOpacity>

      {/* Scan & Deliver Button */}
      <TouchableOpacity
        style={styles.footerTab}
        onPress={() => redirectToPage(containers.AdminOrderQRScanScreen)}
      >
        <Ionicons
          name="gift"
          size={24}
          color={activeTab.toLowerCase() === "scan & deliver" ? colors.primary : colors.iconBlack}
        />
       <Text 
            style={{
                fontSize:10,
                color: activeTab.toLowerCase()=="scan & deliver" ? colors.primary : colors.iconBlack
            }}
            >
          Scan & Deliver
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
   flexDirection: "row",
       backgroundColor: colors.white,
       paddingVertical: 8,
       borderTopWidth: 1,
       justifyContent: "space-around",
       alignItems: "center",
       borderTopColor: colors.placeholdergrey,
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
