import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../config/colors';

interface SearchHistoryItemProps {
  searchText: string;
  onRemove: () => void;
  onSelect: (text: string) => void;
}

const SearchHistoryItem = ({ searchText, onRemove, onSelect }: SearchHistoryItemProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.leftContent} onPress={() => onSelect(searchText)}>
        <Ionicons name="time-outline" size={24} color={colors.secondary} />
        <Text style={styles.searchText}>{searchText}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close" size={20} color={colors.secondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 15,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: {
    fontSize: 16,
    color: colors.black,
    //marginLeft: 10,
  },
});

export default SearchHistoryItem;
