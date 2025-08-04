import { ADMIN_PRODUCT_DASHBOARD_SCREEN_TITLE } from "../../../constants/stringLiterals";
// import { useFocusEffect } from "@react-navigation/native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import Header from "../../components/Header";
import products from "@/data/products";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useCallback, useState, useEffect } from "react";
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

  const fetchAllProducts = async () => {
    try {
      const data = await ProductsAPI.getAllProducts();
      console.log("Fetched products:", data);
      setAllProductsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching all products:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchAllCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      console.log("Fetched categories:", data);
      setCategories(data);
    } catch (err) {
      console.error("Error fetching all categories:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllProducts();
    fetchAllCategories();
    if (refresh === "true") {
      // Remove the refresh param to prevent re-triggering
      router.replace("./AdminProductDashboard/AdminProductDashboard");
    }
  }, []);

  // Refresh when screen comes into focus
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchAllProducts();
  //   }, [])
  // );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAllProducts();
  }, []);

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
              {" "}
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
                      badge.backgroundColor === "yellow" ? "black" : "white",
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
      console.log("itemToDelete", itemToDelete);
      await ProductsAPI.deleteProduct(itemToDelete._id);
      fetchAllProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setIsModalVisible(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsModalVisible(false);
  };

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
        {/* <Button
        style={{marginBottom: 16}}
          onPress={() => {
            redirectToPage(containers.fileUploadAddProductCategoryScreen);
          }}
          title="Upload Product Data"
        /> */}
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
        {/* <TouchableOpacity
              onPress={() => redirectToPage(containers.AdminCategoriesScreen)}
              style={{ paddingTop: 16 }}
            >
              <Text style={globalStyles.btnSmUnderLine}>View Categories</Text>
            </TouchableOpacity>*/}
        <View style={{ marginTop: 16 }}>
          <FlatList
            data={productsList}
            renderItem={ProductCard}
            keyExtractor={(item) => item.id}
          />
        </View>
        <ConfirmationModal
          onClose={() => {
            setIsModalVisible(false);
          }}
          isModalVisible={isModalVisible}
          text="Are you sure you want to delete this? You can save this item for later too."
          submitText="Delete Item"
          handleSubmit={confirmDelete}
          handleCancel={cancelDelete}
        />
      </View>
    </PageLayout>
  );
};

export default AdminProductDashboard;
