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
import { useWebMediaQuery } from "@/hooks/useWebMediaQuery";
import { ProductsAPI, Product } from "@/services/productService";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";

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
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const [carousalEnabled, setCarousalEnabled] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [recommendedProductsLoading, setRecommendedProductsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { width } = useWindowDimensions();
  const { isWeb, isMobile, isTablet, isDesktop } = useWebMediaQuery();
  
  // Always use web components when Platform.OS is "web" (including mobile browsers)
  // Use media queries for responsive behavior
  const isTabOrDesktop = isWeb && (isTablet || isDesktop);
  const isMobileWeb = isWeb && isMobile;

  // Always use web components for web platform (desktop and mobile browsers)
  const HeaderComponent = isWeb ? <BrandHeaderWeb /> : <BrandHeader />;
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer activeTab="home" />
  );
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;

  // Responsive carousel width based on media queries
  // Account for PageLayoutWeb padding: desktop (64px each side), tablet (32px), mobile (16px)
  // For mobile web: PageLayoutWeb adds 16px padding + carouselSection adds 16px padding = 32px each side = 64px total
  // For tablet: PageLayoutWeb adds 32px padding, carouselSection has no padding = 32px each side = 64px total
  // For desktop: PageLayoutWeb adds 64px padding, carouselSection has no padding = 64px each side = 128px total
  const carouselWidth = isWeb 
    ? (isDesktop 
        ? width - 128  // Desktop: PageLayoutWeb padding (64*2)
        : isTablet 
          ? width - 64  // Tablet: PageLayoutWeb padding (32*2)
          : width - 64  // Mobile: PageLayoutWeb padding (16*2) + carouselSection padding (16*2) = 64
      )
    : width - 32;

  const fetchGlobalSettings = async () => {
    try {
      const response = await globalSettingsAPI.getSettings();
      // console.log("response global settings", response.data);
      setCarousalEnabled(response.data?.displayCarousel);
    } catch (error) {
      console.error("Failed to fetch global settings:", error);
      setCarousalEnabled(true);
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
      // console.log("item", item);
      // item is from carouselData, which has: id, image, link, title, description, isInternalLink
      if (item.isInternalLink && item.link) {
        try {
          // Parse the link format: "offers/electronics-sale" or just "offers"
          const linkParts = item.link
            .split("/")
            .filter((part: string) => part.trim() !== "");
          const parentCategoryName = linkParts[0] || item.title || "Offers";
          const subCategoryName = linkParts[1] || null;

          // console.log("Carousel link parsed:", { parentCategoryName, subCategoryName, originalLink: item.link });

          // Fetch all categories to find the parent category by name
          const allCategories = await categoryService.getAllCategories();
          const parentCategory = allCategories.find((cat) =>
            categoryNamesMatch(cat.name, parentCategoryName)
          );

          if (!parentCategory) {
            console.error(`Parent category "${parentCategoryName}" not found`);
            // Fallback: redirect with the link as categoryId (original behavior)
            redirectToPage(containers.searchResultsScreen, {
              fromSearch: true,
              category: parentCategoryName,
              categoryId: item.link,
            });
            return;
          }

          // console.log("Found parent category:", parentCategory.name, "ID:", parentCategory.id);

          // If there's a subcategory, find it
          if (subCategoryName) {
            const subCategories = await categoryService.getAllSubCategories(
              parentCategory.id
            );

            // console.log("Available subcategories:", subCategories.map(s => s.name));

            const subCategory = subCategories.find((subCat) =>
              categoryNamesMatch(subCat.name, subCategoryName)
            );

            if (subCategory) {
              // Navigate directly to the subcategory as the main category
              redirectToPage(containers.searchResultsScreen, {
                fromSearch: true,
                category: subCategory.name,
                categoryId: subCategory.id,
              });
              // // console.log(
              //   `Navigating to category: ${parentCategory.name}, subcategory: ${subCategory.name}`
              // );
            } else {
              // Subcategory not found, navigate to parent category only
              console.warn(
                `Subcategory "${subCategoryName}" not found under "${parentCategoryName}"`
              );
              redirectToPage(containers.searchResultsScreen, {
                fromSearch: true,
                category: parentCategory.name,
                categoryId: parentCategory.id,
              });
            }
          } else {
            // No subcategory, navigate to parent category only
            redirectToPage(containers.searchResultsScreen, {
              fromSearch: true,
              category: parentCategory.name,
              categoryId: parentCategory.id,
            });
          }
        } catch (error) {
          console.error("Error processing carousel link:", error);
          // Fallback: redirect with the link as categoryId (original behavior)
          redirectToPage(containers.searchResultsScreen, {
            fromSearch: true,
            category: item.title || "Offers",
            categoryId: item.link,
          });
        }
      } else if (item.link) {
        // console.log("Opening external link:", item.link);
        if (Platform.OS === "web") {
          window.open(item.link, "_blank");
        } else {
          // For mobile, use Linking API
          Linking.openURL(item.link);
        }
      }
    },
    []
  );
  const carouselData = useMemo(() => {
    return promotions.map((promo, index) => ({
      id: index + 1,
      image: promo.imageURL,
      link: promo.link,
      title: promo.title,
      description: "", // Add if you have description in your schema
      isInternalLink: promo.isInternalLink, // Preserve the internal link flag
      onPress: handleBannerPress, // Add the handler to each item
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

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setPromotionsLoading(true);
        const data = await promotionService.getAllPromotions();
        setPromotions(data);
        // console.log("Fetched promotions:", data);
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

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setRecommendedProductsLoading(true);
        const response = await ProductsAPI.getAllProducts(1, 8);
        // Transform products to match RecommendedProductsSlider format
        const formattedProducts = response.data.slice(0, 8).map((product: Product) => {
          // Handle image - can be string, array, or object
          let imageUrl;
          if (Array.isArray(product.image)) {
            imageUrl = product.image.length > 0 
              ? { uri: product.image[0] } 
              : require("@/assets/Placeholder.png");
          } else if (typeof product.image === 'string') {
            imageUrl = { uri: product.image };
          } else {
            imageUrl = product.image || require("@/assets/Placeholder.png");
          }

          return {
            id: product._id || product.id,
            title: product.name,
            rating: product.rating || 0,
            reviews: product.noOfreviews || 0,
            imageUrl: imageUrl,
            netPrice: product.netPrice || 0,
            isVatApplicable: product.isVatApplicable || false,
            vatRate: product.vatRate || 0,
            vatAmount: product.vatAmount || 0,
          };
        });
        setRecommendedProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
        setRecommendedProducts([]);
      } finally {
        setRecommendedProductsLoading(false);
      }
    };
    
    fetchRecommendedProducts();
  }, []);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({
      id: item.id,
      name: item.title,
      netPrice: item.netPrice,
      image: item.imageUrl,
      quantity: 1,
      isVatApplicable: item.isVatApplicable || false,
      vatRate: item.vatRate || 0,
      vatAmount: item.vatAmount || 0,
    }));
  };

  return (
    <LayoutComponent
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      scrollable
    >
      <View style={[
        styles.container, 
        !isWeb && styles.containerMobile,
        isWeb && styles.containerWeb
      ]}>
        {!isWeb && <Header />}

        {!isWeb && (
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
        {/* <Button
          title="Go to Upload Page"
          onPress={() => redirectToPage(containers.uploadScreen)}
        /> */}
        {carousalEnabled && (
          <View
            style={[
              styles.carouselSection,
              isTabOrDesktop && styles.carouselSectionDesktop,
              isMobileWeb && styles.carouselSectionMobile,
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
                height={isDesktop ? 420 : isTablet ? 350 : 230}
                borderRadius={12}
              />
            ) : null}
          </View>
        )}

        {/* Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <View
            style={[
              styles.recommendedSection,
              isTabOrDesktop && styles.recommendedSectionDesktop,
              isMobileWeb && styles.recommendedSectionMobile,
            ]}
          >
            {recommendedProductsLoading ? (
              <View style={styles.recommendedLoader}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              <RecommendedProductsSlider
                recommendedProducts={recommendedProducts}
                title="Recommended for You"
                sectionTitleStyle={[
                  globalStyles.sectionTitleStyle,
                  isMobileWeb && styles.recommendedTitleMobile,
                ]}
                showAddToCart={true}
                handleAdd={handleAddToCart}
              />
            )}
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
  containerWeb: {
    marginVertical: 0,
  },
  containerMobile: {
    flex: 0, // Override flex: 1 to allow scrolling in ScrollView
    // Content will determine its own height naturally
  },
  carouselSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
    width: "100%",
    alignItems: "center",
  },
  carouselSectionMobile: {
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    width: "100%",
  },
  carouselSectionDesktop: {
    marginTop: 32,
    paddingHorizontal: 0, // Padding handled by PageLayoutWeb
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
    marginVertical: 16,
    paddingHorizontal: 16,
    width: "100%",
  },
  recommendedSectionMobile: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    width: "100%",
  },
  recommendedSectionDesktop: {
    marginTop: 32,
    paddingHorizontal: 0, // Padding handled by PageLayoutWeb
  },
  recommendedLoader: {
    height: 280,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendedTitleMobile: {
    fontSize: 18,
    marginLeft: 0,
  },
});

export default HomePage;
