import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  StatusBar,
} from "react-native";
import BrandHeader from "../../components/BrandHeader";
import { useRouter } from "expo-router";
import Footer from "../../components/Footer";
import CategoryItem_Home from "../../components/CategoryItem_Home";
import colors from "../../../constants/colors";
import products from "../../../data/products";
import SearchBar from "../../components/searchBar";
import Header from "../../components/Header";
import RecommendedProductsSlider from "../../components/RecommendedProductsSlider";
import ExclusiveOffers from "../../components/ExclusiveOffers";
import HeroBanner from "../../components/HeroBanner";
import { globalStyles } from "@/assets/styles/globalStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { categoryService, Category } from "../../../services/categoryService";
import { PageLayout } from "@/app/components/commonComponents/pageLayoutProps";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import {PageLayoutWeb} from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";

// const recommendedProducts = products
//   .filter((p) =>
//     ["Greek Yogurt", "Baby Stroller", "Granola Bars"].includes(p.name)
//   )
//   .map((product) => ({
//     id: product.id,
//     title: product.name,
//     rating: product.rating,
//     reviews: product.noOfreviews,
//     imageUrl: product.image,
//   }));

// const exclusiveOffers = products
//   .filter((p) =>
//     ["SUPERKINGS LIGHT 20", "WALKERS READY SALTED"].includes(p.name)
//   )
//   .map((product) => ({
//     id: product.id,
//     title: product.name,
//     rating: product.name === "Baby Stroller" ? 4.7 : 4.5,
//     reviews: product.name === "Baby Stroller" ? 120 : 130,
//     discount: product.name === "Baby Stroller" ? 120 : 8,
//     netPrice: product.name === "Baby Stroller" ? 180 : 10,
//     imageUrl: product.image,
//     discount: product.name === "Baby Stroller" ? "20%" : "15%",
//     saleEndsAt: "31-4-2024",
//   }));

// const bestSellers = products
//   .filter((p) =>
//     ["SOFTFRUITS", "JPS BLUE SK19", "OLD HOLBORN 50GRM"].includes(p.name)
//   )
//   .map((product) => ({
//     id: product.id,
//     title: product.name,
//     rating: product.rating,
//     reviews: product.noOfreviews,
//     imageUrl: product.image,
//   }));

// const featuredProducts = products
//   .filter((p) =>
//     ["CHESTERFIELD RED 20'S", "SNICKERS", "NESCAFE 100G"].includes(p.name)
//   )
//   .map((product) => ({
//     id: product.id,
//     title: product.name,
//     description: product.description.slice(0, 20) + "...",
//     imageUrl: product.image,
//   }));

// const recommendedProducts: any = [];
const exclusiveOffers: any = [];
const bestSellers: any = [];
const featuredProducts: any = [];

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { width } = useWindowDimensions();
  //Device Breakpoints
  const isMobile = width < 768;
  // const isTablet = width >= 768 && width < 1024;
  const isTabOrDesktop = width >= 768;

  const HeaderComponent = isTabOrDesktop ? <BrandHeaderWeb /> : <BrandHeader />;
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <Footer activeTab="home" />;

  // const handleBannerPress = (item: any, index: number) => {
  //   redirectToPage(containers.offersScreen);
  // };

  // const renderBanner = () => <HeroBanner onBannerPress={handleBannerPress} />;

  // const renderFeaturedProducts = () => (
  //   <View>
  //     <Text style={globalStyles.sectionTitleStyle}>Featured Products</Text>
  //     <FlatList
  //       horizontal
  //       data={featuredProducts}
  //       renderItem={({ item }) => (
  //         <TouchableOpacity
  //           style={styles.featuredCard}
  //           onPress={() =>
  //             redirectToPage(containers.productDetailScreen, {
  //               productId: item.id,
  //             })
  //           }
  //         >
  //           <Image source={item.imageUrl} style={styles.featuredImage} />
  //           <Text style={styles.featuredTitle}>{item.title}</Text>
  //           <Text style={styles.featuredDescription}>{item.description}</Text>
  //         </TouchableOpacity>
  //       )}
  //       keyExtractor={(item) => item.id}
  //       showsHorizontalScrollIndicator={false}
  //       contentContainerStyle={styles.productsList}
  //     />
  //   </View>
  // );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        console.log("Categories:", data);
        const sortedData = data.sort((a, b) => {
          if (a.name === "All") return -1; 
          if (b.name === "All") return 1;
          return a.id - b.id; 
        });
        setCategories(sortedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;

  return (
    <LayoutComponent
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      scrollable
    >
      <View style={styles.container}>
        <Header />

        {/* Categories */}
        {!isTabOrDesktop && (
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
                  <CategoryItem_Home
                    name={item.name}
                    imageUrl={item.images?.[0] || ""}
                    onPress={() =>
                      item.name === "All"
                        ? redirectToPage(containers.categoriesScreen, {
                            category: item.name,
                            categoryId: item.id,
                          })
                        : redirectToPage(containers.searchResultsScreen, {
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
        )}


        {/* Banner */}
        {/* <View>{renderBanner()}</View> */}

        {/* Recommended Products */}
        {/* <View>
          <RecommendedProductsSlider
            recommendedProducts={recommendedProducts}
            sectionTitleStyle={globalStyles.sectionTitleStyle}
            title="Recommended for You"
          />
        </View> */}

        {/* Exclusive Offers */}
        {/* <View>
          <ExclusiveOffers exclusiveOffers={exclusiveOffers} />
        </View> */}

        {/* Best Sellers */}
        {/* <View>
          <RecommendedProductsSlider
            recommendedProducts={bestSellers}
            sectionTitleStyle={globalStyles.sectionTitleStyle}
            title="Best Sellers"
          />
        </View> */}

        {/* Featured Products */}
        {/* {renderFeaturedProducts()} */}
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    paddingRight: 10,
    paddingBottom: 10,
  },
  categoriesContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default HomePage;