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
  Platform,
  StatusBar,
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AdminFooter from "@/components/AdminFooter";
import { PageLayout } from "../pageLayoutProps";

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
  .filter((p) => ["Bananas", "Chicken Breast", "Baby Bicycle"].includes(p.name))
  .map((product) => ({
    id: product.id,
    title: product.name,
    rating: product.rating,
    reviews: product.noOfreviews,
    imageUrl: product.image,
  }));

const featuredProducts = products
  .filter((p) =>
    ["Brown Teddy Bear", "Anchovies", "Baby Crib"].includes(p.name)
  )
  .map((product) => ({
    id: product.id,
    title: product.name,
    description: product.description.slice(0, 20) + "...",
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
        const data = await categoryService.getAllCategories();
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

  const insets = useSafeAreaInsets();
  const footerHeight =
    60 +
    (Platform.OS === "ios"
      ? insets.bottom
      : insets.bottom > 0
      ? insets.bottom
      : 10);

  return (
    <PageLayout
      hasHeader
      hasFooter
      headerComponent={<BrandHeader />}
      footerComponent={<Footer activeTab="home" />}
      scrollable
    >
      <View style={styles.container}>
        <Header />

        {/* Categories */}
        <View style={styles.categoriesContainer}>
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
                />
              )}
            />
          )}
        </View>

        {/* Banner */}
        <View
        //  style={{ marginVertical: 8 }}
        >
          {renderBanner()}
        </View>

        {/* Recommended Products */}
        <View
        // style={{ marginVertical: 8 }}
        >
          <RecommendedProductsSlider
            recommendedProducts={recommendedProducts}
            sectionTitleStyle={styles.sectionTitle}
            title="Recommended for You"
          />
        </View>

        {/* Exclusive Offers */}
        <View
        //  style={globalStyles.px_4}
        >
          <ExclusiveOffers exclusiveOffers={exclusiveOffers} />
        </View>

        {/* Best Sellers */}
        <View
        // style={{ marginVertical: 8 }}
        >
          <RecommendedProductsSlider
            recommendedProducts={bestSellers}
            sectionTitleStyle={styles.sectionTitle}
            title="Best Sellers"
          />
        </View>

        {/* Featured Products */}
        {renderFeaturedProducts()}
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || "#fff",
    marginVertical: 8,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopColor: colors.placeholdergrey,
    borderTopWidth: 1,
  },

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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 16,
  },
  featuredDescription: {
    fontSize: 12,
    color: colors.reviewsColor,
    marginHorizontal: 16,
    paddingBottom: 8,
  },
  featuredDescriptionText: {
    fontSize: 14,
    color: colors.lightgrey,
    marginLeft: 10,
    marginBottom: 10,
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
    paddingTop: 8,
  },
});

export default HomePage;
