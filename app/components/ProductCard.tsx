import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../app/config/colors";
import Star from "../../components/Star";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

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
      onPress={() =>
        redirectToPage(containers.productDetailScreenScreen, { productId: id })
      }
    >
      <Image source={image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}</Text>
          <Star filled={true} size={16} />
          <Text style={styles.reviews}>({noOfreviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.saleTag}>Sale</Text>
          <Text style={styles.time}>02:48:26</Text>
          <Text style={styles.discount}>
            {Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </Text>

          <Text style={styles.price}>${price}</Text>
          <Text style={styles.originalPrice}>${originalPrice}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 203,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: colors.black,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 4,
  },
  reviews: {
    margin: 4,
    fontSize: 16,
    color: colors.reviewsColor,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
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
    fontWeight: "600",
    color: colors.primary,
    marginRight: 6,
    marginTop: 6,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: "line-through",
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
  },
  time: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
  discount: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 6,
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
});

export default ProductCard;
