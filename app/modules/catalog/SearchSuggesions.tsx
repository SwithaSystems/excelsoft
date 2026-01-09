import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../components/Header";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { globalStyles } from "@/assets/styles/globalStyles";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import SearchBar from "@/app/components/searchBar";

const suggestions = [
  "baby toys",
  "baby wipes",
  "baby gel",
  "baby boy dresses",
  "baby food",
  "baby stroller",
  "baby clothes",
  "baby girl dresses",
  "baby care",
  "baby powder",
  "baby oil",
  "baby shampoo",
];

const SearchSuggestionsScreen = () => {
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    (params.query as string) || ""
  );
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);

  useEffect(() => {
    const filtered = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [searchQuery]);

  const handleSearch = () => {
    // console.log("searchquery", searchQuery);
    if (searchQuery.trim()) {
      redirectToPage(containers.searchResultsScreen, {
        query: searchQuery,
      });
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    redirectToPage(containers.searchResultsScreen, { query: suggestion });
  };

  return (
    // <SafeAreaView style={globalStyles.safeAreaContainer}>
    // <View style={styles.container}>
    //   <Header headerText={"Search Page"} />
    <PageLayout
      hasHeader
      headerComponent={<Header headerText={"Search Page"} />}
      hasFooter={false}
      scrollable
    >
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          onPress={handleSearch}
        />
      </View>

      <View style={styles.suggestionsList}>
        {filteredSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSuggestionPress(suggestion)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <View style={styles.suggestionContainer}>
              <Ionicons name="search" size={24} color={colors.primary} />
              <Text style={styles.suggestion}>{suggestion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {/* </View>
    </SafeAreaView> */}
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingLeft: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 80,
    alignSelf: "center",
  },
  searchContainer: {
    marginRight: 16,
  },
  suggestionsList: {
    marginTop: 16,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  suggestion: {
    padding: 16,
  },
});

export default SearchSuggestionsScreen;
