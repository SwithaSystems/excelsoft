import React, { use, useEffect, useState } from "react"; // <-- Added useState import
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from "react-native";
import styles from "./AdminSeeAllOrdersStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "../../components/Header";
// import ordersData from "@/data/ordersData"; // Commented out static data
import CurrencySymbol from "../../../constants/CurrencySymbol";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "../../../constants/colors";
import AdminFooter from "@/app/components/AdminFooter";
import { Ionicons } from "@expo/vector-icons";
import { orderService } from "@/services/orderService";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { ADMIN_SEE_ALL_ORDERS_SCREEN_TITLE } from "../../../constants/stringLiterals";
import useDebounce from "@/utilities/customHooks/useDebounce";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import Pagination from "./componentsWeb/PaginationWeb";
import SearchBar from "@/app/components/searchBar";

const AdminSeeAllOrders = () => {
  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [allOrders, setAllOrders] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
          <View
            style={[
              styles.eachOrderItem,
              isTabOrDesktop ? styles.eachOrderItemWeb : null,
            ]}
          >
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
                      redirectToPage(containers.deliveryTrackingScreen, {
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
                      : item.status === "Delivered"
                      ? localStyles.delivered
                      : item.status === "Processed"
                      ? localStyles.processed
                      : item.status === "Pending"
                      ? localStyles.pending
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
    let filteredORders = allOrders;

    if (activeFilter !== "All Orders") {
      filteredORders = filteredORders.filter(
        (order: any) => order.status === activeFilter
      );
    }
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      const queryDigits = query.replace(/\D/g, "");
      filteredORders = filteredORders.filter((order: any) => {
        const orderNumberRaw = order.orderNumber ?? "";
        const orderNumberStr = orderNumberRaw.toString();
        const orderIdStr = (order._id ?? "").toString().toLowerCase();

        // Normalize common input formats like "ORD-123" or "#ORD-123"
        const ordTag = `ord-${orderNumberStr}`.toLowerCase();
        const hashOrdTag = `#ord-${orderNumberStr}`.toLowerCase();
        const orderNumDigits = orderNumberStr.replace(/\D/g, "");

        const orderMatches =
          // match pure digits against order number digits
          (queryDigits.length > 0 && orderNumDigits.includes(queryDigits)) ||
          // match textual tags against full query
          ordTag.includes(query) ||
          hashOrdTag.includes(query) ||
          // match objectId or alphanumeric id directly
          orderIdStr.includes(query);

        const customerName =
          typeof order.userId === "object" && order.userId?.firstName
            ? `${order.userId.firstName} ${order.userId.lastName || ""}`.trim()
            : "";
        const customerMatches = customerName.toLowerCase().includes(query);

        const statusMatches = order.status
          ? order.status.toLowerCase().includes(query)
          : false;

        const totalAmount =
          typeof order.totalAmount === "number" ? order.totalAmount : "0";

        const amountMatches = totalAmount.toString().includes(queryDigits || query);
        return (
          orderMatches || customerMatches || statusMatches || amountMatches
        );
      });
    }
    return filteredORders;
  };

  // Pagination for desktop/tablet grid
  const ITEMS_PER_PAGE = isTabOrDesktop ? 9 : 50;
  const filteredOrders = getFilteredOrders();
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = isTabOrDesktop
    ? filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : filteredOrders;

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb hideUserGreeting = {true}/>
  ) : (
    <Header headerText={ADMIN_SEE_ALL_ORDERS_SCREEN_TITLE} />
  );

  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <AdminFooter activeTab="orders" />;


  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isTabOrDesktop}
      scrollable={isTabOrDesktop ? false : true}
      hideNavItems={true}
    >
      <View style={[globalStyles.pt_0, globalStyles.pb_0]}>
        {!isTabOrDesktop && (
          <View>
            <SearchBar
              placeholder="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {}}
              onPress={() => {}}
            />
          </View>
        )}
        {isTabOrDesktop && (
          <View style={{ marginTop: 16, marginBottom: 8 }}>
            <SearchBar
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={setSearchQuery}
              onSubmitEditing={() => {}}
              onPress={() => {}}
              widthPercent={35}
              height={40}
          />
        </View>
        )}

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

        {isTabOrDesktop ? (
          <View style={localStyles.columnsRow}>
            {/* Order Placed */}
            <View style={localStyles.column}>
              <Text style={localStyles.columnTitle}>Order Placed</Text>
              <FlatList
                data={filteredOrders.filter((o: any) =>
                  ["Order Placed", "OrderPlaced"].includes(o.status)
                )}
                renderItem={renderOrderItem}
                keyExtractor={(item) => String(item._id)}
                contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
              />
            </View>

            {/* Pending */}
            <View style={localStyles.column}>
              <Text style={localStyles.columnTitle}>Pending</Text>
              <FlatList
                data={filteredOrders.filter((o: any) => o.status === "Pending")}
                renderItem={renderOrderItem}
                keyExtractor={(item) => String(item._id)}
                contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
              />
            </View>

            {/* Completed (Delivered/Processed) */}
            <View style={localStyles.column}>
              <Text style={localStyles.columnTitle}>Completed</Text>
              <FlatList
                data={filteredOrders.filter((o: any) =>
                  ["Delivered", "Processed", "Completed"].includes(o.status)
                )}
                renderItem={renderOrderItem}
                keyExtractor={(item) => String(item._id)}
                contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
              />
            </View>

            {/* Cancelled */}
            <View style={localStyles.column}>
              <Text style={localStyles.columnTitle}>Cancelled</Text>
              <FlatList
                data={filteredOrders.filter((o: any) => o.status === "Cancelled")}
                renderItem={renderOrderItem}
                keyExtractor={(item) => String(item._id)}
                contentContainerStyle={{ gap: 16, paddingVertical: 8 }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            <FlatList
              data={paginatedData}
              renderItem={renderOrderItem}
              keyExtractor={(item) => String(item._id)}
              ListEmptyComponent={
                <View style={localStyles.emptyContainer}>
                  <Text style={localStyles.emptyText}>
                    No orders found for "{activeFilter}"
                  </Text>
                </View>
              }
            />
          </View>
        )}
      </View>
      {/* </ScrollView>
        <AdminFooter activeTab="orders" />
      </View>
    </SafeAreaView> */}
    </LayoutComponent>
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
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
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
    backgroundColor: colors.secondaryYellow,
    color: colors.primaryRed,
  },
  returned: {
    backgroundColor: colors.secondaryPurple,
    color: colors.primaryPurple,
  },
  delivered: {
    backgroundColor: colors.secondaryGreen,
    color: colors.primaryGreen,
  },
  processed: {
    backgroundColor: colors.infoBg,
    color: colors.infoText,
  },
  pending: {
    backgroundColor: colors.secondaryYellow,
    color: colors.primaryYellow,
  },
  defaultStatus: {
    backgroundColor: colors.placeholdergrey,
    color: colors.black,
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
  // Web/tablet 4-column layout
  columnsRow: {
    flexDirection: "row",
    gap: 16,
  },
  column: {
    flex: 1,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
});
