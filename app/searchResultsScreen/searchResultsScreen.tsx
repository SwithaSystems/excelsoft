import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Footer from "../../components/Footer";
import ProductCard from "../components/ProductCard";
import styles from "./searchResultsScreenStyles";
// import products from "../../data/products";
import colors from "../config/colors";
import Header from "@/components/Header";
import CategoryBadges from "./Components/CategoryBadges";
import {Product, ProductsAPI} from "@/services/productService"
import { categoryService } from "@/services/categoryService";



const SearchResultsScreen = () => {
  const { fromSearch } = useLocalSearchParams();
  const {category}= useLocalSearchParams();
  const {categoryId}= useLocalSearchParams();
  const { query } = useLocalSearchParams();
  const router = useRouter();
  const [subCategoriesIds,setSubCategoriesIds] = useState<number[]>([]);
  const [products,setProducts] = useState<Product[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(Number(categoryId));
  const [subCategories, setSubCategories] = useState<any[]>([]);

  // const filteredProducts = React.useMemo(() => {
  //   if (!query) return products;
  //   const searchQuery = query.toString().toLowerCase();
  //   return products.filter(product => 
  //     product.name.toLowerCase().includes(searchQuery) ||
  //     product.description.toLowerCase().includes(searchQuery) ||
  //     product.category.toLowerCase().includes(searchQuery)
  //   );
  // }, [query]);
  // Filter products based on search query and categoryId


  

  useEffect(()=>{
    const fetchProducts = async () => {
      try {
        const products = await ProductsAPI.getAllProducts();
        console.log("all Products", products);
        setProducts(products);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };
    fetchProducts();

  },
  [])
  const filteredProducts = useMemo(() => {
    if (!query) return products;
  
    const searchQuery = query?.toString().toLowerCase();
  
    return products.filter(product => {
      const matchesQuery = searchQuery
        ? product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
        : true;
  
      // const matchesCategory = categoryId
      //   ? product.categoryId.some(id => id === Number(categoryId))
      //   : true;
  
      return matchesQuery ;
    });
  }, [query,products]);
  
  // Update `products` state whenever `filteredProducts` changes
  useEffect(() => {
    console.log("Filetered products",filteredProducts)
    setProducts(filteredProducts);
  }, [filteredProducts?.length>0]);
  


useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await categoryService.getAllSubCategories(Number(categoryId));
        console.log("all sub categories", data);
        setSubCategories(data);
        const SubCategories_Ids = data.map((category) => category.id);
        setSubCategoriesIds(SubCategories_Ids);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (selectedCategoryId === Number(categoryId)) {
          // For "All" category, check if there are subcategories
          if (subCategoriesIds.length > 0) {
            // If there are subcategories, fetch products from all of them
            const allSubCategoryProducts = await Promise.all(
              subCategoriesIds.map(id => ProductsAPI.getProductByCategoryID(id))
            );
            const combinedProducts = allSubCategoryProducts.flat();
            setProducts(combinedProducts);
          } else {
            // If no subcategories, fetch products from the main category
            const mainCategoryProducts = await ProductsAPI.getProductByCategoryID(Number(categoryId));
            setProducts(mainCategoryProducts);
          }
        } else {
          // For specific subcategory, fetch products normally
          const categoryProducts = await ProductsAPI.getProductByCategoryID(selectedCategoryId);
          setProducts(categoryProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedCategoryId, categoryId, subCategoriesIds]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

// const filteredProducts = ProductsAPI.getAllSubCategoriesProducts(subCategoriesIds);


  const renderItem = ({ item, index }: { item: any; index: number }) => {
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
          category={item.category}
          rating={item.rating}
          noOfreviews={item.noOfreviews}
          reviews={item.reviews}
        />
      </View>
    );
  };

  const renderCategoryBadges = (categoryId:number) => {
    return <CategoryBadges 
      categoryId={categoryId}
      subCategories={subCategories}
      onCategorySelect={handleCategorySelect}
    />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header headerText={!fromSearch ? "Search Results" : category} />
      {!fromSearch ? (
        <Text style={styles.resultsCount}>
          {products?.length} search results for {query}
        </Text>
      ) : (
        renderCategoryBadges(Number(categoryId))
      )}
      <View style={[styles.divider, { backgroundColor: colors.white }]}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
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
function usestate(): [any, any] {
  throw new Error("Function not implemented.");
}
