import React, { useState } from "react"; // <-- Added useState import
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
import AdminFooter from "@/components/AdminFooter";
import { Ionicons } from "@expo/vector-icons";

const AdminSeeAllOrders = () => {
  const [activeFilter, setActiveFilter] = useState("All Orders");

  const statusFilters = ["All Orders", "Cancelled", "Replaced", "Returned"];

  const renderOrderItem = ({ item }: any) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
          redirectToPage(containers.AdminOrderDetailScreen);
        }}
        >
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
          <View style={{ flex: 1 }}>
            <View style={styles.idContainer}>
              <View style={{ flex: 1 }}>
                <Text style={[globalStyles.size_16, globalStyles.mb_1]}>
                  {item.customer}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.trackOrderText}>
                  Track Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      <View  style={{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={[globalStyles.size_16, globalStyles.fontWeight500]}>
            Total: {CurrencySymbol} {item.amount}
          </Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                localStyles.statusPill,
                item.status === "Pending"
                  ? localStyles.pending
                  : item.status === "Cancelled"
                  ? localStyles.cancelled
                  : item.status === "Delivered"
                  ? localStyles.delivered
                  : localStyles.defaultStatus,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
          {/* <View
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
          </View> */}
        </View>
      </TouchableOpacity>
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
            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder="Search orders..."
                placeholderTextColor={colors.placeholdergrey}
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.searchIcon}>
                <Ionicons name="search" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={localStyles.badgeContainer}>
              {statusFilters.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setActiveFilter(status)}
                  style={[
                    localStyles.badge,
                    {
                      backgroundColor:
                        activeFilter === status
                          ? colors.primary
                          : colors.secondary,
                    },
                  ]}
                >
                  <Text style={localStyles.badgeText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.heading}>
              WELCOME, Let's go through the orders details!
            </Text>
            <View style={styles.ordersContainer}>
              <FlatList
                data={
                  activeFilter === "All Orders"
                    ? ordersData
                    : ordersData.filter((item) => item.status === activeFilter)
                }
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </ScrollView>
        <AdminFooter activeTab="orders"/>
      </View>
    </SafeAreaView>
  );
};

export default AdminSeeAllOrders;

const localStyles = StyleSheet.create({
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  pending: {
    backgroundColor: "#FFE6A7",
    color: "#6D4C00",
  },
  cancelled: {
    backgroundColor: "#FFD6D9",
    color: "#B00020",
  },
  delivered: {
    backgroundColor: colors.lightGreen,
    color: "#006D3C",
  },
  defaultStatus: {
    backgroundColor: "#E0E0E0",
    color: "#333",
  },
  badgeContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 16,
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "500",
  },
});
