import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import colors from "../config/colors";
import SearchHistoryItem from "../components/SearchHistoryItem";
import TrendingSearchItem from "../components/TrendingSearchItem";
import CategoryItem from "../components/CategoryItem";
import SearchBar from "../components/searchBar";
import Header from "@/components/Header";
import useDebounce from "../../utilities/customHooks/useDebounce";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "./searchStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Footer from "@/components/Footer";
import PageLayout from "../pageLayoutProps";
import KeyBoardWrapper from "@/components/commonComponents/KeyBoardWrapper";

// Storage key for recent searches
const RECENT_SEARCHES_KEY = "@app_recent_searches";
const MAX_RECENT_SEARCHES = 5;

// // Mock data for suggestions - in a real app this would come from an API
// const mockSuggestions: any = {
//   app: ["Apple", "Applesauce", "Appetizers", "Appliances"],
//   or: ["Oranges", "Organic", "Organic Fruits", "Orange Juice"],
//   sh: ["Shampoo", "Shoes", "Shirts", "Shorts"],
//   me: ["Meat", "Medicine", "Melons", "Mexican Food"],
//   dr: ["Drinks", "Dried Fruits", "Dress", "Dryer Sheets"],
//   gro: ["Groceries", "Ground Beef", "Grapes", "Grains"],
// };

const trendingSearches = ["Clothes", "Meat", "Alcohol", "Oranges"];

const categories = [
  {
    id: "10",
    title: "Drinks & Beverages",
    image: require("../../assets/drinks&alcohol.png"),
  },
  {
    id: "9",
    title: "Home & Furniture ",
    image: require("../../assets/homedecors.png"),
  },
  {
    id: "8",
    title: "Meat & Fish",
    image: require("../../assets/meat.png"),
  },
  {
    id: "3",
    title: "Groceries",
    image: require("../../assets/groceriesSearch.png"),
  },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Load recent searches from AsyncStorage on component mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      console.log("Loaded searches from storage:", storedSearches); // Debug log
      if (storedSearches !== null) {
        const parsed = JSON.parse(storedSearches);
        setRecentSearches(parsed);
        console.log("Recent searches set to:", parsed); // Debug log
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  // Save search to recent searches
  const saveSearchToHistory = async (query: string) => {
    try {
      if (!query.trim()) return;

      // Get current searches
      const currentSearches = [...recentSearches];

      // Remove duplicates and add new search at beginning
      const filteredSearches = currentSearches.filter(
        (item: any) => item.toLowerCase() !== query.toLowerCase()
      );
      const updatedSearches = [query, ...filteredSearches].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      // Update state
      setRecentSearches(updatedSearches);

      // Save to AsyncStorage separately
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );

      console.log("Search saved to history:", query); // Add for debugging
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  // Fix 2: Update handleSelectSuggestion to save to history
  const handleSelectSuggestion = async (text: any) => {
    setSearchQuery(text);

    // Save to recent searches when user selects a suggestion
    await saveSearchToHistory(text);

    redirectToPage(containers.searchResultsScreenScreen, { query: text });
  };

  // Fix 3: Make handleSearch async and add error handling
  const handleSearch = useCallback(async () => {
    if (searchQuery.trim()) {
      try {
        // Save to recent searches
        await saveSearchToHistory(searchQuery);

        // Navigate to results screen
        redirectToPage(containers.searchResultsScreenScreen, {
          query: searchQuery,
        });
      } catch (error) {
        console.error("Error in handleSearch:", error);
      }
    }
  }, [searchQuery, recentSearches]); // Add recentSearches to dependencies

  // Remove search from history
  const removeSearchFromHistory = async (searchText: any) => {
    try {
      const updatedSearches = recentSearches.filter(
        (item: any) => item !== searchText
      );
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error removing search from history:", error);
    }
  };

  // Clear all recent searches
  const clearAllRecentSearches = async () => {
    try {
      Alert.alert(
        "Clear Recent Searches",
        "Are you sure you want to clear all recent searches?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear All",
            style: "destructive",
            onPress: async () => {
              setRecentSearches([]);
              await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      const API_URL = process.env.EXPO_PUBLIC_API_URL;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/products/suggestions/search?q=${debouncedQuery}`
        );
        const results = response.data;

        // Assume results is an array of product names (string[])
        const uniqueResults = [...new Set(results)].slice(0, 6);
        setSuggestions(uniqueResults as string[]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelectRecentSearch = (text: any) => {
    setSearchQuery(text);
    setSuggestions([]); // Clear suggestions when selecting from history
  };
  const handleSelectCategories = (category: any) => {
    redirectToPage(containers.searchResultsScreenScreen, {
      fromSearch: true,
      category: category.title,
      categoryId: category.id,
    });
  };

  const renderRecentSearches = useCallback(() => {
    if (recentSearches.length === 0) {
      return <Text style={styles.emptyStateText}>No recent searches</Text>;
    }

    return (
      <>
        {recentSearches.map((search: any, index: any) => (
          <SearchHistoryItem
            key={index}
            searchText={search}
            onRemove={() => removeSearchFromHistory(search)}
            onSelect={handleSelectRecentSearch}
          />
        ))}
      </>
    );
  }, [recentSearches, handleSelectRecentSearch]);
  
  const renderTrendingSearches = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Searches</Text>
        <View style={styles.trendingGrid}>
          {trendingSearches.map((item, index) => (
            <TrendingSearchItem
              key={index}
              text={item}
              onPress={() => handleSelectRecentSearch(item)}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderSuggestionItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
    >
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMainContent = () => {
    if (searchQuery && (suggestions.length > 0 || isLoading)) {
      return (
        <View style={styles.suggestionsContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={suggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={(item, index) => `suggestion-${index}`}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>
      );
    }

    return (
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* Recent Searches */}
        <View style={styles.section}>
          <View
          // style={styles.sectionHeader}
          >
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={clearAllRecentSearches}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderRecentSearches()}
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
                onPress={() => handleSelectCategories(category)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    <PageLayout
      scrollable
      hasHeader
      hasFooter
      headerComponent={<Header headerText={"Search"} />}
      footerComponent={<Footer activeTab="search" />}
    >
      <KeyBoardWrapper>
        <View style={styles.container}>
          {/* <Header headerText={"Search"} /> */}

          <View style={styles.searchBarContainer}>
            <SearchBar
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              onPress={handleSearch}
            />
          </View>

          {renderMainContent()}
        </View>
      </KeyBoardWrapper>
    </PageLayout>
    /*  <Footer activeTab = "search"/>
     </SafeAreaView> */
  );
};

export default SearchScreen;
