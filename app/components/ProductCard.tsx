import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../../app/config/colors';
import Star from '../../components/Star';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: any;
  productColors: string[];
  category: string;
  rating: number;
  noOfreviews: number;
  reviews: {
    id: string;
    name: string;
    review: string;
    rating: number;
    text: string;
  }[];
}

const ProductCard = ({
  id,
  name,
  description,
  rating,
  noOfreviews,
  price,
  originalPrice,
  image,
}: ProductCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push({
        pathname: "/productDetailScreen/productDetailScreen",
        params: { productId: id}
      })}
    >
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{name}</Text>
        <View style={styles.ratingContainer}>
          <Star filled size={16} />
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.reviews}>({noOfreviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.saleTag}>Sale</Text>
          <Text style={styles.price}>${price}</Text>
          <Text style={styles.originalPrice}>${originalPrice}</Text>
          <Text style={styles.discount}>{Math.round(((originalPrice - price) / originalPrice) * 100)}% off</Text>
        </View>
        <Text style={styles.saleEnds}>Sale ends</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:colors.lightgrey,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 203,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    alignSelf: 'center',
    color: colors.black,
    paddingHorizontal: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '500',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 16,
    color:colors.reviewsColor,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: 4,
  },
  saleTag: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    marginRight: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.reviewsColor,
    textDecorationLine: 'line-through',
    marginLeft: 6,
    marginRight: 6,
  },
  discount: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
  },
  saleEnds: {
    fontSize: 12,
    color:colors.reviewsColor,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default ProductCard;
