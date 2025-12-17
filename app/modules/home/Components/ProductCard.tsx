import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeStyles from "../Homestyles";
import CurrencySymbol from "../../../../constants/CurrencySymbol";
import colors from "../../../../constants/colors";

interface ProductCardProps {
  title: string;
  rating: number;
  reviews: number;
  discount: number;
  netPrice?: number;
  imageUrl: string;
  saleEndsAt?: string;
  onPress: () => void;
}

const ProductCard = ({
  title,
  rating,
  reviews,
  discount,
  netPrice,
  imageUrl,
  onPress,
}: ProductCardProps) => {
  const isRemoteImage = typeof imageUrl === "string";

  // console.log('discount:', discount, 'netPrice:', netPrice, 'are they equal?', discount === netPrice);

  const hasDiscount = netPrice && discount !== netPrice;

  return (
    <TouchableOpacity style={HomeStyles.productCard} onPress={onPress}>
      <Image
        source={isRemoteImage ? { uri: imageUrl } : imageUrl}
        style={HomeStyles.productImage}
      />
      <View style={HomeStyles.productInfo}>
        <Text style={HomeStyles.productTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={HomeStyles.productRating}>
          <Ionicons name="star" size={14} color={colors.lightgrey} />
          <Text style={HomeStyles.ratingText}>
            {rating} ({reviews})
          </Text>
        </View>
        <View style={HomeStyles.discountContainer}>
          <Text style={HomeStyles.discount}>
            {CurrencySymbol}
            {discount}
          </Text>
          {hasDiscount && (
            <Text style={HomeStyles.netPrice}>
              {CurrencySymbol}
              {netPrice}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;