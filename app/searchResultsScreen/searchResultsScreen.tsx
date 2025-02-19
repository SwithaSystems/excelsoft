import React, { useEffect, useState } from "react";
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

  // const filteredProducts = React.useMemo(() => {
  //   console.log("categoryId",categoryId);
  //   if (!query || !categoryId) return products;

  //   const searchQuery = query?.toString().toLowerCase();

  //   return products.filter(
  //     (product) =>{
  //       const matchesQuery = searchQuery ?
  //       product.name.toLowerCase().includes(searchQuery) ||
  //       product.description.toLowerCase().includes(searchQuery) : true ;

  //       const matchesCategory =  product.categoryId.every((id) => id === +categoryId)
  
  //     return  matchesCategory;
  //     }
        
  //   );
  // }, [query,categoryId,products]);


useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await categoryService.getAllSubCategories(Number(categoryId));
        console.log("all sub categories", data);
          const SubCategories_Ids = data.map((category) => category.id);
          setSubCategoriesIds(SubCategories_Ids);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    console.log("allSubcategory ids after seting",subCategoriesIds);
    fetchSubCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await ProductsAPI.getProductByCategoryID(Number(categoryId));
      setProducts(allProducts);
    };
    console.log("AllProducts",products)
    fetchProducts();
  }, [categoryId]);

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
    return <CategoryBadges categoryId={categoryId}/>;
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

