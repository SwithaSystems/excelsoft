import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import colors from '../config/colors';

interface CategoryItemProps {
  title: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

const CategoryItem = ({ title, image, onPress }: CategoryItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={image} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.white,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '80%',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: colors.secondary,
  },
});

export default CategoryItem;
