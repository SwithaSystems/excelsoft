import React, { useMemo, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  useWindowDimensions,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { Product, ProductsAPI } from "@/services/productService";
import NoContentFound from "@/app/components/NoContentFound";
import ProductCard from "@/app/components/ProductCard";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import colors from "@/constants/colors";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Footer from "@/app/components/Footer";

/**
 * PromotionProducts Screen
 * 
 * Displays products attached to a promotion.
 * Uses the same UI layout as category product listing (SearchResults).
 * 
 * Navigation params:
 * - title: Promotion title (string)
 * - products: JSON stringified array of products
 */
const PromotionProductsScreen = () => {
  const { title, products: productsParam } = useLocalSearchParams();
  const { width: windowWidth } = useWindowDimensions();

  const width = Platform.OS === "web" ? Math.max(windowWidth, 1200) : windowWidth;
  const isWeb = Platform.OS === "web";

  // Parse promotion title
  const promotionTitle = useMemo(() => {
    return title?.toString() || "Special Offers";
  }, [title]);

  // State for fetched products
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sort state for mobile
  const [sortOption, setSortOption] = useState("relevance");
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const sortOptions = [
    { label: "Relevance", value: "relevance" },
    { label: "Low to High", value: "lowToHigh" },
    { label: "High to Low", value: "highToLow" },
  ];

  // Sorted products based on selected sort option
  const sortedProducts = useMemo(() => {
    if (!products.length) return products;
    
    const sorted = [...products];
    switch (sortOption) {
      case "lowToHigh":
        return sorted.sort((a, b) => (a.netPrice || 0) - (b.netPrice || 0));
      case "highToLow":
        return sorted.sort((a, b) => (b.netPrice || 0) - (a.netPrice || 0));
      default:
        return sorted;
    }
  }, [products, sortOption]);

  // Parse products param and fetch full product details if needed
  useEffect(() => {
    const fetchProducts = async () => {
      if (!productsParam) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(productsParam.toString());
        if (!Array.isArray(parsed) || parsed.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        // Check if products are just IDs (strings) or full objects
        const firstItem = parsed[0];
        const areProductIds = typeof firstItem === 'string';

        if (areProductIds) {
          // Products are MongoDB ObjectId strings - fetch full product details
          console.log("Fetching products by IDs:", parsed);
          try {
            const fetchedProducts = await ProductsAPI.getProductBy_multipleID(parsed);
            console.log("Fetched products:", fetchedProducts.length);
            setProducts(fetchedProducts);
          } catch (fetchError) {
            console.error("Failed to fetch products by IDs:", fetchError);
            setProducts([]);
          }
        } else {
          // Products are already full objects - filter valid ones
          const validProducts = parsed.filter((item: any) => {
            if (!item || typeof item !== 'object') return false;
            if (!item.name || typeof item.name !== 'string') return false;
            if (item.id === undefined && item._id === undefined) return false;
            return true;
          });
          setProducts(validProducts);
        }
      } catch (error) {
        console.warn("Failed to parse promotion products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [productsParam]);

  // Render product item - matches SearchResults layout
  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      // Safety check - skip if item is invalid
      if (!item || !item.name) return null;

      const imageUrl = Array.isArray(item.image) ? item.image[0] || "" : item.image || "";

      if (isWeb) {
        return (
          <View style={styles.productItemWeb}>
            <ProductCard
              _id={item._id || ""}
              id={item.id || ""}
              name={item.name || "Product"}
              description={item.description || ""}
              netPrice={item.netPrice || 0}
              image={imageUrl}
              productColors={item.productColors || []}
              categoryId={item.categoryId || 0}
              rating={item.rating || 0}
              noOfreviews={item.noOfreviews || 0}
              reviews={item.reviews || []}
              noOfReviews={0}
              isReturnable={false}
              isVatApplicable={item.isVatApplicable || false}
              vatRate={item.vatRate || 0}
              vatAmount={item.vatAmount || 0}
            />
          </View>
        );
      } else {
        // Mobile layout: 2-column grid
        const isEven = index % 2 === 0;
        return (
          <View
            style={[
              styles.productItem,
              isEven ? styles.leftItem : styles.rightItem,
            ]}
          >
            <ProductCard
              _id={item._id || ""}
              id={item.id || ""}
              name={item.name || "Product"}
              description={item.description || ""}
              netPrice={item.netPrice || 0}
              image={imageUrl}
              productColors={item.productColors || []}
              categoryId={item.categoryId || 0}
              rating={item.rating || 0}
              noOfreviews={item.noOfreviews || 0}
              reviews={item.reviews || []}
              noOfReviews={0}
              isReturnable={false}
              isVatApplicable={item.isVatApplicable || false}
              vatRate={item.vatRate || 0}
              vatAmount={item.vatAmount || 0}
            />
          </View>
        );
      }
    },
    [isWeb]
  );

  // Render filter bar for mobile (similar to CategoryBadges)
  const renderFilterBar = () => {
    return (
      <View style={styles.filterBarContainer}>
        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* "All" badge - always active for promotion products */}
            <TouchableOpacity style={[styles.filterButton, styles.activeFilterButton]}>
              <Text style={[styles.filterText, styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.fixedIcons}>
            {/* Filter icon */}
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="funnel-outline" size={24} color={colors.black} />
            </TouchableOpacity>

            {/* Sort icon */}
            <TouchableOpacity
              style={[styles.iconButton, { marginLeft: 16 }]}
              onPress={() => setIsSortModalVisible(true)}
            >
              <Ionicons name="swap-vertical" size={24} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Render sort modal for mobile
  const renderSortModal = () => (
    <Modal
      visible={isSortModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsSortModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsSortModalVisible(false)}
      >
        <View style={styles.dropdownContent}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                setSortOption(option.value);
                setIsSortModalVisible(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortOption === option.value && styles.activeSortOption,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Render content based on products availability
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (sortedProducts.length === 0) {
      return (
        <View style={{ flex: 1 }}>
          <NoContentFound message="No products available for this promotion" />
        </View>
      );
    }

    if (isWeb) {
      // Web: Grid layout matching SearchResults
      const numColumns = 5;
      const gap = 16;
      const horizontalPadding = Math.max(24, Math.min(width * 0.05, 80));
      const availableWidth = width - horizontalPadding * 2;
      const totalGapWidth = gap * (numColumns - 1);
      const calculatedCardWidth = (availableWidth - totalGapWidth) / numColumns;
      const cardWidth = Math.max(180, calculatedCardWidth);

      return (
        <View style={styles.productsGridWeb}>
          {sortedProducts.map((item, index) => (
            <View
              key={item?.id ? `product-${item.id}` : `item-${index}`}
              style={[
                styles.productItemWeb,
                {
                  width: cardWidth,
                  maxWidth: cardWidth,
                },
              ]}
            >
              <ProductCard
                _id={item._id || ""}
                id={item.id || ""}
                name={item.name || "Product"}
                description={item.description || ""}
                netPrice={item.netPrice || 0}
                image={Array.isArray(item.image) ? item.image[0] || "" : item.image || ""}
                productColors={item.productColors || []}
                categoryId={item.categoryId || 0}
                rating={item.rating || 0}
                noOfreviews={item.noOfreviews || 0}
                reviews={item.reviews || []}
                noOfReviews={0}
                isReturnable={false}
                isVatApplicable={item.isVatApplicable || false}
                vatRate={item.vatRate || 0}
                vatAmount={item.vatAmount || 0}
              />
            </View>
          ))}
        </View>
      );
    }

    // Mobile: FlatList with 2-column grid
    return (
      <FlatList
        data={sortedProducts}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id ? `product-${item.id}` : `item-${index}`
        }
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  // Web layout
  if (isWeb) {
    return (
      <PageLayoutWeb
        hasHeader={true}
        hasFooter={true}
        headerComponent={<BrandHeaderWeb />}
        footerComponent={<FooterWeb />}
      >
        <View style={styles.webContainer}>
          <View
            style={{
              width: "100%",
              maxWidth: 1400,
              alignSelf: "center",
            }}
          >
            {/* Page Title */}
            <View style={styles.resultsHeaderContainerWeb}>
              <Text style={styles.resultsTitleWeb}>{promotionTitle}</Text>
              <Text style={styles.resultsCountWeb}>
                {products.length} {products.length === 1 ? "product" : "products"}
              </Text>
            </View>

            {/* Products Grid */}
            <View style={styles.productsContainerWeb}>{renderContent()}</View>
          </View>
        </View>
      </PageLayoutWeb>
    );
  }

  // Mobile layout
  return (
    <KeyBoardWrapper>
      <PageLayout>
        <View style={styles.container}>
          <Header title={promotionTitle} showBackButton />
          {/* Filter bar with All badge and sort/filter icons */}
          {renderFilterBar()}
          {/* Products grid */}
          {renderContent()}
          {/* Sort modal */}
          {renderSortModal()}
        </View>
        <Footer />
      </PageLayout>
    </KeyBoardWrapper>
  );
};

const { width: screenWidth } = require("react-native").Dimensions.get("window");
const itemWidth = (screenWidth - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    marginTop: 10,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.reviewsColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContainer: {
    padding: 8,
    paddingTop: 0,
  },
  row: {
    justifyContent: "space-between",
  },
  productItem: {
    width: itemWidth,
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  leftItem: {
    marginRight: 8,
    flex: 1,
  },
  rightItem: {
    marginLeft: 8,
    flex: 1,
  },
  // Web styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 16,
  },
  resultsHeaderContainerWeb: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
  },
  resultsTitleWeb: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
    flex: 1,
  },
  resultsCountWeb: {
    fontSize: 16,
    color: colors.reviewsColor,
  },
  productsContainerWeb: {
    flex: 1,
    width: "100%",
  },
  productsGridWeb: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "flex-start",
  },
  productItemWeb: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  // Filter bar styles (matching CategoryBadges)
  filterBarContainer: {
    backgroundColor: colors.white,
    paddingBottom: 16,
  },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingRight: 16,
    alignItems: "center",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    marginRight: 12,
    marginLeft: 0,
    maxWidth: 120,
    shadowColor: colors.pureBlack,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.black,
    minWidth: 30,
    textAlign: "center",
  },
  activeFilterText: {
    color: colors.black,
    fontWeight: "bold",
  },
  fixedIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    paddingLeft: 0,
  },
  iconButton: {
    width: 35,
    height: 35,
    padding: 2,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  // Sort modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContent: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: "100%",
  },
  sortOptionText: {
    padding: 16,
    fontSize: 14,
    color: colors.black,
  },
  activeSortOption: {
    backgroundColor: colors.secondary,
  },
});

export default PromotionProductsScreen;
