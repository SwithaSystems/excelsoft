import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import  HomeStyles  from '../home/Homestyles';

interface ProductCardProps {
  title: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  saleEndsAt?: string;
  discount?: string;
  onPress: () => void;
}

const ProductCard = ({
  title,
  rating,
  reviews,
  price,
  originalPrice,
  imageUrl,
  onPress,
}: ProductCardProps) => {
  const isRemoteImage = typeof imageUrl === 'string';

  return (
    <TouchableOpacity style={HomeStyles.productCard} onPress={onPress}>
      <Image 
       source={isRemoteImage ? { uri: imageUrl } : imageUrl} 
      style={HomeStyles.productImage} />
      <View style={HomeStyles.productInfo}>
        <Text style={HomeStyles.productTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={HomeStyles.productRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={HomeStyles.ratingText}>
            {rating} ({reviews})
          </Text>
        </View>
        <View style={HomeStyles.discountContainer}>
          <Text style={HomeStyles.discountPrice}>${price}</Text>
          {originalPrice && (
            <Text style={HomeStyles.originalPrice}>${originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
