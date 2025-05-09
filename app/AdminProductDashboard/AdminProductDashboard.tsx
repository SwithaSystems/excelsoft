import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import Header from "@/components/Header";
import products from "@/data/products";
import { redirectToPage } from "@/utilities/redirectionHelper";
import React from "react";
import { FlatList, Image, ScrollView, Text, View, SafeAreaView } from "react-native";
import styles from "./AdminProductDashboardStyles";
import containers from "@/containers";
import colors from "../config/colors";

const AdminProductDashboard = () => {
  const productsList = products;

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
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="center"
            />
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
              <Text style={styles.bold}>Price:</Text> ${item.price} per unit
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              redirectToPage(containers.AdminProductUpdationScreen);
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
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={globalStyles.container}>
      <Header headerText="Product Details" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          <Button
            onPress={() => {
              redirectToPage(containers.AdminProductUpdationScreen, {
                newProduct: true,
              });
            }}
            title="+ Add New Product"
          />
          <View style={{ marginTop: 40 }}>
            <FlatList
              data={productsList}
              renderItem={ProductCard}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

export default AdminProductDashboard;
