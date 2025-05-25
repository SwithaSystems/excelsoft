import { useFocusEffect } from "@react-navigation/native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import Header from "@/components/Header";
import products from "@/data/products";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useCallback, useState, useEffect } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import styles from "./AdminProductDashboardStyles";
import containers from "@/containers";
import colors from "../config/colors";
import { ProductsAPI } from "@/services/productService";
import AdminFooter from "@/components/AdminFooter";

const AdminProductDashboard = () => {
  const [productsList, setAllProductsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Initial fetch
  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAllProducts();
  }, []);

  const ProductCard = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View
          style={[
            globalStyles.flexRow,
            globalStyles.alignItemsCenter,
            globalStyles.mb_3,
          ]}
        >
          <View>
            <Image source={{ uri: item?.image[0] }} style={styles.image} />
          </View>
          <View style={styles.details}>
            <Text style={styles.text}>
              <Text style={styles.bold}>Product Name:</Text> {item.name}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Category:</Text> {item.category}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>In Stock:</Text> {item.stock} units
            </Text>
            <Text style={styles.text}>
              <Text style={styles.bold}>Price:</Text> £{item.price} per unit
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              redirectToPage(containers.AdminProductUpdationScreen, {
                item: JSON.stringify(item),
              });
            }}
            title="Edit Details"
          />
          <Button
            onPress={() => {
              redirectToPage();
            }}
            title="Delete Product"
          />
        </View>
      </View>
    );
  };
  const maxId = productsList.reduce((max: any, product: any) => {
    return product.id && typeof product.id === "number" && product.id > max
      ? product.id
      : max;
  }, 0);

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={[globalStyles.container, { paddingBottom: 36 }]}>
        <Header headerText="Product Details" />
        <ScrollView>
          <View
            style={[
              globalStyles.sectionContent,
              globalStyles.pt_0,
              { paddingTop: 16 },
            ]}
          >
            <Button
              onPress={() => {
                redirectToPage(containers.AdminProductUpdationScreen, {
                  newProduct: true,
                  maxId: maxId + 1,
                });
              }}
              title="+ Add New Product"
            />
            <TouchableOpacity
              onPress={() => redirectToPage(containers.AdminCategoriesScreen)}
              style={{ paddingTop: 16 }}
            >
              <Text style={globalStyles.btnSmUnderLine}>View Categories</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 40 }}>
              <FlatList
                data={productsList}
                renderItem={ProductCard}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </ScrollView>
        <AdminFooter activeTab="products" />
      </View>
    </SafeAreaView>
  );
};

export default AdminProductDashboard;
