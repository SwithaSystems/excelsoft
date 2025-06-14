import React, { use, useEffect, useState } from "react"; // <-- Added useState import
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import styles from "./AdminSeeAllOrdersStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
// import ordersData from "@/data/ordersData"; // Commented out static data
import CurrencySymbol from "../../constants/CurrencySymbol";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../config/colors";
import AdminFooter from "@/components/AdminFooter";
import { Ionicons } from "@expo/vector-icons";
import { orderService } from "@/services/orderService";
import PageLayout from "../pageLayoutProps";
import { ADMIN_SEE_ALL_ORDERS_SCREEN_TITLE } from "../config/stringLiterals";

const AdminSeeAllOrders = () => {
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [allOrders, setAllOrders] = useState<any>([]);

  const statusFilters = ["All Orders", "Cancelled", "Replaced", "Returned"];

  const getAllOrders = async () => {
    const allorders = await orderService.getAllOrders();
    setAllOrders(allorders);
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  // Helper function to format date/time ago
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderDate = new Date(dateString);
    const diffInMs = now.getTime() - orderDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
    }
  };

  const renderOrderItem = ({ item }: any) => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            redirectToPage(containers.AdminOrderDetailScreen, {
              orderId: item._id,
            });
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
              <Text style={globalStyles.size_16}>
                #ORD-{item.orderNumber || item._id || "N/A"}
              </Text>
              <Text style={globalStyles.size_16}>
                {getTimeAgo(item.createdAt)} ago
              </Text>
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
                      {typeof item.userId === "object" && item.userId?.firstName
                        ? `${item.userId.firstName} ${
                            item.userId.lastName || ""
                          }`.trim()
                        : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      redirectToPage(containers.deliveryTrackingScreenScreen, {
                        from: "admin",
                        orderId: item._id,
                      });
                    }}
                  >
                    <Text style={styles.trackOrderText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={[globalStyles.size_16, globalStyles.fontWeight500]}>
                Total: {CurrencySymbol}{" "}
                {typeof item.totalAmount === "number"
                  ? item.totalAmount.toFixed(2)
                  : "0.00"}
              </Text>
              <View style={styles.statusContainer}>
                <Text
                  style={[
                    localStyles.statusPill,
                    item.status === "Cancelled"
                      ? localStyles.cancelled
                      : item.status === "Replaced"
                      ? localStyles.replaced
                      : item.status === "Returned"
                      ? localStyles.returned
                      : localStyles.defaultStatus,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  // Filter orders based on active filter
  const getFilteredOrders = () => {
    if (activeFilter === "All Orders") {
      return allOrders;
    }
    return allOrders.filter((order: any) => order.status === activeFilter);
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    //   <View style={globalStyles.container}>
    //     <Header headerText="Orders" />
    //     <ScrollView>
    <PageLayout
      hasHeader
      hasFooter
      scrollable
      headerComponent={
        <Header headerText={ADMIN_SEE_ALL_ORDERS_SCREEN_TITLE} />
      }
      footerComponent={<AdminFooter activeTab="orders" />}
    >
      <View
        style={[
          // globalStyles.sectionContent,
          globalStyles.pt_0,
          globalStyles.pb_0,
        ]}
      >
        <View style={localStyles.searchBarContainer}>
          <TextInput
            placeholder="Search orders..."
            placeholderTextColor={colors.placeholdergrey}
            style={localStyles.searchInput}
          />
          <TouchableOpacity style={localStyles.searchIcon}>
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
                    activeFilter === status ? colors.primary : colors.secondary,
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
            data={getFilteredOrders()}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={
              <View style={localStyles.emptyContainer}>
                <Text style={localStyles.emptyText}>
                  No orders found for "{activeFilter}"
                </Text>
              </View>
            }
          />
        </View>
      </View>
      {/* </ScrollView>
        <AdminFooter activeTab="orders" />
      </View>
    </SafeAreaView> */}
    </PageLayout>
  );
};

export default AdminSeeAllOrders;

const localStyles = StyleSheet.create({
  // Cross-platform search bar styles
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 25,
    // marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: colors.lightgrey,
    minHeight: Platform.OS === "ios" ? 50 : 44,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    paddingHorizontal: 0,
    minHeight: Platform.OS === "ios" ? 40 : 36,
    textAlignVertical: "center",
    lineHeight: Platform.OS === "ios" ? 20 : undefined,
  },

  searchIcon: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

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
  orderPlaced: {
    backgroundColor: colors.infoBg,
    color: colors.infoText,
  },
  cancelled: {
    backgroundColor: colors.errorBg,
    color: colors.errorText,
  },
  replaced: {
    backgroundColor: colors.warningBg,
    color: colors.warningText,
  },
  returned: {
    backgroundColor: colors.subtlePurpleBg,
    color: colors.subtlePurpleText,
  },
  defaultStatus: {
    backgroundColor: colors.Gray88,
    color: colors.darkCharcoal,
  },

  badgeContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 16,
    gap: 4,
    flexWrap: "wrap",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: colors.placeholdergrey,
    textAlign: "center",
  },
});
