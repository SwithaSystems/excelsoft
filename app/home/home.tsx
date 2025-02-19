import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import homeStyles from "./Homestyles";
import Footer from "../../components/Footer";
import ProductCard from "../home/ProductCard";
import CategoryItem from "../../components/CategoryItem";
import colors from "../config/colors";
import products from "../../data/products";
import SearchBar from "../components/searchBar";
import Header from "@/components/Header";
import RecommendedProductsSlider from "../../components/RecommendedProductsSlider";
import ExclusiveOffers from "../../components/ExclusiveOffers";
import HeroBanner from "../../components/HeroBanner";
import { globalStyles } from "@/assets/styles/globalStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

const categories = [
  {
    id: "1",
    title: "Discount",
    imageUrl: require("../../assets/discount.png"),
  },
  { id: "2", title: "All", imageUrl: require("../../assets/all.png") },
  {
    id: "3",
    title: "Groceries",
    imageUrl: require("../../assets/groceries.png"),
  },
  { id: "4", title: "Baby & Kids", imageUrl: require("../../assets/baby.png") },
  { id: "5", title: "Fruits", imageUrl: require("../../assets/fruits.png") },
  {
    id: "6",
    title: "Food-to-go",
    imageUrl: require("../../assets/foodtogo.png"),
  },
  {
    id: "7",
    title: "Snacks & Treats",
    imageUrl: require("../../assets/snacks&treats.png"),
  },
  {
    id: "8",
    title: "Meat &Fish",
    imageUrl: require("../../assets/meat&fish.png"),
  },
  {
    id: "9",
    title: "Home & Furniture",
    imageUrl: require("../../assets/home&furniture.png"),
  },
  {
    id: "10",
    title: "Drinks & Beverages",
    imageUrl: require("../../assets/drinks&alco.png"),
  },
  {
    id: "11",
    title: "Beauty & Skin Care",
    imageUrl: require("../../assets/all.png"),
  },
  {
    id: "12",
    title: "Gifts & Hampers",
    imageUrl: require("../../assets/gifthampers.png"),
  },
];

const bannerImages = [
  { imageUrl: require("../../assets/banner1.png") },
  { imageUrl: require("../../assets/banner2.png") },
  { imageUrl: require("../../assets/banner3.png") },
];

const recommendedProducts = products
  .filter((p) =>
    ["Greek Yogurt", "Baby Stroller", "Granola Bars"].includes(p.name)
  )
  .map((product) => ({
    id: product.id,
    title: product.name,
    rating: product.rating,
    reviews: product.noOfreviews,
    imageUrl: product.image,
  }));

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

const bestSellers = products
  .filter((p) => ["Bananas", "Chicken Breast"].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    rating: product.rating,
    reviews: product.noOfreviews,
    imageUrl: product.image,
  }));

const featuredProducts = products
  .filter((p) => ["Brown Teddy Bear", "Anchovies"].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    description: product.description.slice(0, 50) + "...",
    imageUrl: product.image,
  }));

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const renderBanner = () => <HeroBanner />;

  /* const renderRecommendedProducts = () => (
    <View>
      <Text style={styles.sectionTitle}>Recommended for You</Text>
      <FlatList
        horizontal
        data={recommendedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recommendedCard}
            onPress={() =>
              router.push({
                pathname: "/productDetailScreen/productDetailScreen",
                params: { productId: item.id },
              })
            }
          >
            <Image
              source={item.imageUrl}
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating} ★</Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  ); */

  /* const renderBestSellers = () => (
    <View>
      <Text style={styles.sectionTitle}>Best Sellers</Text>
      <FlatList
        horizontal
        data={bestSellers}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bestSellerCard}
            onPress={() =>
              router.push({
                pathname: "/productDetailScreen/productDetailScreen",
                params: { productId: item.id },
              })
            }
          >
            <Image source={item.imageUrl} style={styles.bestSellerImage} />
            <Text style={styles.bestSellerTitle}>{item.title}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.rating} ★</Text>
              <Text style={styles.reviewsText}>({item.reviews})</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  ); */

  const renderFeaturedProducts = () => (
    <View>
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        horizontal
        data={featuredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() =>
              redirectToPage(containers.productDetailScreenScreen, {
                productId: item.id,
              })
            }
          >
            <Image source={item.imageUrl} style={styles.featuredImage} />
            <Text style={styles.featuredTitle}>{item.title}</Text>
            <Text style={styles.featuredDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );

  return (
    <View style={homeStyles.container}>
      <ScrollView
      // style={homeStyles.scrollView}
      >
        {/* Header */}
        <View
          style={{
            ...homeStyles.header,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/brandlogo.png")}
            style={homeStyles.logo}
          />
          <TouchableOpacity
            onPress={() => {
              redirectToPage(containers.userProfileScreenScreen);
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ marginRight: 8 }}>Hello, User</Text>
              <Ionicons name="person-circle-outline" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Header searchBarNeeded={true} />

        {/* Categories */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryItem
              title={item.title}
              imageUrl={item.imageUrl}
              onPress={() =>
                redirectToPage(containers.searchResultsScreenScreen, {
                  fromSearch: false,
                })
              }
            />
          )}
          style={homeStyles.categoriesContainer}
        />

        {/* Banner */}

        <View style={{ margin: 10 }}>{renderBanner()}</View>

        {/* Recommended Products */}
        {
          <RecommendedProductsSlider
            recommendedProducts={recommendedProducts}
            sectionTitleStyle={styles.sectionTitle}
            title="Recommended for You"
          />
        }

        {/* Exclusive Offers */}
        <View style={globalStyles.px_3}>
          <ExclusiveOffers exclusiveOffers={exclusiveOffers} />
        </View>

        {/* Best Sellers */}
        {/* {renderBestSellers()} */}
        <RecommendedProductsSlider
          recommendedProducts={bestSellers}
          sectionTitleStyle={styles.sectionTitle}
          title="Best Sellers"
        />

        {/* Featured Products */}
        {renderFeaturedProducts()}
      </ScrollView>

      {/* Footer */}
      <Footer navigation={router} activeTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  recommendedCard: {
    width: 160,
    height: 180,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
  },
  recommendedImage: {
    width: "100%",
    height: 120,
    marginBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recommendedDetails: {
    marginLeft: 16,
  },

  bestSellerCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
  },
  bestSellerImage: {
    width: "100%",
    height: 130,
    marginBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bestSellerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    marginLeft: 16,
  },
  featuredCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
  },
  featuredImage: {
    width: "100%",
    height: 140,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
  },
  featuredDescription: {
    fontSize: 12,
    color: colors.lightgrey,
    marginHorizontal: 16,
  },
  productsList: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 10,
  },
});

export default HomePage;
