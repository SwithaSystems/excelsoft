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
import { Product, ProductsAPI } from "@/services/productService";
import AdminFooter from "@/app/components/AdminFooter";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { categoryService } from "@/services/categoryService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import useDebounce from "@/utilities/customHooks/useDebounce";
import axios from "axios";
import SearchBar from "@/app/components/searchBar";
import { showErrorAlert } from "@/utilities/showErrorAlert";
import { SEARCH_QUERY_REQUIRED_MESSAGE } from "@/constants/customErrorMessages";
import ModalSelector from "react-native-modal-selector";

// Define Product interface
// interface Product {
//   id?: number | string;
//   _id?: string;
//   name: string;
//   image: string[];
//   categoryId: number[];
//   netPrice: number;
//   discount: number;
//   stock: number;
//   isVatApplicable: boolean;
//   vatRate: number;
//   vatAmount: number;
// }

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
  const [productsList, setAllProductsList] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [allCategories, setAllCategories] = useState<any>([]);
  const [selectCategory, setSelectCategory] = useState("");

  // Use refs to prevent multiple simultaneous requests
  const loadingMoreRef = useRef(false);
  const lastPageLoadedRef = useRef(0);

  const ITEMS_PER_PAGE = 50;

  async function getallCategories() {
    try {
      const categories = await categoryService.getAllCategories();
      if (categories) {
        setAllCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }
  useEffect(() => {
    getallCategories();
  }, []);
  const category_Products = productsList.filter((product: any) =>
    selectCategory && selectCategory !== ""
      ? product.categoryId?.map(String).includes(String(selectCategory))
      : true
  );
  const productsListToShow =
    selectCategory && selectCategory !== "" ? category_Products : productsList;

  const fetchData = async (
    page: number
  ): Promise<{
    data: Product[];
    total: number;
    hasMore: boolean;
  }> => {
    try {
      console.log(`Fetching page ${page}`);
      const response = await ProductsAPI.getAllProducts(page, ITEMS_PER_PAGE);

      if (response && response.data) {
        const totalFetched = (page - 1) * ITEMS_PER_PAGE + response.data.length;
        const hasMoreData = totalFetched < response.total;

        console.log(`Page ${page} response:`, {
          itemsReceived: response.data.length,
          totalRecords: response.total,
          totalFetched,
          hasMore: hasMoreData,
        });

        return {
          data: response.data,
          total: response.total,
          hasMore: hasMoreData,
        };
      }

      return {
        data: [],
        total: 0,
        hasMore: false,
      };
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      throw error;
    }
  };

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        if (debouncedQuery.length === 0) {
          loadInitialData(); // Reload all products when search is cleared
        }
        return;
      }

      // For suggestions (keep existing logic)
      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      try {
        const response = await axios.get(
          `${API_URL}/products/suggestions/search?q=${debouncedQuery}`
        );
        const results = response.data;
        const uniqueResults = [...new Set(results)].slice(0, 6);
        setSuggestions(uniqueResults as string[]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }

      // Optionally perform real-time search (uncomment if you want search-as-you-type)
      // await searchProductsByName(debouncedQuery);
    };

    performSearch();
  }, [debouncedQuery]);

  // Load initial data
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(1);

      setAllProductsList(response.data);
      setTotalProducts(response.total);
      setHasMore(response.hasMore);
      setCurrentPage(1);
      lastPageLoadedRef.current = 1;

      console.log("Initial data loaded:", {
        itemCount: response.data.length,
        total: response.total,
      });
    } catch (error) {
      console.error("Failed to load initial data:", error);
      Alert.alert("Error", "Failed to load products");
      setAllProductsList([]);
      setTotalProducts(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more data for pagination
  const loadMoreData = async () => {
    // Prevent multiple simultaneous requests
    if (loadingMoreRef.current || isLoadingMore || !hasMore || isLoading) {
      console.log("Load more blocked:", {
        loadingMoreRef: loadingMoreRef.current,
        isLoadingMore,
        hasMore,
        isLoading,
      });
      return;
    }

    const nextPage = lastPageLoadedRef.current + 1;
    console.log(`Loading more data - page ${nextPage}`);

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const response = await fetchData(nextPage);

      if (response.data.length > 0) {
        // Filter out duplicates based on unique identifier
        setAllProductsList((prevProducts: any) => {
          const existingIds = new Set(
            prevProducts.map((item: any) => item._id || item.id)
          );

          const newItems = response.data.filter(
            (item) => !existingIds.has(item._id || item.id)
          );

          console.log(
            `Adding ${newItems.length} new items (${
              response.data.length - newItems.length
            } duplicates filtered)`
          );
          return [...prevProducts, ...newItems];
        });

        lastPageLoadedRef.current = nextPage;
        setCurrentPage(nextPage);
      }

      setTotalProducts(response.total);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to load more data:", error);
      Alert.alert("Error", "Failed to load more products");
    } finally {
      setIsLoadingMore(false);
      loadingMoreRef.current = false;
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setIsRefreshing(true);

    // Reset pagination state
    setCurrentPage(1);
    setHasMore(true);
    loadingMoreRef.current = false;
    lastPageLoadedRef.current = 0;

    try {
      const response = await fetchData(1);

      setAllProductsList(response.data);
      setTotalProducts(response.total);
      setHasMore(response.hasMore);
      setCurrentPage(1);
      lastPageLoadedRef.current = 1;

      console.log("Data refreshed:", {
        itemCount: response.data.length,
        total: response.total,
      });
    } catch (error) {
      console.error("Failed to refresh data:", error);
      Alert.alert("Error", "Failed to refresh products");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch categories
  const fetchAllCategories = useCallback(async () => {
    try {
      const data: Category[] = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadInitialData();
    fetchAllCategories();
  }, [fetchAllCategories]);

  // Handle product deletion
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
                  await onRefresh(); // Refresh the entire list
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

  // Generate unique key for FlatList items
  const getUniqueKey = useCallback((item: Product, index: number) => {
    const id = item._id || item.id;
    return `product-${id}-${index}`;
  }, []);

  // Product card component
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

      const badge = item.stock !== undefined ? getStockBadge(item.stock) : null;

      return (
        <View style={[styles.card, { minHeight: 120 }]}>
          <View
            style={[
              globalStyles.flexRow,
              globalStyles.alignItemsCenter,
              globalStyles.mb_3,
              { marginTop: 12 },
            ]}
          >
            <View>
              {item?.image[0] ? (
                <Image source={{ uri: item?.image[0] }} style={styles.image} />
              ) : (
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
                  <TouchableOpacity onPress={() => handleDeleteProduct(item)}>
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
                    backgroundColor: badge?.backgroundColor,
                    marginLeft: 16,
                  }}
                >
                  <Text
                    style={{
                      color:
                        badge?.backgroundColor === colors.primaryYellow
                          ? "black"
                          : "white",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    {badge?.text}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    },
    [categories, handleDeleteProduct]
  );

  // Calculate max ID for new products
  const maxId = productsList.reduce((max: number, product: Product) => {
    return product.id && typeof product.id === "number" && product.id > max
      ? product.id
      : max;
  }, 0);

  // Handle end reached with proper throttling
  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading) {
      loadMoreData();
    }
  }, [isLoadingMore, hasMore, isLoading]);

  const searchProductsByName = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await ProductsAPI.productsBy_Name_Id(query);
      console.log("Search response:", response);

      if (response) {
        setAllProductsList(response);
        setTotalProducts(response.length);
        setHasMore(false);
        setCurrentPage(1);
        lastPageLoadedRef.current = 1;
      }
    } catch (error) {
      console.error("Error searching products:", error);
      Alert.alert("Error", "Failed to search products");
      setAllProductsList([]);
      setTotalProducts(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      showErrorAlert({
        title: "Nothing to Search",
        message: SEARCH_QUERY_REQUIRED_MESSAGE,
      });
      return;
    }

    await searchProductsByName(searchQuery.trim());
  }, [searchQuery]);

  // Add a clear search function:
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      if (productsList.length !== totalProducts || currentPage === 1) {
        loadInitialData();
      }
    }
  }, [searchQuery]);

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable={false}
      headerComponent={
        <Header headerText={ADMIN_PRODUCT_DASHBOARD_SCREEN_TITLE} />
      }
      footerComponent={<AdminFooter activeTab="products" />}
    >
      <View style={[globalStyles.pt_0, { paddingTop: 16, flex: 1 }]}>
        <View>
          <SearchBar
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onPress={handleSearch}
          />
        </View>
        <View>
          <ModalSelector
            data={[
              { key: "", label: "None (Show All)", value: "" },
              ...allCategories.map((cat: any) => ({
                key: cat.id,
                label: cat.name,
                value: cat.id,
              })),
            ]}
            initValue="Select Category"
            selectedKey={selectCategory}
            onChange={(option) => {
              setSelectCategory(option.value);
              console.log(
                "Selected category:",
                option.value || "None - Show All"
              );
            }}
            optionTextStyle={{
              color: colors.primary,
              fontSize: 16,
              paddingVertical: 12,
            }}
            optionContainerStyle={{
              backgroundColor: colors.white,
              borderBottomWidth: 0.5,
              borderBottomColor: colors.slateGrey || colors.placeholdergrey,
            }}
            cancelStyle={{
              backgroundColor: colors.white,
              borderTopWidth: 1,
              borderTopColor: colors.slateGrey || colors.placeholdergrey,
            }}
            cancelTextStyle={{
              color: colors.primary,
              fontSize: 16,
              fontWeight: "600",
            }}
            accessible={true}
            accessibilityLabel="Select Category Filter"
            animationType="slide"
            backdropPressToClose={true}
            overlayStyle={{
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            selectStyle={styles.categoryDropdown}
            selectTextStyle={styles.categoryDropdownText}
          >
            <View style={styles.categorySelector}>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectCategory && selectCategory !== ""
                        ? colors.black
                        : colors.slateGrey,
                  },
                ]}
              >
                {selectCategory && selectCategory !== ""
                  ? allCategories.find((c: any) => c.id == selectCategory)?.name
                  : "All Categories"}
              </Text>
              <Ionicons
                name="chevron-down-outline"
                size={20}
                color={colors.primary}
              />
            </View>
          </ModalSelector>
          {/* {errors.category && (
            <Text style={globalStyles.errorText}>{errors.category}</Text>
          )} */}
        </View>
        <View style={{ marginHorizontal: 16 }}>
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
        </View>

        <View style={{ marginTop: 16, flex: 1 }}>
          <FlatList
            data={productsListToShow}
            renderItem={ProductCard}
            keyExtractor={getUniqueKey}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListFooterComponent={() => {
              if (
                isLoadingMore &&
                hasMore &&
                (!selectCategory || selectCategory === "")
              ) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 8, color: colors.secondaryText }}>
                      Loading more products...
                    </Text>
                  </View>
                );
              }
              if (
                !hasMore &&
                productsListToShow.length > 0 &&
                (!selectCategory || selectCategory === "")
              ) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ color: colors.secondaryText }}>
                      No more products to load
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
