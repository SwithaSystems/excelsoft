import React from 'react';
import { View, Text, FlatList, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import ProductCard from '../components/ProductCard';
import styles from './searchResultsScreenStyles';
import products from '../../data/products';
import colors from '../config/colors';
import Header from '@/components/Header';

const SearchResultsScreen = () => {
  const { query } = useLocalSearchParams();
  const router = useRouter();

  const filteredProducts = React.useMemo(() => {
    if (!query) return products;
    const searchQuery = query.toString().toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
    );
  }, [query]);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <View style={[styles.productItem, isEven ? styles.leftItem : styles.rightItem]}>
        <ProductCard
          id={item.id}
          name={item.name}
          description={item.description}
          price={item.price}
          originalPrice={item.originalPrice}
          image={item.image}
          productColors={item.productColors}
          category={item.category}
          rating={item.rating}
          noOfreviews={item.noOfreviews}
          reviews={item.reviews}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header headerText={"Search Results"}/>
      <Text style={styles.resultsCount}>
        {filteredProducts.length} search results for "{query}"
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.white }]}>
        <FlatList
          data={filteredProducts}
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
