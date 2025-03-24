import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import BrandHeader from "../../components/BrandHeader";
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
import { categoryService, Category } from "../../services/categoryService";
import categoriesScreen from "../categoriesScree/categoriesScree";
import { parentCategoryIDAll } from "@/config/constants";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const renderBanner = () => <HeroBanner />;

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories(
          parentCategoryIDAll
        );
        console.log(data);
        const sortedData = data.sort((a, b) => a.id - b.id);
        setCategories(sortedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={homeStyles.container}>
      <ScrollView>
        <BrandHeader />

        {/* Search Bar */}
        <Header />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {/* <Text style={styles.sectionTitle}>Categories</Text> */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }) => (
                <CategoryItem
                  name={item.name}
                  imageUrl={item.images?.[0] || ""}
                  onPress={() =>
                    item.id === 2
                      ? redirectToPage(containers.categoriesScreeScreen, {
                          category: item.name,
                          categoryId: item.id,
                        })
                      : redirectToPage(containers.searchResultsScreenScreen, {
                          fromSearch: true,
                          category: item.name,
                          categoryId: item.id,
                        })
                  }
                  // onPress={() =>
                  //   router.push("/categoriesScree/categoriesScree")
                  // }
                />
              )}
            />
          )}
        </View>

        {/* Banner */}
        <View style={{ margin: 10 }}>{renderBanner()}</View>

        {/* Recommended Products */}
        <RecommendedProductsSlider
          recommendedProducts={recommendedProducts}
          sectionTitleStyle={styles.sectionTitle}
          title="Recommended for You"
        />

        {/* Exclusive Offers */}
        <View style={globalStyles.px_3}>
          <ExclusiveOffers exclusiveOffers={exclusiveOffers} />
        </View>

        {/* Best Sellers */}
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
  categoriesContainer: {
    padding: 10,
  },
});

export default HomePage;
