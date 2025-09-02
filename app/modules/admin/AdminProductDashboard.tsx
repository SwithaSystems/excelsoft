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
  price: number;
  stock: number;
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
  const ITEMS_PER_PAGE = 50;
  const isLoadingMoreRef = useRef(false);
  const { refresh } = useLocalSearchParams();

  const fetchAllProducts = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (isLoadMore && isLoadingMoreRef.current) {
        console.log(`Skipping page ${pageNum} - already loading`);
        return;
      }

      if (isLoadMore) {
        setLoadingMore(true);
        isLoadingMoreRef.current = true;
      } else {
        setIsLoading(true);
        isLoadingMoreRef.current = false;
      }

      try {
        console.log(`Fetching page ${pageNum}...`);
        const response: ApiResponse = await ProductsAPI.getAllProducts(
          pageNum,
          ITEMS_PER_PAGE
        );
        console.log(`Page ${pageNum} loaded:`, {
          productCount: response.data.length,
          total: response.total,
        });

        if (pageNum === 1) {
          setAllProductsList(response.data);
        } else {
          setAllProductsList((prev) => [...prev, ...response.data]);
        }

        setTotal(response.total || 0);
        setPage(pageNum);
      } catch (err) {
        console.error(`Error fetching page ${pageNum}:`, err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setLoadingMore(false);
        isLoadingMoreRef.current = false;
      }
    },
    [ITEMS_PER_PAGE]
  );

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
        "Are you sure you want to delete this product? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                setIsLoading(true);
                // const id =
                //   typeof productId === "string"
                //     ? parseInt(productId)
                //     : productId;
                const result = await ProductsAPI.deleteProduct(item?._id);
                if (result) {
                  setPage(1);
                  setTotal(0);
                  isLoadingMoreRef.current = false;
                  await fetchAllProducts(1, false);
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
    [fetchAllProducts]
  );

  useEffect(() => {
    fetchAllProducts(1);
    fetchAllCategories();
    if (refresh === "true") {
      router.replace("./AdminProductDashboard/AdminProductDashboard");
    }
  }, [fetchAllProducts, fetchAllCategories, refresh]);

  const handleLoadMore = useCallback(
    debounce(() => {
      if (
        isLoading ||
        loadingMore ||
        isLoadingMoreRef.current ||
        productsList.length >= total
      ) {
        console.log("Load more blocked:", {
          isLoading,
          loadingMore,
          isLoadingMoreRef: isLoadingMoreRef.current,
          hasMore: productsList.length < total,
        });
        return;
      }

      const nextPage = page + 1;
      console.log(`Triggering load for page ${nextPage}`, {
        currentLength: productsList.length,
        total,
        currentPage: page,
      });
      fetchAllProducts(nextPage, true);
    }, 500),
    [isLoading, loadingMore, productsList.length, total, page, fetchAllProducts]
  );

  const onRefresh = useCallback(() => {
    console.log("Refreshing...");
    setIsRefreshing(true);
    setPage(1);
    setTotal(0);
    isLoadingMoreRef.current = false;
    fetchAllProducts(1, false);
  }, [fetchAllProducts]);

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
          {/* Increased minHeight */}
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
              <Text style={styles.text}>£{item.price} per unit</Text>
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

  const confirmDelete = async () => {
    try {
      console.log("Deleting product:", itemToDelete);
      if (itemToDelete?._id) {
        await ProductsAPI.deleteProduct(itemToDelete?._id);
        setPage(1);
        setTotal(0);
        isLoadingMoreRef.current = false;
        await fetchAllProducts(1, false);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsModalVisible(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
    setItemToDelete(null);
  };

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
      // style={{ flex: 1, minHeight: windowHeight }}
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
          {/* <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              color: colors.secondaryText,
            }}
          >
            Showing {productsList.length} of {total} products
          </Text> */}

          <FlatList
            data={productsList}
            renderItem={ProductCard}
            keyExtractor={(item, index) =>
              `${
                item.id?.toString() || item._id?.toString() || "product"
              }-${index}`
            }
            // onEndReached={handleLoadMore}
            onEndReached={() => {
              if (!isLoadingMoreRef.current && page * ITEMS_PER_PAGE < total) {
                fetchAllProducts(page + 1, true);
              }
            }}
            onEndReachedThreshold={0.7} // Increased to 70% from bottom
            scrollEventThrottle={200}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : null
            }
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
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            initialNumToRender={10}
            windowSize={5}
            contentContainerStyle={{
              paddingBottom: 300, // Increased padding
              minHeight: windowHeight * 3, // Increased significantly
            }}
            onLayout={(e) =>
              console.log(
                "FlatList content height:",
                e.nativeEvent.layout.height
              )
            }
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

        {/* <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
            setItemToDelete(null);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this product? This action cannot be undone."
          submitText="Yes"
          cancelText="No"
          handleSubmit={confirmDelete}
          handleCancel={cancelDelete}
        /> */}
      </View>
    </PageLayout>
  );
};

export default AdminProductDashboard;
