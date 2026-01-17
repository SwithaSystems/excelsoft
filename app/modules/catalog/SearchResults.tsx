import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import { Product, ProductsAPI } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import NoContentFound from "@/app/components/NoContentFound";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import styles from "./SearchResultsStyles";
import ProductCard from "@/app/components/ProductCard";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import Footer from "@/app/components/Footer";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import CategoryBadges from "./Components/CategoryBadges";
import colors from "@/constants/colors";

const SearchResultsScreen = () => {
  const { fromSearch, query, category, categoryId, selectedSubCategories } =
    useLocalSearchParams();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  const width =
    Platform.OS === "web"
      ? Math.max(windowWidth, 1200)
      : windowWidth;

  const isWeb = Platform.OS === "web";

  // Ref to track component mount status
  const isMountedRef = useRef(true);

  // Convert params to proper types - useMemo to prevent recalculation
  const { isFromSearch, searchQuery, categoryName, parsedCategoryId } = useMemo(
    () => ({
      isFromSearch: fromSearch === "true",
      searchQuery: query?.toString() || "",
      categoryName: category?.toString() || "",
      parsedCategoryId: Number(categoryId) || 0,
    }),
    [fromSearch, query, category, categoryId]
  );

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number>(parsedCategoryId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialDataLoaded, setHasInitialDataLoaded] =
    useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  
  const sortOptions = [
    { label: "Relevance", value: "default" },
    { label: "Low to High", value: "lowToHigh" },
    { label: "High to Low", value: "highToLow" },
  ];

  // Memoize header title to prevent unnecessary re-renders
  const headerTitle = useMemo(() => {
    if (isFromSearch) {
      const subCat = subCategories.find((sc) => sc.id === selectedCategoryId);
      if (subCat) return subCat.name;
      return categoryName || "Search Results";
    }
    return "Search Results";
  }, [isFromSearch, categoryName, selectedCategoryId, subCategories]);

  // Parse selected subcategories - moved to useMemo
  const parsedSubCategoryIds = useMemo(() => {
    if (!selectedSubCategories) return [];

    return Array.isArray(selectedSubCategories)
      ? selectedSubCategories.map((id) => Number(id))
      : selectedSubCategories
          .toString()
          .split(",")
          .map((id) => Number(id.trim()))
          .filter(Boolean);
  }, [selectedSubCategories]);

  // Cleanup function
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const isLoadingMoreRef = useRef(false);
  const lastPageLoadedRef = useRef(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 50;

  // Note: fetchAllProducts is only used for category browsing (isFromSearch)
  // For text search queries, we use server-side search API directly (see useEffect below)
  const fetchAllProducts = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      // Only fetch paginated products for category browsing, not for text search
      // Text search uses server-side API (productsBy_Name_Id) which returns all results
      if (!isFromSearch) {
        // console.log("Skipping fetchAllProducts - using server-side search API instead");
        return;
      }

      // Prevent multiple simultaneous calls
      if (
        isLoadMore &&
        (isLoadingMoreRef.current || lastPageLoadedRef.current >= pageNum)
      ) {
        // console.log(`Skipping page ${pageNum} - already loading or loaded`);
        return;
      }

      if (isLoadMore) {
        setLoadingMore(true);
        isLoadingMoreRef.current = true;
      } else if (pageNum === 1) {
        setIsLoading(true);
        isLoadingMoreRef.current = false;
        lastPageLoadedRef.current = 0;
      }

      try {
        // console.log(`Fetching page ${pageNum}...`);
        const response = await ProductsAPI.getAllProducts(
          pageNum,
          ITEMS_PER_PAGE
        );
        // console.log(
        //   `Page ${pageNum} loaded:`,
        //   response?.data?.length,
        //   "products"
        // );

        if (pageNum === 1) {
          setAllProducts(response.data);
        } else {
          setAllProducts((prev) => [...prev, ...response.data]);
        }

        setTotal(response?.total || 0);
        setPage(pageNum);
        lastPageLoadedRef.current = pageNum;
        setHasInitialDataLoaded(true);
      } catch (err) {
        console.error(`Error fetching page ${pageNum}:`, err);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setLoadingMore(false);
        isLoadingMoreRef.current = false;
      }
    },
    [ITEMS_PER_PAGE, isFromSearch]
  );

  // Fetch search results using server-side search API
  useEffect(() => {
    if (!isFromSearch && searchQuery) {
      let cancelled = false;

      const fetchSearchResults = async () => {
        try {
          setIsLoading(true);
          setError(null);
          setHasInitialDataLoaded(false);
          
          // Use server-side search API (same as admin) to search all products
          const searchResults = await ProductsAPI.productsBy_Name_Id(searchQuery);
          
          // Check if component is still mounted and request wasn't cancelled
          if (!cancelled && isMountedRef.current) {
            // console.log("Search results for query:", searchQuery, "Found:", searchResults?.length || 0, "products");
            setAllProducts(searchResults || []);
            setTotal(searchResults?.length || 0);
            setPage(1);
            setHasInitialDataLoaded(true);
          }
        } catch (err) {
          console.error("Error searching products:", err);
          if (!cancelled && isMountedRef.current) {
            setError("Failed to search products. Please try again.");
            setAllProducts([]);
            setTotal(0);
          }
        } finally {
          if (!cancelled && isMountedRef.current) {
            setIsLoading(false);
          }
        }
      };

      fetchSearchResults();

      // Cleanup function
      return () => {
        cancelled = true;
      };
    } else if (!isFromSearch && !searchQuery) {
      // If no search query, clear products
      setAllProducts([]);
      setTotal(0);
      setHasInitialDataLoaded(false);
    }
  }, [searchQuery, isFromSearch]);

  // FIX 2: Fetch subcategories with proper cleanup
  useEffect(() => {
    if (isFromSearch && parsedCategoryId) {
      let cancelled = false;

      const fetchSubCategories = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await categoryService.getAllSubCategories(
            parsedCategoryId
          );

          if (!cancelled && isMountedRef.current) {
            setSubCategories(data);
          }
        } catch (err) {
          console.error("Error fetching subcategories:", err);
          if (!cancelled && isMountedRef.current) {
            setError("Failed to load categories. Please try again.");
          }
        } finally {
          if (!cancelled && isMountedRef.current) {
            setIsLoading(false);
          }
        }
      };

      fetchSubCategories();

      return () => {
        cancelled = true;
      };
    }
  }, [isFromSearch, parsedCategoryId]);

  useEffect(() => {
    // Only run if we're in category mode or have subcategory filters
    if (!isFromSearch || !parsedCategoryId) return;

    let cancelled = false;

    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);
        setHasInitialDataLoaded(false);
        setError(null);

        let fetchedProducts: Product[] = [];

        // Case 1: Selected subcategories from filters
        if (parsedSubCategoryIds.length > 0) {
          const productPromises = parsedSubCategoryIds.map((id) =>
            ProductsAPI.getProductByCategoryID(id)
          );
          const allSubProducts = await Promise.all(productPromises);
          fetchedProducts = allSubProducts.flat();
        }
        // Case 2: Selected parent category or specific subcategory
        else {
          const targetCategoryId = selectedCategoryId || parsedCategoryId;
          fetchedProducts = await ProductsAPI.getProductByCategoryID(
            targetCategoryId
          );

          // If we're showing the main category and have subcategories, include their products
          if (
            selectedCategoryId === parsedCategoryId &&
            subCategories.length > 0
          ) {
            const subProductPromises = subCategories.map((subCat) =>
              ProductsAPI.getProductByCategoryID(subCat.id)
            );
            const subProducts = await Promise.all(subProductPromises);
            fetchedProducts = [...fetchedProducts, ...subProducts.flat()];
          }
        }

        if (!cancelled && isMountedRef.current) {
          // Remove duplicates by product ID and ensure unique items
          const uniqueProducts = Array.from(
            new Map(fetchedProducts.map((item) => [item.id, item])).values()
          );

          // Additional check to ensure no undefined IDs
          const validProducts = uniqueProducts.filter(
            (product) =>
              product && product.id !== undefined && product.id !== null
          );

          setProducts(validProducts);
          setHasInitialDataLoaded(true);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (!cancelled && isMountedRef.current) {
          setError("Failed to load products. Please try again.");
          setProducts([]);
        }
      } finally {
        if (!cancelled && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchCategoryProducts();

    return () => {
      cancelled = true;
    };
  }, [
    isFromSearch,
    parsedCategoryId,
    selectedCategoryId,
    parsedSubCategoryIds,
    subCategories.length,
  ]);

  const displayProducts = useMemo(() => {
    let baseProducts: Product[] = [];

    if (isFromSearch) {
      // Category-based search - use products from category
      baseProducts = products;
    } else if (searchQuery) {
      // Text search - use server-side search results (already filtered by API)
      baseProducts = allProducts;
    }

    // Apply sorting
    if (baseProducts.length === 0) return [];

    // Ensure all products have valid IDs before sorting
    const validProducts = baseProducts.filter(
      (product) => product && product.id !== undefined && product.id !== null
    );

    const uniqueProducts = Array.from(
      new Map(validProducts.map((item) => [item.id, item])).values()
    );

    const sorted = [...uniqueProducts];
    switch (sortOption) {
      case "lowToHigh":
        return sorted.sort((a, b) => (a.netPrice || 0) - (b.netPrice || 0));
      case "highToLow":
        return sorted.sort((a, b) => (b.netPrice || 0) - (a.netPrice || 0));
      case "default":
      default:
        return sorted;
    }
  }, [isFromSearch, products, allProducts, searchQuery, sortOption]);

  // Note: For search queries, we use server-side search API which returns all matching products
  // No need for pagination on search results since API returns all matches
  // Pagination is only needed for category-based browsing (isFromSearch)

  // Handle category selection from badges
  const handleCategorySelect = useCallback((catId: number) => {
    setSelectedCategoryId(catId);
  }, []);

  // Handle sort option change
  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  // Render product item
  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      if (isWeb) {
        // Web layout: no special left/right styling needed
        return (
          <View style={styles.productItemWeb}>
            <ProductCard
              _id={item._id}
              id={item.id}
              name={item.name}
              description={item.description}
              // discount={item.discount}
              netPrice={item.netPrice}
              image={item.image?.[0] || ""}
              productColors={item.productColors}
              categoryId={item.categoryId}
              rating={item.rating}
              noOfreviews={item.noOfreviews}
              reviews={item.reviews}
              noOfReviews={0}
              isReturnable={false}
              isVatApplicable={false}
              vatRate={0}
              vatAmount={0}
            />
          </View>
        );
      } else {
        // Mobile layout: existing 2-column layout
        const isEven = index % 2 === 0;
        return (
          <View
            style={[
              styles.productItem,
              isEven ? styles.leftItem : styles.rightItem,
            ]}
          >
            <ProductCard
              _id={item._id}
              id={item.id}
              name={item.name}
              description={item.description}
              // discount={item.discount}
              netPrice={item.netPrice}
              image={item.image?.[0] || ""}
              productColors={item.productColors}
              categoryId={item.categoryId}
              rating={item.rating}
              noOfreviews={item.noOfreviews}
              reviews={item.reviews}
              noOfReviews={0}
              isReturnable={false}
              isVatApplicable={false}
              vatRate={0}
              vatAmount={0}
            />
          </View>
        );
      }
    },
    [isWeb]
  );

  // Render category badges component
  const renderCategoryBadges = useCallback(
    () => (
      <CategoryBadges
        categoryId={selectedCategoryId}
        subCategories={subCategories}
        onCategorySelect={handleCategorySelect}
        onSortChange={handleSortChange}
      />
    ),
    [selectedCategoryId, subCategories, handleCategorySelect, handleSortChange]
  );

  const renderContent = () => {
    if (isLoading && !hasInitialDataLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      );
    }

    if (error) {
      return <NoContentFound message={error} />;
    }

    // Only show "no products found" if we've finished loading and have no products
    if (!isLoading && hasInitialDataLoaded && !displayProducts.length) {
      const message = searchQuery
        ? `No products found for "${searchQuery}"`
        : "No products found";
      // For text search, server-side API returns all results, so no need to check pagination
      // For category browsing (isFromSearch), check if more pages need to be loaded
      if (isFromSearch && (loadingMore || page * ITEMS_PER_PAGE < total)) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading more products...</Text>
          </View>
        );
      } else {
        return (
          <View style={{ flex: 1 }}>
            <NoContentFound message={message} />
          </View>
        );
      }
    }

    if (displayProducts.length > 0) {
      const numColumns = isWeb ? 5 : 2;

      if (isWeb) {
        const numColumns = 5;
        const gap = 16;
        const horizontalPadding = Math.max(24, Math.min(width * 0.05, 80));
        const availableWidth = width - (horizontalPadding * 2);
        const totalGapWidth = gap * (numColumns - 1);
        const calculatedCardWidth = (availableWidth - totalGapWidth) / numColumns;
        const cardWidth = Math.max(180, calculatedCardWidth);
        
        return (
          <View style={styles.productsGridWeb}>
            {displayProducts.map((item, index) => (
              <View
                key={item?.id ? `product-${item.id}` : `item-${index}`}
                style={[
                  styles.productItemWeb,
                  {
                    width: cardWidth,
                    maxWidth: cardWidth,
                  }
                ]}
              >
                <ProductCard
                  _id={item._id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  // discount={item.discount}
                  netPrice={item.netPrice}
                  image={item.image?.[0] || ""}
                  productColors={item.productColors}
                  categoryId={item.categoryId}
                  rating={item.rating}
                  noOfreviews={item.noOfreviews}
                  reviews={item.reviews}
                  noOfReviews={0}
                  isReturnable={false}
                  isVatApplicable={false}
                  vatRate={0}
                  vatAmount={0}
                />
              </View>
            ))}
          </View>
        );
      }

      return (
        <FlatList
          data={displayProducts}
          keyExtractor={(item, index) => {
            // Ensure unique keys by combining ID with index as fallback
            const key = item?.id ? `product-${item.id}` : `item-${index}`;
            return key;
          }}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          nestedScrollEnabled={true}
          onEndReached={() => {
            // Only load more for category browsing (isFromSearch), not for text search
            // Text search uses server-side API which returns all results at once
            if (isFromSearch && !isLoadingMoreRef.current && page * ITEMS_PER_PAGE < total) {
              fetchAllProducts(page + 1, true);
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loadingMore && isFromSearch ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : null
          }
        />
      );
    }

    // Show loading if we're still waiting for initial data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  };

  const renderResultsInfo = () => {
    // Don't show results info while loading initial data
    if (isLoading && !hasInitialDataLoaded) return null;
    if (error) return null;

    if (!isFromSearch && searchQuery) {
      if (isWeb) {
        // Web: Title and filter/sort buttons on same line
        return (
          <View style={styles.resultsHeaderContainerWeb}>
            <Text style={styles.resultsTitleWeb}>
              Results for "{searchQuery}"
            </Text>
            <View style={styles.filterSortContainerWeb}>
              <TouchableOpacity
                style={styles.filterButtonWeb}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => {
                  redirectToPage(containers.filterScreen, {
                    categoryId: parsedCategoryId || 0,
                  });
                }}
              >
                <Ionicons name="filter-outline" size={18} color={colors.black} />
                <Text style={styles.filterButtonTextWeb}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sortButtonWeb}
                onPress={() => setIsSortDropdownVisible(true)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="swap-vertical" size={18} color={colors.black} />
                <Text style={styles.sortButtonTextWeb}>Sort</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      } else {
        // Mobile: Keep original layout
        return (
          <Text style={styles.resultsCount}>
            {displayProducts.length} search results for "{searchQuery}"
          </Text>
        );
      }
    }

    if (isFromSearch && !isWeb) {
      return renderCategoryBadges();
    }

    return null;
  };

  // Choose layout component based on screen size
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={headerTitle} />
  );
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer navigation={router} />
  );

  if (isWeb) {
    return (
      <LayoutComponent
        hasFooter
        hasHeader
        scrollable={true}
        headerComponent={HeaderComponent}
        footerComponent={FooterComponent}
      >
        <View style={styles.webContainer}>
          {renderResultsInfo()}
          {/* Sort Dropdown Modal - Only for web */}
          {isWeb && (
            <Modal
              visible={isSortDropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsSortDropdownVisible(false)}
            >
              <View style={styles.modalOverlayWeb}>
                <TouchableOpacity
                  style={StyleSheet.absoluteFill}
                  activeOpacity={1}
                  onPress={() => setIsSortDropdownVisible(false)}
                />
                <View style={styles.sortDropdownWeb}>
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.sortOptionWeb,
                        sortOption === option.value && styles.activeSortOptionWeb,
                      ]}
                      onPress={() => {
                        setSortOption(option.value);
                        setIsSortDropdownVisible(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.sortOptionTextWeb,
                          sortOption === option.value && styles.activeSortOptionTextWeb,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          )}
          {isFromSearch && renderCategoryBadges()}
          <View style={styles.productsContainerWeb}>
            {renderContent()}
          </View>
        </View>
      </LayoutComponent>
    );
  }

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText={headerTitle} />}
      footerComponent={<Footer navigation={router} />}
    >
      <KeyBoardWrapper>
        {renderResultsInfo()}

        <View style={[styles.divider, { backgroundColor: colors.white }]}>
          {renderContent()}
        </View>
      </KeyBoardWrapper>
    </PageLayout>
  );
};

export default SearchResultsScreen;
