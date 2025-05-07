import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
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

const SearchResultsScreen = () => {
  const { fromSearch, query } = useLocalSearchParams();
  const { category } = useLocalSearchParams();
  const { categoryId } = useLocalSearchParams();
  const { selectedSubCategories } = useLocalSearchParams();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subCategoriesIds, setSubCategoriesIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    Number(categoryId)
  );
  const [loading, setLoading] = useState<boolean>(true);
  // const [isLoading, setIsLoading] = useappContext();
  console.log("all params", fromSearch, query, category, categoryId);
  const [headerTitle, setHeaderTitle] = useState(
    fromSearch ? category : "Search Results"
  );
  const [sortedProducts, setSortedProducts] = useState<any>([]);

  useEffect(() => {
    console.log("sub ids from filterscreen (raw)", selectedSubCategories);

    if (selectedSubCategories) {
      const parsedIds = Array.isArray(selectedSubCategories)
        ? selectedSubCategories.map((id) => Number(id))
        : selectedSubCategories.split(",").map((id) => Number(id));

      console.log("parsed subCategory IDs:", parsedIds);
      setSubCategoriesIds(parsedIds);
    }
  }, [selectedSubCategories]);
  console.log("sub categories ids ", subCategoriesIds);
  // Fetch all products for free-text search only (runs once)
  // useEffect(() => {
  //   const fetchAllProducts = async () => {
  //     try {
  //       const data = await ProductsAPI.getAllProducts();
  //       setAllProducts(data);
  //     } catch (error) {
  //       console.error("Error fetching all products:", error);
  //     }
  //   };
  //   fetchAllProducts();
  // }, []);

  // Fetch subcategories and prepare list of their IDs
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (subCategories.length > 0) return;

      try {
        const data = await categoryService.getAllSubCategories(
          Number(categoryId)
        );
        setSubCategories(data);
        const ids = data.map((category) => category.id);
        setSubCategoriesIds(ids);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        console.log(
          "Selected category ID:",
          selectedCategoryId,
          "Main category ID:",
          Number(categoryId),
          "Subcategory IDs:",
          subCategoriesIds
        );

        // If subcategories are selected through filters
        if (subCategoriesIds.length > 0 && selectedSubCategories) {
          // Fetch products for all selected subcategories
          const allSubCategoryProducts = await Promise.all(
            subCategoriesIds.map((id) => ProductsAPI.getProductByCategoryID(id))
          );
          const combined = allSubCategoryProducts.flat();
          const uniqueProducts = Array.from(
            new Map(combined.map((item) => [item.id, item])).values()
          );
          setProducts(uniqueProducts);
        }
        // If parent category is selected (matches the main categoryId)
        else if (selectedCategoryId === Number(categoryId)) {
          // For parent category, fetch all products from parent AND all its subcategories
          const mainCategoryProducts = await ProductsAPI.getProductByCategoryID(
            Number(categoryId)
          );

          // If subcategories exist, also fetch their products
          if (subCategories.length > 0) {
            const subCategoryProductsPromises = subCategories.map((subCat) =>
              ProductsAPI.getProductByCategoryID(subCat.id)
            );
            const allSubCategoryProducts = await Promise.all(
              subCategoryProductsPromises
            );
            const allProducts = [
              ...mainCategoryProducts,
              ...allSubCategoryProducts.flat(),
            ];
            const uniqueProducts = Array.from(
              new Map(allProducts.map((item) => [item.id, item])).values()
            );
            setProducts(uniqueProducts);
          } else {
            setProducts(mainCategoryProducts);
          }
        }
        // If a specific subcategory is selected
        else {
          // Fetch products just for the selected subcategory
          const categoryProducts = await ProductsAPI.getProductByCategoryID(
            selectedCategoryId
          );
          setProducts(categoryProducts);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [
    selectedCategoryId,
    categoryId,
    subCategoriesIds,
    selectedSubCategories,
    subCategories,
  ]);

  // Handle free-text search (filter from allProducts)
  const filteredProducts = useMemo(() => {
    if (!query) return products;

    const searchQuery = query.toString().toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
  }, [query, allProducts]);

  useEffect(() => {
    if (!fromSearch) {
      setSortedProducts(filteredProducts);
    } else {
      setSortedProducts(products);
    }
  }, [filteredProducts, products, fromSearch]);

  // Handle selecting a category badge
  const handleCategorySelect = (categoryId: number) => {
    console.log("selected category id from cat badge", categoryId);
    setSelectedCategoryId(categoryId);
  };
  const handleSortChange = (sortOption: string) => {
    let originalProducts = !fromSearch ? filteredProducts : products;
    let sorted = [...originalProducts]; // Assume this holds the unsorted list

    if (sortOption === "lowToHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      sorted.sort((a, b) => b.price - a.price);
    } else {
      sorted = [...originalProducts]; // fallback to default/relevance
    }

    setSortedProducts(sorted);
  };

  const productsToRender =
    sortedProducts.length > 0 || fromSearch ? sortedProducts : products;

  const renderItem = ({ item, index }: { item: Product; index: number }) => {
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
  };

  const renderCategoryBadges = (categoryId: number) => {
    return (
      <CategoryBadges
        categoryId={selectedCategoryId}
        subCategories={subCategories}
        onCategorySelect={handleCategorySelect}
        onCategoryNameChange={(name: any) => setHeaderTitle(name)}
        onSortChange={handleSortChange}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header headerText={headerTitle} />

      {loading ? (
        <Text style={styles.resultsCount}>Loading...</Text>
      ) : !fromSearch ? (
        <Text style={styles.resultsCount}>
          {filteredProducts.length} search results for "{query}"
        </Text>
      ) : (
        renderCategoryBadges(Number(categoryId))
      )}

      <View style={[styles.divider, { backgroundColor: colors.white }]}>
        {loading ? (
          <Text style={styles.resultsCount}>Loading...</Text>
        ) : productsToRender.length === 0 ? (
          <NoContentFound message="No products found" />
        ) : (
          <FlatList
            data={productsToRender}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Footer navigation={router} activeTab="home" />
    </SafeAreaView>
  );
};

export default SearchResultsScreen;
function useappContext(): [any, any] {
  throw new Error("Function not implemented.");
}
