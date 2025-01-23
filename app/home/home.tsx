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
  .filter(p => ['Greek Yogurt', 'Baby Stroller', 'Granola Bars'].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    rating: product.rating,
    reviews: product.noOfreviews,
    imageUrl: product.image
  }));

const exclusiveOffers = products
  .filter(p => ['Baby Stroller', 'Granola Bars'].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    rating: product.name === 'Baby Stroller' ? 4.7 : 4.5,
    reviews: product.name === 'Baby Stroller' ? 120 : 130,
    price: product.name === 'Baby Stroller' ? 120 : 8,
    originalPrice: product.name === 'Baby Stroller' ? 180 : 10,
    imageUrl: product.image,
    discount: product.name === 'Baby Stroller' ? '20%' : '15%',
    saleEndsAt: '31-4-2024',
  }));

const bestSellers = products
  .filter(p => ['Bananas', 'Chicken Breast'].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    rating: product.rating,
    reviews: product.noOfreviews,
    imageUrl: product.image
  }));

const featuredProducts = products
  .filter(p => ['Brown Teddy Bear', 'Anchovies'].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    description: product.description.slice(0, 50) + '...',
    imageUrl: product.image
  }));

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = () => {
    router.push({
      pathname: "./search/search",
    });
  };

  const renderBanner = () => (
    <View style={styles.banner}>
      <Text style={styles.bannerTitle}>New Year Eve Special Discount!</Text>
      <Text style={styles.bannerDiscount}>40-60% Discount</Text>
      <Text style={styles.bannerText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </Text>
      <TouchableOpacity style={styles.shopNowButton}>
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const handleProductDetail = () => {
    router.push({ pathname: "./productDetailScreen/productDetailScreen" });
  };

  const renderRecommendedProducts = () => (
    <View>
      <Text style={styles.sectionTitle}>Recommended for You</Text>
      <FlatList
        horizontal
        data={recommendedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.recommendedCard}
            onPress={() => router.push({
              pathname: "/productDetailScreen/productDetailScreen",
              params: { productId: item.id }
            })}
          >
            <Image source={item.imageUrl} style={styles.recommendedImage} resizeMode="cover" />
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
  );

  const renderExclusiveOffers = () => (
    <View>
      <Text style={styles.sectionTitle}>Exclusive Offers</Text>
      <FlatList
        horizontal
        data={exclusiveOffers}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.exclusiveCard}
            onPress={() => router.push({
              pathname: "/productDetailScreen/productDetailScreen",
              params: { productId: item.id }
            })}
          >
            <Image source={item.imageUrl} style={styles.exclusiveImage} resizeMode="cover"/>
            <View style={styles.exclusiveDetails}>
              <Text style={styles.exclusiveTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating}</Text>
                <Text style={styles.starIcon}> ★ </Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>
              <View style={styles.saleContainer}>
                <View style={styles.saleTag}>
                  <Text style={styles.saleText}>Sale</Text>
                </View>
                <Text style={styles.saleTime}>02:48:26</Text>
                <View style={styles.discountTag}>
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.salePrice}>${item.price}</Text>
                <Text style={styles.originalPrice}>${item.originalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );

  const renderBestSellers = () => (
    <View>
      <Text style={styles.sectionTitle}>Best Sellers</Text>
      <FlatList
        horizontal
        data={bestSellers}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bestSellerCard}
            onPress={() => router.push({
              pathname: "/productDetailScreen/productDetailScreen",
              params: { productId: item.id }
            })}
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
  );

  const renderFeaturedProducts = () => (
    <View>
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        horizontal
        data={featuredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.featuredCard}
            onPress={() => router.push({
              pathname: "/productDetailScreen/productDetailScreen",
              params: { productId: item.id }
            })}
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ marginRight: 8 }}>Hello, User</Text>
            <Ionicons name="person-circle-outline" size={24} color="#000" />
          </View>
        </View>

        {/* Search Bar */}
        <View>
          <SearchBar
            placeholder="Search..."
            onFocus={handleSearchSubmit}
            onPress={handleSearchSubmit}
            value={searchQuery}
            onChangeText={(text:any) => setSearchQuery(text)}
          />
        </View>

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
                router.push({
                  pathname: "./category",
                  // params: { category: item }
                })
              }
            />
          )}
          style={homeStyles.categoriesContainer}
        />

        {/* Banner */}
        {renderBanner()}

        {/* Recommended Products */}
        {renderRecommendedProducts()}

        {/* Exclusive Offers */}
        {renderExclusiveOffers()}

        {/* Best Sellers */}
        {renderBestSellers()}

        {/* Featured Products */}
        {renderFeaturedProducts()}
      </ScrollView>

      {/* Footer */}
      <Footer activeTab="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#2E2A5C",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    alignItems: "center",
    height: 230,
    width: 408,
  },
  bannerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  bannerDiscount: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bannerText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  shopNowText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  recommendedCard: {
    width: 160,
    height:180,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius:10
  },
  recommendedImage: {
    width: '100%',
    height: 120,
    marginBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendedDetails: {
    marginLeft: 16,
  },
  exclusiveCard: {
    width: 240,
    height: 400,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius:10,
    overflow: 'hidden',
  },
  exclusiveImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  exclusiveDetails: {
    padding: 16,
  },
  
  exclusiveTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.black,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: colors.reviewsColor,
    marginLeft:16,
  },
  starIcon: {
    color: colors.reviewsColor,
    fontSize: 14,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.reviewsColor,
  },
  saleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  saleTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  saleText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  saleTime: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
  },
  discountTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap:10,
  },
  salePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: colors.black,
  },
  bestSellerCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
  },
  bestSellerImage: {
    width: '100%',
    height: 130,
    marginBottom: 8,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  bestSellerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft:16
  },
  featuredCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
  },
  featuredImage: {
    width: '100%',
    height: 140,
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal:16,
  },
  featuredDescription: {
    fontSize: 12,
    color: colors.lightgrey,
    marginHorizontal:16
  },
  productsList: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    marginLeft: 10,
  },
});

export default HomePage;
