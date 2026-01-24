import React, { useState, useEffect, useMemo } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  StatusBar,
  Linking,
  ScrollView,
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
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import Button from "@/app/components/commonComponents/Button";
import CarouselWeb from "@/app/components/commonComponentsWeb/carousal";
import { promotionService } from "@/services/promotionService";
import globalSettingsAPI from "@/services/globalSettingsService";
import { recommendationService, RecommendedProduct } from "@/services/recommendationService";
import ProductCard from "@/app/components/ProductCard";
import { useAuth } from "@/context/AuthContext";

interface Promotion {
  imageURL: string;
  link?: string;
  isInternalLink: boolean;
  title?: string;
  description?: string;
}

// const TEST_PROMOTIONS: Promotion[] = [
//   {
//     id: 1,
//     image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
//     link: "https://example.com/promo1",
//     title: "Summer Sale",
//     description: "Get 50% off on all items",
//   },
//   {
//     id: 2,
//     image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800",
//     link: "https://example.com/promo2",
//     title: "New Arrivals",
//     description: "Check out our latest collection",
//   },
//   {
//     id: 3,
//     image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800",
//     link: "https://example.com/promo3",
//     title: "Special Offer",
//     description: "Limited time only - Buy 2 Get 1 Free",
//   },
// ];

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(true);
  const [carousalEnabled, setCarousalEnabled] = useState(false);
  const [globalSettingsLoaded, setGlobalSettingsLoaded] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [recommendedProductsLoading, setRecommendedProductsLoading] = useState(true);
  const [recommendedProductsError, setRecommendedProductsError] = useState<string | null>(null);
  const [recommendationType, setRecommendationType] = useState<"recommended" | "hot_selling">("hot_selling");
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = !isWeb;

  // Split categories for two-row layout: first half in row 1, second half in row 2
  // Items fill Row 1 left to right, then continue in Row 2
  const categoriesPerRow = useMemo(() => {
    if (categories.length === 0) return 0;
    // Split roughly in half, with preference for row 1 if odd number
    return Math.ceil(categories.length / 2);
  }, [categories.length]);

  const HeaderComponent = isWeb ? <BrandHeaderWeb /> : <BrandHeader />;
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer activeTab="home" />
  );
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  // For web, use wider carousel that accounts for PageLayoutWeb padding
  // PageLayoutWeb uses dynamic padding (max 80px per side), so we subtract more for web
  // This ensures the carousel is properly sized for desktop layout
  const carouselWidth = isWeb ? Math.max(width - 200, 800) : width - 32;

  const fetchGlobalSettings = async () => {
    try {
      const response = await globalSettingsAPI.getSettings();
      // console.log("response global settings", response.data);
      setCarousalEnabled(response.data?.displayCarousel);
    } catch (error) {
      console.error("Failed to fetch global settings:", error);
      setCarousalEnabled(true);
    } finally {
      setGlobalSettingsLoaded(true);
    }
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  // Helper function to normalize category names for comparison
  // Handles hyphens, underscores, extra spaces, case differences, and trailing 's'
  const normalizeForComparison = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  };

  // More flexible matching that handles singular/plural differences
  const categoryNamesMatch = (name1: string, name2: string) => {
    const norm1 = normalizeForComparison(name1);
    const norm2 = normalizeForComparison(name2);

    // Exact match after normalization
    if (norm1 === norm2) return true;

    // Handle singular/plural by removing trailing 's' from each word
    const removePlural = (str: string) =>
      str
        .split(" ")
        .map((word) => word.replace(/s$/, ""))
        .join(" ");
    if (removePlural(norm1) === removePlural(norm2)) return true;

    // Check if one contains the other (for partial matches like "electronic" vs "electronics")
    const words1 = norm1.split(" ");
    const words2 = norm2.split(" ");

    // Check if all words match (ignoring trailing 's')
    if (words1.length === words2.length) {
      const allMatch = words1.every((w1, i) => {
        const w2 = words2[i];
        return w1 === w2 || w1.replace(/s$/, "") === w2.replace(/s$/, "");
      });
      if (allMatch) return true;
    }

    return false;
  };

  const handleBannerPress = useMemo(
    () => async (item: any, index: number) => {
      // PRIORITY 1: Category-based promotion
      // If promotion.category exists → redirect to category page (like HeaderNavBarWeb)
      if (item.category !== undefined && item.category !== null && item.category !== "") {
        try {
          // Parse category ID (can be string "28", number 28, or populated object)
          const categoryIdToFind =
            typeof item.category === "object"
              ? item.category.id
              : typeof item.category === "string"
              ? parseInt(item.category, 10)
              : item.category;

          // Skip if not a valid number
          if (isNaN(categoryIdToFind)) {
            return;
          }

          // Fetch all categories and find by numeric id
          const allCategories = await categoryService.getAllCategories();
          const foundCategory = allCategories.find((cat) => cat.id === categoryIdToFind);

          if (foundCategory) {
            // Redirect EXACTLY like HeaderNavBarWeb.handleCategoryPress
            redirectToPage(containers.searchResultsScreen, {
              fromSearch: true,
              category: foundCategory.name,
              categoryId: foundCategory.id,
            });
            return; // Exit after successful redirect
          }
        } catch (error) {
          // Silent fail - continue to next priority
        }
      }

      // PRIORITY 2: Product-based promotion
      // If no category but has products → redirect to promotion products page
      if (Array.isArray(item.products) && item.products.length > 0) {
        try {
          redirectToPage(containers.promotionProductsScreen, {
            title: item.title || "Special Offers",
            products: JSON.stringify(item.products),
          });
          return; // Exit after successful redirect
        } catch (error) {
          // Silent fail
        }
      }

      // PRIORITY 3: Fallback
      // If neither category nor products exist → do nothing
      // link field is preserved for future CMS usage but not used for navigation
    },
    []
  );
  const carouselData = useMemo(() => {
    return promotions.map((promo: any, index) => ({
      id: index + 1,
      image: promo.imageURL,
      link: promo.link, // Preserved for future CMS usage
      title: promo.title,
      description: "", // Add if you have description in your schema
      isInternalLink: promo.isInternalLink, // Metadata only
      category: promo.category, // For category-based navigation
      products: promo.products, // For product-based navigation (offers)
      onPress: handleBannerPress,
    }));
  }, [promotions, handleBannerPress]);

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

  // Check if all initial data is loaded
  useEffect(() => {
    if (!loading && !promotionsLoading && globalSettingsLoaded) {
      setIsInitialLoading(false);
    }
  }, [loading, promotionsLoading, globalSettingsLoaded]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setPromotionsLoading(true);
        const data = await promotionService.getAllPromotions();
        // Filter to only show live promotions (isLive: true)
        const livePromotions = data.filter((promo: any) => promo.isLive === true);
        setPromotions(livePromotions);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        // Optionally set empty array or show error message
        setPromotions([]);
      } finally {
        setPromotionsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  // Fetch recommended products (wait for auth to be determined first)
  useEffect(() => {
    // Wait for authentication state to be determined before fetching
    if (isAuthLoading) {
      return; // Don't fetch while auth is still loading
    }

    const fetchRecommendedProducts = async () => {
      try {
        setRecommendedProductsLoading(true);
        setRecommendedProductsError(null);
        // console.log("[Home] Fetching recommended products, isAuthenticated:", isAuthenticated, "(auth loaded)");
        const response = await recommendationService.getRecommendedProducts(10);
        // console.log("[Home] Recommended products received:", response?.products?.length || 0, "products (type:", response?.type || "unknown", ")");
        if (response && response.products && response.products.length > 0) {
          // console.log("[Home] ✅ Products fetched successfully for recommendations");
          // console.log("[Home] Product details:", response.products.map(p => ({ id: p.id, name: p.name })));
          setRecommendedProducts(response.products);
          setRecommendationType(response.type);
        } else {
          // console.log("[Home] ⚠️ No recommended products returned");
          // console.log("[Home] This could mean: User has no orders, or products from orders not found in database");
          setRecommendedProducts([]);
          setRecommendationType("hot_selling");
        }
      } catch (error: any) {
        console.error("[Home] Error fetching recommended products:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to load recommendations";
        console.error("[Home] Error details:", {
          message: errorMessage,
          status: error?.response?.status,
          data: error?.response?.data,
        });
        setRecommendedProductsError(errorMessage);
        setRecommendedProducts([]);
        setRecommendationType("hot_selling");
      } finally {
        setRecommendedProductsLoading(false);
      }
    };
    fetchRecommendedProducts();
  }, [isAuthenticated, isAuthLoading]);

  // Show full-screen loader until all required data is loaded
  if (isInitialLoading) {
    return (
      <View style={styles.fullScreenLoader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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

        {isMobile && (
          <View style={styles.categoriesContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
            <View style={styles.categoriesViewport}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesScrollContent}
              >
                <View style={styles.categoriesRowsContainer}>
                  <View style={styles.categoryRow}>
                    {categories.slice(0, categoriesPerRow).map((item) => (
                      <CategoryItem_Home
                        key={item.id}
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
                    ))}
                  </View>
                  <View style={styles.categoryRow}>
                    {categories.slice(categoriesPerRow).map((item) => (
                      <CategoryItem_Home
                        key={item.id}
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
                    ))}
                  </View>
                </View>
              </ScrollView>
            </View>
            )}
          </View>
        )}
        {/* <Button
          title="Go to Upload Page"
          onPress={() => redirectToPage(containers.uploadScreen)}
        /> */}
        {carousalEnabled && (
          <View
            style={[
              styles.carouselSection,
              isWeb && { marginTop: 32 },
            ]}
          >
            {promotionsLoading ? (
              <View style={styles.carouselLoader}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : promotions.length > 0 ? (
              <CarouselWeb
                data={carouselData}
                isPromotional={true}
                showOverlay={true}
                autoPlay={true}
                autoPlayInterval={4500}
                loop={true}
                showArrows={true}
                showIndicators={true}
                width={carouselWidth}
                height={isWeb ? 420 : 230}
                borderRadius={12}
              />
            ) : null}
          </View>
        )}
        
         {/* Recommended / Hot Selling Products Section */}
         {!isAuthLoading && (recommendedProductsLoading || recommendedProducts.length > 0 || recommendedProductsError) && (
           <View style={styles.recommendedSection}>
             <Text style={styles.sectionTitle}>
               {recommendationType === "recommended" ? "Recommended for You" : "Hot Selling Products"}
             </Text>
            {recommendedProductsLoading ? (
              <View style={styles.recommendedLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : recommendedProductsError ? (
              <View style={styles.recommendedLoader}>
                <Text style={styles.errorText}>
                  {recommendedProductsError}
                </Text>
              </View>
            ) : recommendedProducts.length > 0 ? (
              <FlatList
                horizontal
                data={recommendedProducts}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recommendedList}
                renderItem={({ item }) => {
                  // Convert RecommendedProduct to ProductCard format
                  // ProductCard calculates: Final price = netPrice - discount
                  // ProductCard shows discount percentage if discount > 0
                  // The API returns: price (final price), netPrice (original price if discount exists)
                  const finalPrice = item.price || 0;
                  const originalPrice = item.netPrice || item.price || 0;
                  
                  // To hide discount percentage, set discount to 0
                  // If there's an actual discount, we could show it, but user wants to hide it
                  // So we'll set discount to 0 and use netPrice as the final price
                  const productCardProps = {
                    id: item.id.toString(),
                    name: item.name,
                    rating: item.rating,
                    noOfreviews: item.reviews || 0,
                    noOfReviews: item.reviews || 0, // Alias for type compatibility
                    reviews: [], // Empty array for type compatibility (reviews is an array of review objects)
                    isReturnable: false, // Default value
                    discount: 0, // Set to 0 to hide discount percentage
                    netPrice: finalPrice, // Use final price as netPrice (no discount shown)
                    image: item.imageUrl || require("@/assets/Placeholder.png"),
                    categoryId: [],
                    description: "",
                    isVatApplicable: false,
                    vatRate: 0,
                    vatAmount: 0,
                  } as any; // Type assertion to handle ProductCard prop compatibility
                  return (
                    <View style={styles.recommendedCardWrapper}>
                      <ProductCard {...productCardProps} />
                    </View>
                  );
                }}
              />
            ) : null}
          </View>
        )}
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
  fullScreenLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  carouselSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  carouselLoader: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  recommendedSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
    color: colors.black,
  },
  recommendedList: {
    paddingHorizontal: 8,
  },
  recommendedCardWrapper: {
    width: 160,
    marginHorizontal: 8,
  },
  recommendedLoader: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.secondaryText,
    fontSize: 14,
    textAlign: "center",
  },
  categoriesScrollContent: {
    // paddingHorizontal: 8,
    // paddingLeft: 0,
    // paddingRight: 16, 
  },
  categoriesRowsContainer: {
    flexDirection: "column",
  },
  categoryRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  categoriesViewport: {
    width: "100%",
    alignSelf: "flex-start",
  },

});

export default HomePage;
