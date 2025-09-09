import React from "react";
import { TouchableOpacity, Image, Text } from "react-native";
import HomeStyles from "../modules/home/Homestyles";

interface CategoryItemProps {
  name: string;
  imageUrl: string;
  onPress: () => void;
}

const CategoryItem_Home = ({ name, imageUrl, onPress }: CategoryItemProps) => {
  const isRemoteImage = typeof imageUrl === "string";
  return (
    <TouchableOpacity style={HomeStyles.categoryItem} onPress={onPress}>
      <Image
        source={isRemoteImage ? { uri: imageUrl } : imageUrl}
        style={HomeStyles.categoryImage}
      />
      <Text style={HomeStyles.categoryText} numberOfLines={2}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryItem_Home;
