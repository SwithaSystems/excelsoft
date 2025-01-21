import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from './searchStyles';

const suggestions = [
  'baby toys',
  'baby wipes',
  'baby gel',
  'baby boy dresses',
  'baby food',
  'baby stroller',
  'baby clothes',
  'baby girl dresses',
  'baby care',
  'baby powder',
  'baby oil',
  'baby shampoo',
];

const Search = () => {
  const { query } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(query?.toString() || '');
  const router = useRouter();

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push({
      pathname: './search/results',
      params: { query: suggestion }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
      </View>
      <FlatList
        data={filteredSuggestions}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
            <Text style={styles.suggestion}>{item}</Text>
          </TouchableOpacity>
        )}
        style={styles.suggestionsList}
      />
    </View>
  );
};

export default Search;
