import React from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from "react-native";
import styles from "./offersScreenStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import products from "@/data/products";
import ProductCard from "../components/ProductCard";
import HeroBanner from "@/components/HeroBanner";
import ExclusiveOffers from "@/components/ExclusiveOffers";
import { router } from "expo-router";
import Footer from "@/components/Footer";

const offersScreen = () => {
  const filteredProducts = products;
  const exclusiveOffers = products
    .filter((p) => ["Baby Stroller", "Granola Bars"].includes(p.name))
    .map((product) => ({
      id: product.id,
      title: product.name,
      rating: product.name === "Baby Stroller" ? 4.7 : 4.5,
      reviews: product.name === "Baby Stroller" ? 120 : 130,
      price: product.name === "Baby Stroller" ? 120 : 8,
      originalPrice: product.name === "Baby Stroller" ? 180 : 10,
      imageUrl: product.image,
      discount: product.name === "Baby Stroller" ? "20%" : "15%",
      saleEndsAt: "31-4-2024",
    }));
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;

    return (
      <View
        style={[
          styles.productItem,
          isEven ? styles.leftItem : styles.rightItem,
        ]}
      >
        <ProductCard
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          originalPrice={item.originalPrice}
          image={item.image}
          productColors={item.productColors}
          category={item.category}
          rating={item.rating}
          noOfreviews={item.noOfreviews}
          reviews={item.reviews}
        />
      </View>
    );
  };
  return (
    <View style={[globalStyles.container]}>
      {/* <ScrollView> */}
      <FlatList
        ListHeaderComponent={
          <>
            <Header headerText="Store Offers" />
            <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
              <HeroBanner />
              <View style={[globalStyles.mt_4, globalStyles.mb_4]}>
                <Text style={globalStyles.sectionHeading}>Today's Deals</Text>
                <FlatList
                  data={filteredProducts}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  contentContainerStyle={styles.listContainer}
                  showsVerticalScrollIndicator={false}
                />
              </View>
              <ExclusiveOffers exclusiveOffers={exclusiveOffers} />
            </View>
          </>
        }
        data={[]}
        renderItem={() => null}
      />
      {/* </ScrollView> */}
      <Footer navigation={router} />
    </View>
  );
};

export default offersScreen;
