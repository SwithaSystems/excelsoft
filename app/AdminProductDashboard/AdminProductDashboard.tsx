import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import Header from "@/components/Header";
import products from "@/data/products";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import styles from "./AdminProductDashboardStyles";
import containers from "@/containers";
import colors from "../config/colors";
import { ProductsAPI } from "@/services/productService";
import AdminFooter from "@/components/AdminFooter";

const AdminProductDashboard = () => {
  // const productsList = products;

  const [productsList, setAllProductsList] = React.useState<any>([]);
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await ProductsAPI.getAllProducts();
        console.log("data in products page", data);
        setAllProductsList(data);
      } catch (err) {
        console.error("Error fetching all products:", err);
      }
    };
    fetchAllProducts();
  }, []);

  console.log("products list", productsList);

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

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={[
        globalStyles.container,
        {paddingBottom:36}
        ]}>
        <Header headerText="Product Details" />
        <ScrollView>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0, {paddingTop: 16}]}>
            <Button
              onPress={() => {
                redirectToPage(containers.AdminProductUpdationScreen, {
                  newProduct: true,
                });
              }}
              title="+ Add New Product"
            />
            <TouchableOpacity
              onPress={() => redirectToPage(containers.AdminCategoriesScreen)}
              style={{paddingTop:16}}
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
        <AdminFooter activeTab = "products"/>
      </View>
    </SafeAreaView>
  );
};

export default AdminProductDashboard;
