import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import colors from "@/constants/colors";
import SearchBar from "../searchBar";
import { useRoleContext } from "@/context/RoleContext";
import useDebounce from "@/utilities/customHooks/useDebounce";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


// Storage key for recent searches
const RECENT_SEARCHES_KEY = "app_recent_searches";
const MAX_RECENT_SEARCHES = 5;

interface BrandHeaderWebProps {
  hideUserGreeting?: boolean;
}

export default function BrandHeaderWeb({ hideUserGreeting = false }: BrandHeaderWebProps) {
  const { isAdmin, isValidUser, username } = useRoleContext();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total: any, item: any) => total + item.quantity,
    0
  );

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchBarWidth, setSearchBarWidth] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const searchBarRef = useRef<View>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClickingSuggestionRef = useRef<boolean>(false);
  const isRemovingSearchRef = useRef<boolean>(false);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Load recent searches from SecureStore
  const loadRecentSearches = async () => {
    try {
      const storedSearches = await SecureStore.getItemAsync(RECENT_SEARCHES_KEY);
      if (storedSearches !== null) {
        const parsed = JSON.parse(storedSearches);
        setRecentSearches(parsed);
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
        (item: string) => item.toLowerCase() !== query.toLowerCase()
      );
      const updatedSearches = [query, ...filteredSearches].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      // Update state
      setRecentSearches(updatedSearches);

      // Save to SecureStore
      await SecureStore.setItemAsync(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error saving recent search:", error);
    }
  };

  // Remove search from history
  const removeSearchFromHistory = async (searchText: string) => {
    try {
      const updatedSearches = recentSearches.filter(
        (item: string) => item !== searchText
      );
      setRecentSearches(updatedSearches);
      await SecureStore.setItemAsync(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error removing search from history:", error);
    }
  };

  // Fetch suggestions from API
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
        const uniqueResults = [...new Set(results)].slice(0, 10);
        setSuggestions(uniqueResults as string[]);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if ((isTablet || isDesktop) && debouncedQuery && debouncedQuery.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, isTablet, isDesktop]);

  // Show suggestions dropdown when there are results, recent searches, or loading
  useEffect(() => {
    if (isFocused) {
      // Show dropdown if:
      // 1. User has typed 2+ characters and we have suggestions or are loading
      // 2. User has focused but hasn't typed much, show recent searches
      const hasSuggestions = searchQuery.length >= 2 && (suggestions.length > 0 || isLoading);
      const hasRecentSearches = searchQuery.length < 2 && recentSearches.length > 0;
      
      if (hasSuggestions || hasRecentSearches) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [isFocused, suggestions, isLoading, searchQuery, recentSearches]);

  // Handle search input change
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }
    // Save to recent searches
    await saveSearchToHistory(searchQuery);
    setShowSuggestions(false);
    redirectToPage(containers.searchResultsScreen, {
      query: searchQuery,
    });
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (suggestion: string, preventBlur: boolean = true) => {
    // Don't navigate if we're removing a search
    if (isRemovingSearchRef.current) {
      return;
    }
    
    // Mark that we're clicking on a suggestion to prevent blur from interfering
    if (preventBlur) {
      isClickingSuggestionRef.current = true;
    }
    
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    
    // Update search query
    setSearchQuery(suggestion);
    
    // Save to recent searches
    await saveSearchToHistory(suggestion);
    
    // Close dropdown and blur immediately
    setIsFocused(false);
    setShowSuggestions(false);
    
    // Navigate immediately - no delay needed
    redirectToPage(containers.searchResultsScreen, {
      query: suggestion,
    });
    
    // Reset the flag after a short delay
    if (preventBlur) {
      setTimeout(() => {
        isClickingSuggestionRef.current = false;
      }, 200);
    }
  };

  // Handle search bar focus
  const handleSearchFocus = () => {
    // Clear any pending blur timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  };

  // Handle search bar blur
  const handleSearchBlur = () => {
    // Don't close if user is clicking on a suggestion or removing a search
    if (isClickingSuggestionRef.current || isRemovingSearchRef.current) {
      return;
    }
    
    // Clear any existing timeout
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    // Delay closing to allow suggestion click to register
    // On web, we need to wait a bit to check if user clicked on suggestion
    blurTimeoutRef.current = setTimeout(() => {
      // Double check that user didn't click on suggestion or remove
      if (!isClickingSuggestionRef.current && !isRemovingSearchRef.current) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
      blurTimeoutRef.current = null;
    }, 200);
  };

  // Handle profile button click - route to appropriate profile screen
  const handleProfileClick = () => {
    if (!isValidUser) {
      redirectToPage(containers.signInScreen);
      return;
    }

    // If admin is viewing admin screens (hideUserGreeting is true), go to admin profile
    // If admin is viewing user screens (hideUserGreeting is false), go to user profile
    if (isAdmin && hideUserGreeting) {
      redirectToPage(containers.AdminProfileScreen);
    } else {
      redirectToPage(containers.editProfileScreen);
    }
  };

  // Render suggestion item
  const renderSuggestionItem = ({ item }: { item: string }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.suggestionItem,
          pressed && styles.suggestionItemPressed,
        ]}
        onPressIn={() => {
          // onPressIn fires on mouseDown (before blur fires on web)
          // This ensures the selection happens immediately before blur can close the dropdown
          handleSuggestionSelect(item, true);
        }}
      >
        <View style={styles.suggestionIconContainer}>
          <Ionicons name="search-outline" size={16} color={colors.primary} />
        </View>
        <Text style={styles.suggestionText}>{item}</Text>
      </Pressable>
    );
  };

  // Render recent search item
  const renderRecentSearchItem = ({ item }: { item: string }) => {
    const handleItemPress = () => {
      // Set flag IMMEDIATELY to prevent blur from closing dropdown
      // This must happen before any async operations or checks
      isClickingSuggestionRef.current = true;
      
      // Clear any pending blur timeout immediately
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      
      // Only proceed if not removing a search
      if (!isRemovingSearchRef.current) {
        handleSuggestionSelect(item, true);
      } else {
        // Reset flag if we can't proceed
        isClickingSuggestionRef.current = false;
      }
    };

    const handleRemovePress = () => {
      // Set flag immediately to prevent navigation and blur from closing dropdown
      isRemovingSearchRef.current = true;
      
      // Clear any pending blur timeout
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      
      // Remove from history
      removeSearchFromHistory(item);
      
      // Clear flag after removal completes
      // Keep dropdown open if there are still recent searches
      setTimeout(() => {
        isRemovingSearchRef.current = false;
      }, 150);
    };

    return (
      <View style={styles.recentSearchItem}>
        <Pressable
          style={({ pressed }) => [
            styles.recentSearchLeft,
            pressed && !isRemovingSearchRef.current && styles.suggestionItemPressed,
          ]}
          onPressIn={handleItemPress}
        >
          <View style={styles.suggestionIconContainer}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
          </View>
          <Text style={styles.suggestionText}>{item}</Text>
        </Pressable>
        <Pressable
          onPressIn={handleRemovePress}
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.removeButtonPressed,
          ]}
        >
          <Ionicons name="close" size={16} color={colors.primary} />
        </Pressable>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isDesktop ? 40 : isTablet ? 24 : 16,
          paddingVertical: isDesktop ? 8 : 10,
        },
      ]}
    >
      {/* LEFT SECTION - Logo and Search */}
      <View style={styles.leftSection}>
        <Image
          source={require("@/assets/RecreatedLogo_2.png")}
          style={[
            styles.logo,
            {
              width: isDesktop ? 140 : isTablet ? 110 : 100,
              height: isDesktop ? 60 : 36,
            },
          ]}
        />
        
        {(isTablet || isDesktop) && (
          <View 
            ref={searchBarRef}
            style={styles.searchContainer}
          >
            <SearchBar
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearch}
              onPress={handleSearch}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                // Measure the actual rendered SearchBar width
                if (width > 0) {
                  setSearchBarWidth(width);
                }
              }}
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && searchBarWidth > 0 && (
              <View style={[styles.suggestionsDropdown, { width: searchBarWidth }]}>
                {isLoading && searchQuery.length >= 2 ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : searchQuery.length >= 2 && suggestions.length > 0 ? (
                  // Show suggestions when user has typed 2+ characters
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Suggestions</Text>
                    </View>
                    <FlatList
                      data={suggestions}
                      renderItem={renderSuggestionItem}
                      keyExtractor={(item, index) => `suggestion-${index}`}
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}
                      scrollEnabled={false}
                    />
                    {recentSearches.length > 0 && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.sectionHeader}>
                          <Text style={styles.sectionTitle}>Recent Searches</Text>
                        </View>
                        <FlatList
                          data={recentSearches.slice(0, 3)}
                          renderItem={renderRecentSearchItem}
                          keyExtractor={(item, index) => `recent-${index}`}
                          keyboardShouldPersistTaps="handled"
                          nestedScrollEnabled={true}
                          scrollEnabled={false}
                        />
                      </>
                    )}
                  </>
                ) : searchQuery.length < 2 && recentSearches.length > 0 ? (
                  // Show recent searches when user hasn't typed much
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent Searches</Text>
                    </View>
                    <FlatList
                      data={recentSearches}
                      renderItem={renderRecentSearchItem}
                      keyExtractor={(item, index) => `recent-${index}`}
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled={true}
                      scrollEnabled={false}
                    />
                  </>
                ) : null}
              </View>
            )}
          </View>
        )}
      </View>

      {/* RIGHT SECTION */}
      <View style={styles.rightSection}>

        {/* Profile/Sign In */}
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfileClick}
        >
          <Text style={styles.greetingText}>
            {isValidUser ? `Hello, ${username || "User"}` : "Sign In"}
          </Text>
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => {
              if (hideUserGreeting) {
                redirectToPage(containers.homeScreen);
              } else {
                redirectToPage(containers.AdminDashboardScreen);
              }
            }}
          >
            <Text style={styles.adminText}>
              {hideUserGreeting ? "User" : "Admin"}
            </Text>
          </TouchableOpacity>
        )}

        {isValidUser && !hideUserGreeting && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => redirectToPage(containers.cartScreen)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="cart-outline" size={24} color={colors.primary} />
              {cartItemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}


         {!hideUserGreeting && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => redirectToPage(containers.userNotificationsScreen)}
            >
              <Ionicons name="notifications" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.lightgrey,
    position: "relative",
    zIndex: 10001,
    overflow: "visible",
  },
  logo: {
    resizeMode: "contain",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  searchContainer: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
    zIndex: 10001, 
  },
  suggestionsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 4,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 300,
    zIndex: 10002,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
    cursor: 'pointer',
  },
  suggestionItemPressed: {
    backgroundColor: colors.offWhite || '#f5f5f5',
  },
  suggestionIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
    cursor: 'pointer',
  },
  recentSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
    cursor: 'pointer',
    borderRadius: 4,
  },
  removeButtonPressed: {
    backgroundColor: colors.lightgrey || '#e0e0e0',
  },
  sectionHeader: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightgrey,
    marginVertical: 4,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 14,
    padding: 6,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: colors.primaryRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  adminButton: {
    marginLeft: 16,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  greetingText: {
    marginRight: 8,
    color: colors.primary,
    fontWeight: "500",
  },
});