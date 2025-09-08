import { ADMIN_PRODUCT_DASHBOARD_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import Header from "../../components/Header";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import styles from "./AdminProductDashboardStyles";
import containers from "@/containers";
import colors from "../../../constants/colors";
import { ProductsAPI } from "@/services/productService";
import AdminFooter from "@/app/components/AdminFooter";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { categoryService } from "@/services/categoryService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import { debounce } from "lodash";

// Define Product interface
interface Product {
  id?: number | string;
  _id?: string;
  name: string;
  image: string[];
  categoryId: number[];
  netPrice: number;
  discount: number;
  stock: number;
  isVatApplicable: boolean;
  vatRate: number;
  vatAmount: number;
}

// Define API response interface
interface ApiResponse {
  data: Product[];
  total: number;
}

// Define Category interface
interface Category {
  id: number;
  name: string;
}

const AdminProductDashboard = () => {
  const [productsList, setAllProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const isLoadingMoreRef = useRef(false);

  const ITEMS_PER_PAGE = 50;
  const limit = 50;
  const fetchData = async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      console.log(`Fetching page ${pageNum}, isLoadMore: ${isLoadMore}`);
      const response = await ProductsAPI.getAllProducts(pageNum, limit);

      if (response && response.data) {
        const currentPageItemCount = response.data.length;
        const totalRecords = response.total;

        const totalFetchedSoFar = (pageNum - 1) * limit + currentPageItemCount;
        const hasMoreData = totalFetchedSoFar < totalRecords;

        console.log(`Page ${pageNum} fetched:`, {
          itemsReceived: currentPageItemCount,
          totalRecords,
          totalFetchedSoFar,
          hasMore: hasMoreData,
        });

        return {
          data: response.data,
          totalRecords: totalRecords,
          hasMore: hasMoreData,
          currentPage: pageNum,
        };
      }

      return {
        data: [],
        totalRecords: 0,
        hasMore: false,
        currentPage: pageNum,
      };
    } catch (err) {
      console.error(`Error fetching page ${pageNum}:`, err);
      throw err;
    }
  };

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(1, false); // Initial load, not loadMore
      console.log("Initial data loaded:", {
        itemCount: response.data.length,
        totalRecords: response.totalRecords,
      });

      setAllProductsList(response.data);
      setTotal(response.totalRecords);
      setHasMore(response.hasMore);
      setPage(2); // Next page to load
    } catch (err) {
      console.error("Failed to load initial data:", err);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (loadingMore || !hasMore || isLoadingMoreRef.current) {
      console.log("Load more blocked:", {
        loadingMore,
        hasMore,
        isLoadingMoreRef: isLoadingMoreRef.current,
      });
      return;
    }

    isLoadingMoreRef.current = true;

    try {
      setLoadingMore(true);
      console.log(`Loading more data - page ${page}...`);

      const response = await fetchData(page, true);
      console.log(`Page ${page} response:`, {
        itemsReceived: response.data.length,
        hasMore: response.hasMore,
        totalRecords: response.totalRecords,
      });

      // Filter out duplicates based on unique identifier
      setAllProductsList((prevData) => {
        const existingIds = new Set(
          prevData.map((item) => item._id || item.id)
        );
        const newItems = response.data.filter(
          (item) => !existingIds.has(item._id || item.id)
        );

        console.log(
          `Adding ${newItems.length} new items (${
            response.data.length - newItems.length
          } duplicates filtered)`
        );
        return [...prevData, ...newItems];
      });

      setHasMore(response.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error("Failed to load more data:", err);
      Alert.alert("Error", "Failed to load more data");
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  };

  const debouncedLoadMore = useCallback(
    debounce(() => {
      loadMoreData();
    }, 300),
    [loadMoreData]
  );

  useEffect(() => {
    console.log("Products list updated:", {
      totalItems: productsList.length,
      uniqueIds: new Set(productsList.map((p) => p._id || p.id)).size,
      hasDuplicates:
        productsList.length !==
        new Set(productsList.map((p) => p._id || p.id)).size,
    });
  }, [productsList]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    isLoadingMoreRef.current = false; // Reset the ref

    try {
      const response = await fetchData(1, false); // Reset, not loadMore
      console.log("Refresh data loaded:", {
        itemCount: response.data.length,
        totalRecords: response.totalRecords,
      });

      setAllProductsList(response.data);
      setTotal(response.totalRecords);
      setHasMore(response.hasMore);
      setPage(2);
    } catch (err) {
      console.error("Failed to refresh data:", err);
      Alert.alert("Error", "Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };
  const getUniqueKey = (item: Product, index: number) => {
    const id = item._id || item.id;
    return `product-${id}-${index}-${Date.now()}`;
  };
  const fetchAllCategories = useCallback(async () => {
    try {
      const data: Category[] = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const handleDeleteProduct = useCallback(
    (item: Product) => {
      Alert.alert(
        "Delete Product",
        "Are you sure you want to delete this product?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                setIsLoading(true);
                const result = await ProductsAPI.deleteProduct(item?._id);
                if (result) {
                  // Simply refresh the entire list instead of manual pagination
                  await onRefresh();
                  Alert.alert("Success", "Product deleted successfully");
                }
              } catch (error: any) {
                console.log("Delete error:", error?.response?.data);
                const errorMessage =
                  error?.response?.data?.message ||
                  "Something went wrong while deleting the product.";
                Alert.alert("Error", errorMessage);
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    },
    [onRefresh]
  );

  const ProductCard = useCallback(
    ({ item }: { item: Product }) => {
      const getStockBadge = (stock: number) => {
        if (stock === 0) {
          return { text: "Out of Stock", backgroundColor: colors.primaryRed };
        } else if (stock < 10) {
          return {
            text: "Low on Stock",
            backgroundColor: colors.primaryYellow,
          };
        } else {
          return { text: "In Stock", backgroundColor: colors.primaryGreen };
        }
      };

      const badge = getStockBadge(item.stock);

      return (
        <View style={[styles.card, { minHeight: 120 }]}>
          {" "}
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.alignItemsCenter,
              globalStyles.mb_3,
              { marginTop: 12 },
            ]}
          >
            <View>
              {item?.image[0] && (
                <Image source={{ uri: item?.image[0] }} style={styles.image} />
              )}
              {!item?.image[0] && (
                <Image
                  source={require("../../../assets/Placeholder.png")}
                  style={styles.image}
                />
              )}
            </View>
            <View style={[styles.details, { flex: 1, paddingRight: 4 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    styles.text,
                    styles.bold,
                    { flex: 1, marginRight: 16 },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  <TouchableOpacity
                    onPress={() =>
                      redirectToPage(containers.AdminProductUpdationScreen, {
                        item: JSON.stringify(item),
                      })
                    }
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      // const productId = item._id;
                      if (item) {
                        handleDeleteProduct(item);
                      }
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.text}>
                Category:{" "}
                {item.categoryId
                  ?.map((catId) => {
                    const matched = categories.find((cat) => cat.id === catId);
                    return matched ? matched.name : "Unknown";
                  })
                  .join(", ")}
              </Text>
              <Text style={styles.text}>£{item.netPrice} per unit</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Text style={styles.text}>{item.stock} units</Text>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 16,
                    backgroundColor: badge.backgroundColor,
                    marginLeft: 16,
                  }}
                >
                  <Text
                    style={{
                      color:
                        badge.backgroundColor === colors.primaryYellow
                          ? "black"
                          : "white",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {badge.text}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [categories]
  );

  const maxId = productsList.reduce((max: number, product: Product) => {
    return product.id && typeof product.id === "number" && product.id > max
      ? product.id
      : max;
  }, 0);

  // Ensure minimum height for FlatList to make it scrollable
  const windowHeight = Dimensions.get("window").height;

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={
        <Header headerText={ADMIN_PRODUCT_DASHBOARD_SCREEN_TITLE} />
      }
      footerComponent={<AdminFooter activeTab="products" />}
    >
      <View style={[globalStyles.pt_0, { paddingTop: 16, flex: 1 }]}>
        <Button
          onPress={() => {
            redirectToPage(containers.AdminProductUpdationScreen, {
              newProduct: true,
              maxId: maxId + 1,
              onGoBack: () => onRefresh(),
            });
          }}
          title="Add New Product"
        />

        <View style={{ marginTop: 16, flex: 1 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              color: colors.secondaryText,
            }}
          >
            Showing {productsList.length} of {total} products
          </Text>
          // Also add some debugging to your FlatList
          <FlatList
            data={productsList}
            renderItem={ProductCard}
            keyExtractor={getUniqueKey}
            onEndReached={debouncedLoadMore}
            onEndReachedThreshold={0.3}
            scrollEventThrottle={400}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListFooterComponent={() => {
              if (loadingMore) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 8, color: colors.secondaryText }}>
                      Loading more products...
                    </Text>
                  </View>
                );
              }
              return null;
            }}
            ListEmptyComponent={() => {
              if (!isLoading) {
                return (
                  <View style={{ padding: 40, alignItems: "center" }}>
                    <Text style={{ fontSize: 16, color: colors.secondaryText }}>
                      No products found
                    </Text>
                  </View>
                );
              }
              return null;
            }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            initialNumToRender={10}
            windowSize={5}
            contentContainerStyle={{
              paddingBottom: 100,
              flexGrow: 1,
            }}
          />
          {isLoading && (
            <View
              style={{
                position: "absolute",
                top: 50,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 8 }}>Loading products...</Text>
            </View>
          )}
        </View>
      </View>
    </PageLayout>
  );
};

export default AdminProductDashboard;
