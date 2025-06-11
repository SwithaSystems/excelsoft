import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from "../../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "./searchResultsScreenStyles";
import colors from "../config/colors";
import Header from "@/components/Header";
import CategoryBadges from "./Components/CategoryBadges";
import { Product, ProductsAPI } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import NoContentFound from "@/components/NoContentFound";
import { globalStyles } from "@/assets/styles/globalStyles";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";
import PageLayout from "../pageLayoutProps";

const SearchResultsScreen = () => {
  const { fromSearch, query, category, categoryId, selectedSubCategories } =
    useLocalSearchParams();
  const router = useRouter();

  // Convert params to proper types
  const isFromSearch = fromSearch === "true";
  const searchQuery = query?.toString() || "";
  const categoryName = category?.toString() || "";
  const parsedCategoryId = Number(categoryId) || 0;

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number>(parsedCategoryId);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [headerTitle, setHeaderTitle] = useState(
    isFromSearch ? categoryName : "Search Results"
  );
  const [sortOption, setSortOption] = useState<string>("default");

  // Parse selected subcategories
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

  // Fetch all products (for search functionality)
  useEffect(() => {
    if (!isFromSearch && searchQuery) {
      const fetchAllProducts = async () => {
        try {
          setIsLoading(true);
          const data = await ProductsAPI.getAllProducts();
          setAllProducts(data);
        } catch (err) {
          console.error("Error fetching all products:", err);
          setError("Failed to fetch products. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllProducts();
    }
  }, [isFromSearch, searchQuery]);

  // Fetch subcategories for the selected category
  useEffect(() => {
    if (isFromSearch && parsedCategoryId) {
      const fetchSubCategories = async () => {
        try {
          setIsLoading(true);
          const data = await categoryService.getAllSubCategories(
            parsedCategoryId
          );
          setSubCategories(data);
        } catch (err) {
          console.error("Error fetching subcategories:", err);
          setError("Failed to load categories. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubCategories();
    }
  }, [isFromSearch, parsedCategoryId]);

  // Fetch products based on category selection
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!isFromSearch && !parsedCategoryId) return;

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
        // Case 2: Selected parent category (show all products including subcategories)
        else if (selectedCategoryId === parsedCategoryId) {
          // Get products from main category
          const mainProducts = await ProductsAPI.getProductByCategoryID(
            parsedCategoryId
          );
          fetchedProducts = mainProducts;

          // If we have subcategories, get their products too
          if (subCategories.length > 0) {
            const subProductPromises = subCategories.map((subCat) =>
              ProductsAPI.getProductByCategoryID(subCat.id)
            );
            const subProducts = await Promise.all(subProductPromises);
            fetchedProducts = [...fetchedProducts, ...subProducts.flat()];
          }
        }
        // Case 3: Selected specific subcategory
        else {
          fetchedProducts = await ProductsAPI.getProductByCategoryID(
            selectedCategoryId
          );
        }

        // Remove duplicates by product ID
        const uniqueProducts = Array.from(
          new Map(fetchedProducts.map((item) => [item.id, item])).values()
        );

        setProducts(uniqueProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [
    isFromSearch,
    parsedCategoryId,
    selectedCategoryId,
    parsedSubCategoryIds,
    subCategories,
  ]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];

    const normalizedQuery = searchQuery.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery, allProducts]);

  // Apply sorting to products
  const sortedProducts = useMemo(() => {
    const productsToSort = isFromSearch ? products : filteredProducts;
    if (!productsToSort.length) return [];

    const sorted = [...productsToSort];

    switch (sortOption) {
      case "lowToHigh":
        return sorted.sort((a, b) => a.price - b.price);
      case "highToLow":
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [isFromSearch, products, filteredProducts, sortOption]);

  // Handle category selection from badges
  const handleCategorySelect = useCallback((catId: number) => {
    setSelectedCategoryId(catId);
  }, []);

  // Handle sort option change
  const handleSortChange = useCallback((option: string) => {
    setSortOption(option);
  }, []);

  // Products to display based on mode (search or category)
  const displayProducts =
    sortedProducts.length > 0
      ? sortedProducts
      : isFromSearch
      ? products
      : filteredProducts;

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
        onCategoryNameChange={setHeaderTitle}
        onSortChange={handleSortChange}
      />
    ),
    [selectedCategoryId, subCategories, handleCategorySelect, handleSortChange]
  );

  // Render content based on loading state
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
      return (
        <View style={{ flex: 1, padding: 16 }}>
          <NoContentFound message="No products found" />
        </View>
      );
    }

    return (
      <FlatList
        data={displayProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    // <SafeAreaView style={
    //   // [styles.container, { backgroundColor: colors.white }]
    //   globalStyles.safeAreaContainer
    // }>
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText={headerTitle} />}
      footerComponent={<Footer navigation={router} />}
    >
      <KeyBoardWrapper>
        {/* <Header headerText={headerTitle} /> */}

        {!isLoading && !error && (
          <>
            {!isFromSearch && searchQuery ? (
              <Text style={styles.resultsCount}>
                {filteredProducts.length} search results for "{searchQuery}"
              </Text>
            ) : isFromSearch ? (
              renderCategoryBadges()
            ) : null}
          </>
        )}

        <View style={[styles.divider, { backgroundColor: colors.white }]}>
          {renderContent()}
        </View>

        {/* <Footer navigation={router} activeTab="home" /> */}
      </KeyBoardWrapper>
      {/* </SafeAreaView> */}
    </PageLayout>
  );
};

export default SearchResultsScreen;
