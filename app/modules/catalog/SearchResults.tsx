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
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header";
import { Product, ProductsAPI } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import NoContentFound from "@/app/components/NoContentFound";
import KeyBoardWrapper from "@/app/components/commonComponents/KeyBoardWrapper";
import styles from "./SearchResultsStyles";
import ProductCard from "@/app/components/ProductCard";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import Footer from "@/app/components/Footer";
import CategoryBadges from "./Components/CategoryBadges";
import colors from "@/constants/colors";

const SearchResultsScreen = () => {
  const { fromSearch, query, category, categoryId, selectedSubCategories } =
    useLocalSearchParams();
  const router = useRouter();

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
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>("default");

  // Memoize header title to prevent unnecessary re-renders
  const headerTitle = useMemo(() => {
    return isFromSearch ? categoryName : "Search Results";
  }, [isFromSearch, categoryName]);

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

  // FIX 1: Fetch all products with proper cleanup
  useEffect(() => {
    // if (!isFromSearch && searchQuery) {
    let cancelled = false;

    const fetchAllProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await ProductsAPI.getAllProducts();

        // Check if component is still mounted and request wasn't cancelled
        if (!cancelled && isMountedRef.current) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Error fetching all products:", err);
        if (!cancelled && isMountedRef.current) {
          setError("Failed to fetch products. Please try again.");
        }
      } finally {
        if (!cancelled && isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchAllProducts();

    // Cleanup function
    return () => {
      cancelled = true;
    };
    // }
  }, [isFromSearch, searchQuery]);

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
    if (parsedSubCategoryIds.length > 0) {
      const filtered_products = allProducts.filter((product) => {
        return (
          Array.isArray(product.categoryId) &&
          parsedSubCategoryIds.some((id) =>
            product.categoryId.map(Number).includes(Number(id))
          )
        );
      });

      console.log("filtered_products", filtered_products);
      setProducts(filtered_products);
    }
  }, [parsedSubCategoryIds, allProducts]);

  useEffect(() => {
    // Only run if we're in category mode or have subcategory filters
    if (!isFromSearch || !parsedCategoryId) return;

    let cancelled = false;

    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);
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
      baseProducts = products;
    } else if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      baseProducts = allProducts.filter(
        (product) =>
          product &&
          product.name &&
          product.description &&
          (product.name.toLowerCase().includes(normalizedQuery) ||
            product.description.toLowerCase().includes(normalizedQuery))
      );
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
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "highToLow":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return sorted;
    }
  }, [isFromSearch, products, allProducts, searchQuery, sortOption]);

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
            image={item.image?.[0] || ""}
            productColors={item.productColors}
            category={String(item.categoryId)}
            rating={item.rating}
            noOfreviews={item.noOfreviews}
            reviews={item.reviews}
          />
        </View>
      );
    },
    []
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
    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Loading products...</Text>
        </View>
      );
    }

    if (error) {
      return <NoContentFound message={error} />;
    }

    if (!displayProducts.length) {
      const message = searchQuery
        ? `No products found for "${searchQuery}"`
        : "No products found";
      return (
        <View style={{ flex: 1 }}>
          <NoContentFound message={message} />
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
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderResultsInfo = () => {
    if (isLoading || error) return null;

    if (!isFromSearch && searchQuery) {
      return (
        <Text style={styles.resultsCount}>
          {displayProducts.length} search results for "{searchQuery}"
        </Text>
      );
    }

    if (isFromSearch) {
      return renderCategoryBadges();
    }

    return null;
  };

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
