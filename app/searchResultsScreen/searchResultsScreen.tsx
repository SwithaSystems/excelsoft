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

const SearchResultsScreen = () => {
  const { fromSearch, query } = useLocalSearchParams();
  const { category } = useLocalSearchParams();
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subCategoriesIds, setSubCategoriesIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    Number(categoryId)
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all products for free-text search only (runs once)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await ProductsAPI.getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  // Fetch subcategories and prepare list of their IDs
  useEffect(() => {
    const fetchSubCategories = async () => {
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

  // Fetch products based on selected category or subcategories
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);

        if (selectedCategoryId === Number(categoryId)) {
          // Selected "All" (main category)
          if (subCategoriesIds.length > 0) {
            const allSubCategoryProducts = await Promise.all(
              subCategoriesIds.map((id) =>
                ProductsAPI.getProductByCategoryID(id)
              )
            );
            const combined = allSubCategoryProducts.flat();
            setProducts(combined);
          } else {
            const mainCategoryProducts =
              await ProductsAPI.getProductByCategoryID(Number(categoryId));
            setProducts(mainCategoryProducts);
          }
        } else {
          // Specific subcategory
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
  }, [selectedCategoryId, categoryId, subCategoriesIds]);

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

  // Handle selecting a category badge
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

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
        categoryId={categoryId}
        subCategories={subCategories}
        onCategorySelect={handleCategorySelect}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header headerText={!fromSearch ? "Search Results" : category} />

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
        <FlatList
          data={!fromSearch ? filteredProducts : products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Footer navigation={router} activeTab="home" />
    </SafeAreaView>
  );
};

export default SearchResultsScreen;
