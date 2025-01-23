import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import colors from '../config/colors';
import SearchHistoryItem from '../components/SearchHistoryItem';
import TrendingSearchItem from '../components/TrendingSearchItem';
import CategoryItem from '../components/CategoryItem';
import BackArrow from '@/components/BackArrow';
import SearchBar from '../components/searchBar';

const recentSearches = [
  'Spaghetti',
  'Wet Wipes',
  'Dandruff free shampoo',
  'Oranges',
  'Cod Fish',
];

const trendingSearches = [
  'Clothes',
  'Meat',
  'Alcohol',
  'Oranges',
];

const categories = [
  {
    id: '1',
    title: 'Drinks and Alcohol',
    image: require('../../assets/drinks&alcohol.png'),
  },
  {
    id: '2',
    title: 'Home Decor',
    image: require('../../assets/homedecors.png'),
  },
  {
    id: '3',
    title: 'Meat',
    image: require('../../assets/meat.png'),
  },
  {
    id: '4',
    title: 'Groceries',
    image: require('../../assets/groceriesSearch.png'),
  },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "/searchSuggesionsScreen/searchSuggesionsScreen",
        params: { query: searchQuery }
      });
    }
  };

  const handleSelectRecentSearch = (text: string) => {
    setSearchQuery(text);
  };

  const renderTrendingSearches = () => {
    return (
      <View style={styles.trendingContainer}>
        <Text style={styles.sectionTitle}>Trending Searches</Text>
        <View style={styles.trendingGrid}>
          {trendingSearches.map((item, index) => (
            <TrendingSearchItem
              key={index}
              text={item}
              onPress={() => console.log('Trending item pressed:', item)}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackArrow />
        <Text style={styles.title}>Search</Text>
      </View>

      {/* Search Input */}
      <View>
        <SearchBar
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onPress={handleSearch}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <SearchHistoryItem
              key={index}
              searchText={search}
              onRemove={() => {}}
              onSelect={handleSelectRecentSearch}
            />
          ))}
        </View>

        {/* Trending Searches */}
        {renderTrendingSearches()}

        {/* Popular Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                title={category.title}
                image={category.image}
                onPress={() => console.log('Category pressed:', category.title)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingLeft:16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 100,
    alignSelf:'center'
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginHorizontal: 15,
  },
  trendingContainer: {
    marginBottom: 25,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
});

export default SearchScreen;