import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import  HomeStyles  from '../app/home/Homestyles';

interface CategoryItemProps {
  title: string;
  imageUrl: string;
  onPress: () => void;
}

const CategoryItem = ({ title, imageUrl, onPress }: CategoryItemProps) => {
  const isRemoteImage = typeof imageUrl === 'string';
  return (
    <TouchableOpacity style={HomeStyles.categoryItem} onPress={onPress}>
      <Image
       source={isRemoteImage ? { uri: imageUrl } : imageUrl} 
       style={HomeStyles.categoryImage} />
      <Text style={HomeStyles.categoryText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;
