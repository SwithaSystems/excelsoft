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
  Alert,
  Platform,
  useWindowDimensions,
  ScrollView,
  Pressable,
  Modal,
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
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import Pagination from "./componentsWeb/PaginationWeb";

interface ApiResponse {
  data: Product[];
  total: number;
}

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
  const [selectCategory, setSelectCategory] = useState<string | number>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
  const isWeb = Platform.OS === "web";

  const loadingMoreRef = useRef(false);
  const lastPageLoadedRef = useRef(0);

  const ITEMS_PER_PAGE = isTabOrDesktop ? 10 : 50;

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetchData(page);
      setAllProductsList(response.data);
      setCurrentPage(page);
      setTotalProducts(response.total);
      setHasMore(response.hasMore);
    } catch (error) {
      Alert.alert("Error", "Failed to load page data");
    } finally {
      setIsLoading(false);
    }
  };

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
      ? product.categoryId?.some((catId: any) => String(catId) === String(selectCategory))
      : true
  );

  const productsListToShow =
    selectCategory && selectCategory !== "" ? category_Products : productsList;

  // Calculate total pages for pagination - hide pagination when category is selected
  // since filtering is client-side and doesn't use server pagination
  const shouldShowPagination = (!selectCategory || selectCategory === "") && totalPages > 1;

  const fetchData = async (
    page: number
  ): Promise<{
    data: Product[];
    total: number;
    hasMore: boolean;
  }> => {
    try {
      // console.log(`Fetching page ${page}`);
      const response = await ProductsAPI.getAllProducts(page, ITEMS_PER_PAGE);

      if (response && response.data) {
        const totalFetched = (page - 1) * ITEMS_PER_PAGE + response.data.length;
        const hasMoreData = totalFetched < response.total;

        // console.log(`Page ${page} response:`, {
        //   itemsReceived: response.data.length,
        //   totalRecords: response.total,
        //   totalFetched,
        //   hasMore: hasMoreData,
        // });

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
          loadInitialData();
        }
        return;
      }

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
    };

    performSearch();
  }, [debouncedQuery]);

  const renderCategoryItems = () => (
    <>
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          setSelectCategory("");
          setIsCategoryOpen(false);
        }}
      >
        <Text style={styles.dropdownItemText}>All Categories</Text>
      </TouchableOpacity>
  
      {allCategories.map((cat: any) => (
        <TouchableOpacity
          key={cat.id || cat._id}
          style={styles.dropdownItem}
          onPress={() => {
            setSelectCategory(cat.id || cat._id);
            setIsCategoryOpen(false);
          }}
        >
          <Text style={styles.dropdownItemText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchData(1);

      setAllProductsList(response.data);
      setTotalProducts(response.total);
      setHasMore(response.hasMore);
      setCurrentPage(1);
      lastPageLoadedRef.current = 1;

      // console.log("Initial data loaded:", {
      //   
      // }
      //);
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

  const loadMoreData = async () => {
    if (loadingMoreRef.current || isLoadingMore || !hasMore || isLoading) {
      // console.log("Load more blocked:", {
      //   loadingMoreRef: loadingMoreRef.current,
      //   isLoadingMore,
      //   hasMore,
      //   isLoading,
      // });
      return;
    }

    const nextPage = lastPageLoadedRef.current + 1;
    // console.log(`Loading more data - page ${nextPage}`);

    loadingMoreRef.current = true;
    setIsLoadingMore(true);

    try {
      const response = await fetchData(nextPage);

      if (response.data.length > 0) {
        setAllProductsList((prevProducts: any) => {
          const existingIds = new Set(
            prevProducts.map((item: any) => item._id || item.id)
          );

          const newItems = response.data.filter(
            (item) => !existingIds.has(item._id || item.id)
          );

          // console.log(
          //   `Adding ${newItems.length} new items (${response.data.length - newItems.length} duplicates filtered)`
          // );
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

  const onRefresh = async () => {
    setIsRefreshing(true);

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

      // console.log("Data refreshed:", {
      //   itemCount: response.data.length,
      //   total: response.total,
      // });
    } catch (error) {
      console.error("Failed to refresh data:", error);
      Alert.alert("Error", "Failed to refresh products");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchAllCategories = useCallback(async () => {
    try {
      const data: Category[] = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
    fetchAllCategories();
  }, [fetchAllCategories]);

  const performDelete = async (item: Product) => {
    try {
      setIsLoading(true);
      const result = await ProductsAPI.deleteProduct(item?._id);
      if (result) {
        await onRefresh();
        if (isWeb || isTabOrDesktop) {
          setSuccessModalVisible(true);
        } else {
          Alert.alert("Success", "Product deleted successfully");
        }
      }
    } catch (error: any) {
      // console.log("Delete error:", error?.response?.data);
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong while deleting the product.";
      
      if (isWeb) {
        alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setIsLoading(false);
      setDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteProduct = useCallback(
    (item: Product) => {
      if (isWeb || isTabOrDesktop) {
        setProductToDelete(item);
        setDeleteModalVisible(true);
      } else {
        Alert.alert(
          "Delete Product",
          "Are you sure you want to delete this product?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await performDelete(item);
              },
            },
          ]
        );
      }
    },
    [isWeb, isTabOrDesktop]
  );

  const getUniqueKey = useCallback((item: Product, index: number) => {
    const id = item._id || item.id;
    return `product-${id}-${index}`;
  }, []);

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
            <View style={[styles.details, { flex: 1, paddingRight: 0 }]}>
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

  const maxId = productsList.reduce((max: number, product: Product) => {
    return product.id && typeof product.id === "number" && product.id > max
      ? product.id
      : max;
  }, 0);

  const handleEndReached = useCallback(() => {
    if (!isTabOrDesktop && !isLoadingMore && hasMore && !isLoading) {
      loadMoreData();
    }
  }, [isLoadingMore, hasMore, isLoading]);

  const searchProductsByName = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await ProductsAPI.productsBy_Name_Id(query);
      // console.log("Search response:", response);

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

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={ADMIN_PRODUCT_DASHBOARD_SCREEN_TITLE} />
  );

  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <AdminFooter activeTab="products" />;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isTabOrDesktop}
      scrollable={false}
      hideNavItems={true}
    >
      <View style={[
          // globalStyles.pt_0, 
          {flex: 1 }
        ]}>
        {!isTabOrDesktop && (
          <View>
            <SearchBar
              placeholder="Search by name..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              onPress={handleSearch}
            />
          </View>
        )}

        <View
          style={[
            styles.headerRow,
            {
              justifyContent: "space-between",
              paddingTop: 10,
              alignItems: "center",
              marginBottom: 5,
              marginTop: 0,
            },
          ]}
        >
          {isTabOrDesktop && (
            <Text style={{ fontSize: 35, color: colors.black, paddingHorizontal: 0 }}>
              Product List
            </Text>
          )}
          <TouchableOpacity
            style={[styles.addButton, !isTabOrDesktop && styles.addButtonMobile]}
            onPress={() => {
              redirectToPage(containers.AdminProductUpdationScreen, {
                newProduct: true,
                maxId: maxId + 1,
                onGoBack: () => onRefresh(),
              });
            }}
          >
            <Text style={styles.addButtonText}>+ Add New Product</Text>
          </TouchableOpacity>
        </View>

        <View style={Platform.OS === "web" ? { overflow: "visible", zIndex: 1000 } : {}}>
          <View style={styles.stickyTopContainer}>
            <View style={styles.categoryActionRow}>
              {isTabOrDesktop && (
                <SearchBar
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  onPress={handleSearch}
                  widthPercent={35}
                  height={40}
                />
              )}
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  onPress={() => setIsCategoryOpen((prev) => !prev)}
                  activeOpacity={0.7}
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
                        ? allCategories.find((c: any) => (c.id || c._id) == selectCategory)?.name
                        : "All Categories"}
                    </Text>
                    <Ionicons
                      name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.black}
                    />
                  </View>
                </TouchableOpacity>
                {isCategoryOpen && (
  isTabOrDesktop ? (
    // ===== WEB: inline dropdown (keep your current UI) =====
    <View style={styles.dropdownList}>
      <ScrollView style={styles.dropdownScrollArea}>
        {renderCategoryItems()}
      </ScrollView>
    </View>
  ) : (
    // ===== MOBILE: modal dropdown =====
    Platform.OS !== "web" && (
      <Modal
        transparent
        animationType="fade"
        onRequestClose={() => setIsCategoryOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsCategoryOpen(false)}
        >
          <View style={styles.modalDropdown}>
            <ScrollView>
              {renderCategoryItems()}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    )
  )
)}

              </View>
            </View>
          </View>
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
              if (isLoadingMore && hasMore && (!selectCategory || selectCategory === "")) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={{ marginTop: 8, color: colors.secondaryText }}>
                      Loading more products...
                    </Text>
                  </View>
                );
              }
              if (!hasMore && productsListToShow.length > 0 && (!selectCategory || selectCategory === "")) {
                return (
                  <View style={{ padding: 20, alignItems: "center" }}>
                    <Text style={{ color: colors.secondaryText }}>No more products to load</Text>
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
              paddingBottom: 0,
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

        {isTabOrDesktop && shouldShowPagination && (
        <View style={styles.stickyBottomContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              fetchProducts(page);
            }}
          />
        </View>
      )}
      </View>

      <ConfirmationModal
        isModalVisible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setProductToDelete(null);
        }}
        handleCancel={() => {
          setDeleteModalVisible(false);
          setProductToDelete(null);
        }}
        handleSubmit={() => {
          if (productToDelete) {
            performDelete(productToDelete);
          }
        }}
        title="Delete Product"
        text="Are you sure you want to delete this product?"
        submitText="Delete"
        cancelText="Cancel"
      />

      <ConfirmationModal
        isModalVisible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        handleSubmit={() => setSuccessModalVisible(false)}
        title="Success"
        text="Product deleted successfully"
        submitText="OK"
        cancelText=""
      />
    </LayoutComponent>
  );
};

export default AdminProductDashboard;