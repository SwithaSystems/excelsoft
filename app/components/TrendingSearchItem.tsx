import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../config/colors';

interface TrendingSearchItemProps {
  text: string;
  onPress: () => void;
}

const TrendingSearchItem = ({ text, onPress }: TrendingSearchItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons name="trending-up" size={32} color={colors.black}  />
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 180,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.black,
    fontWeight: '400',
  },
});

export default TrendingSearchItem;
