// Simplified solution without setTimeout - more reliable for React Native
import { ADMIN_PRODUCT_DASHBOARD_SCREEN_TITLE } from "../../../constants/stringLiterals";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import Header from "../../components/Header";
import products from "@/data/products";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useCallback, useState, useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
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

const AdminProductDashboard = () => {
  const [productsList, setAllProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refresh } = useLocalSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [categories, setCategories] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const ITEMS_PER_PAGE = 50;
  const [canLoader, setCanLoader] = useState(false);
  // Simple flag to prevent multiple calls
  const isLoadingMoreRef = useRef(false);
  const lastPageLoadedRef = useRef(0);

  const fetchAllProducts = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      // Prevent multiple simultaneous calls
      if (
        isLoadMore &&
        (isLoadingMoreRef.current || lastPageLoadedRef.current >= pageNum)
      ) {
        console.log(`Skipping page ${pageNum} - already loading or loaded`);
        return;
      }

      if (isLoadMore) {
        setLoadingMore(true);
        isLoadingMoreRef.current = true;
      } else if (pageNum === 1) {
        setIsLoading(true);
        isLoadingMoreRef.current = false;
        lastPageLoadedRef.current = 0;
      }

      try {
        console.log(`Fetching page ${pageNum}...`);
        const response = await ProductsAPI.getAllProducts(
          pageNum,
          ITEMS_PER_PAGE
        );
        console.log(
          `Page ${pageNum} loaded:`,
          response?.data?.length,
          "products"
        );

        if (pageNum === 1) {
          setAllProductsList(response.data);
        } else {
          setAllProductsList((prev) => [...prev, ...response.data]);
        }

        setTotal(response?.total || 0);
        setPage(pageNum);
        lastPageLoadedRef.current = pageNum;
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

  const fetchAllCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchAllProducts(1);
    fetchAllCategories();
    if (refresh === "true") {
      router.replace("./AdminProductDashboard/AdminProductDashboard");
    }
  }, []);

  // Simple load more function
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    const canLoadMore =
      !loadingMore &&
      !isLoadingMoreRef.current &&
      productsList.length < total &&
      productsList.length >= page * ITEMS_PER_PAGE - ITEMS_PER_PAGE &&
      productsList.length > 0;

    console.log("Load more check:", {
      canLoadMore,
      loadingMore,
      isLoadingMoreRef: isLoadingMoreRef.current,
      currentLength: productsList.length,
      total,
      currentPage: page,
      nextPage,
      lastPageLoaded: lastPageLoadedRef.current,
    });

    if (canLoadMore) {
      fetchAllProducts(nextPage, true);
    }
  }, [loadingMore, productsList.length, total, page, fetchAllProducts]);

  const onRefresh = useCallback(() => {
    console.log("Refreshing...");
    setIsRefreshing(true);
    setPage(1);
    setTotal(0);
    isLoadingMoreRef.current = false;
    lastPageLoadedRef.current = 0;
    fetchAllProducts(1, false);
  }, [fetchAllProducts]);

  const ProductCard = ({ item }: { item: any }) => {
    const getStockBadge = (stock: number) => {
      if (stock === 0) {
        return { text: "Out of Stock", backgroundColor: colors.primaryRed };
      } else if (stock < 10) {
        return { text: "Low on Stock", backgroundColor: colors.primaryYellow };
      } else {
        return { text: "In Stock", backgroundColor: colors.primaryGreen };
      }
    };

    const badge = getStockBadge(item.stock);

    return (
      <View style={styles.card}>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.alignItemsCenter,
            globalStyles.mb_3,
            { marginTop: 12 },
          ]}
        >
          <View>
            <Image source={{ uri: item?.image[0] }} style={styles.image} />
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
                style={[styles.text, styles.bold, { flex: 1, marginRight: 16 }]}
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
                    setIsModalVisible(true);
                    setItemToDelete(item);
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.text}>
              Category:{" "}
              {item.categoryId
                ?.map((catId: number) => {
                  const matched = categories.find(
                    (cat: any) => cat.id === catId
                  );
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
  };

  const maxId = productsList.reduce((max: any, product: any) => {
    return product.id && typeof product.id === "number" && product.id > max
      ? product.id
      : max;
  }, 0);

  const confirmDelete = async () => {
    try {
      console.log("Deleting product:", itemToDelete);
      await ProductsAPI.deleteProduct(itemToDelete._id);

      // Reset everything and refresh
      setPage(1);
      setTotal(0);
      isLoadingMoreRef.current = false;
      lastPageLoadedRef.current = 0;
      await fetchAllProducts(1, false);
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

  // Calculate if we have more data to load
  const hasMoreData = productsList.length < total;

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
      <View style={[globalStyles.pt_0, { paddingTop: 16 }]}>
        <Button
          onPress={() => {
            redirectToPage(containers.AdminProductUpdationScreen, {
              newProduct: true,
              maxId: maxId + 1,
              onGoBack: () => setRefreshTrigger((prev) => prev + 1),
            });
          }}
          title="Add New Product"
        />

        <View style={{ marginTop: 16 }}>
          <Text
            style={{
              marginBottom: 8,
              fontSize: 14,
              color: colors.secondaryText,
            }}
          >
            Showing {productsList.length} of {total} products
          </Text>

          <FlatList
            data={productsList}
            renderItem={ProductCard}
            keyExtractor={(item, index) =>
              `${
                item.id?.toString() || item._id?.toString() || "product"
              }-${index}`
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
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
                <ActivityIndicator size="large" color="blue" />
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
            scrollEventThrottle={16}
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

        <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
            setItemToDelete(null);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this product? This action cannot be undone."
          submitText="Delete Product"
          handleSubmit={confirmDelete}
          handleCancel={cancelDelete}
        />
      </View>
    </PageLayout>
  );
};

export default AdminProductDashboard;
