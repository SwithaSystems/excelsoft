import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import colors from "../../constants/colors";
import Star from "./Star";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import CurrencySymbol from "@/constants/CurrencySymbol";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/assets/styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  addToSavedItems,
  removeFromSavedItems,
} from "@/store/slices/savedItemsSlice";
import { Product } from "@/services/productService";

// interface ProductCardProps {
//   id: string;
//   name: string;
//   description: string;
//   discount: number;
//   netPrice: number;
//   image: any;
//   productColors: string[];
//   category: string;
//   rating: number;
//   noOfreviews: number;
//   reviews: {
//     id: string;
//     name: string;
//     review: string;
//     rating: number;
//     text: string;
//   }[];
// }

const ProductCard = ({
  id,
  name,
  categoryId,
  description,
  rating,
  noOfreviews,
  discount,
  netPrice,
  isVatApplicable,
  vatRate,
  vatAmount,
  image,
}: Product) => {
  const router = useRouter();
  const isRemoteImage = typeof image === "string";

  const dispatch = useDispatch();
  const savedItems = useSelector((state: any) => state.savedItems?.items || []);
  const isItemSaved = (itemId: any) => {
    return savedItems.some((savedItem: any) => savedItem.id === itemId);
  };
  const handleHeartPress = (e: any) => {
    e.stopPropagation();

    // Create the item object from the props
    const currentItem = {
      _id: "",
      id,
      name,
      description,
      rating,
      noOfreviews,
      netPrice,
      isVatApplicable,
      vatRate,
      vatAmount,
      image,
      discount: 0,
      quantity: 1,
    };

    console.log("saved item", currentItem);

    if (isItemSaved(id)) {
      dispatch(removeFromSavedItems(id));
    } else {
      dispatch(addToSavedItems(currentItem));
    }
  };

  const maxTitleLength = 12;
  let displayName =
    name.length > maxTitleLength
      ? name.substring(0, maxTitleLength - 3) + "..."
      : name;
  while (displayName.length < maxTitleLength) displayName += " ";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        redirectToPage(containers.productDetailScreen, { productId: id })
      }
    >
      {/* Only render image if product has one */}
      {image ? (
        <View style={styles.image}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={globalStyles.savedContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {displayName}
          </Text>
          <TouchableOpacity onPress={handleHeartPress}>
            <Ionicons
              name={isItemSaved(id) ? "heart" : "heart-outline"}
              size={20}
              color={isItemSaved(id) ? colors.primaryRed : colors.black}
            />
          </TouchableOpacity>
        </View>
        {noOfreviews > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{rating}</Text>
            <Star filled={false} size={16} />
            <Text style={styles.reviews}>({noOfreviews})</Text>
          </View>
        )}
        {netPrice > discount && discount > 0 && (
          <View style={styles.saleContainer}>
            <View style={styles.saleTimeBox}>
              {/* <View style={styles.saleTag}>
                <Text style={styles.saleText}>Sale</Text>
              </View> */}
              {/* <Text style={styles.time}>02:48:26</Text> */}
            </View>
            <Text style={styles.discount}>
              {Math.round((discount / netPrice) * 100)}%
            </Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={styles.discount}>
            {CurrencySymbol}
            {netPrice - discount}
          </Text>
          {netPrice > discount && (
            <Text style={styles.netPrice}>
              {CurrencySymbol}
              {netPrice}
            </Text>
          )}
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
    color: colors.reviewsColor,
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
  saleContainer: {
    flexDirection: "row",
  },
  saleTimeBox: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
    //borderRadius: 5,
    alignItems: "center",
  },
  saleText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  saleTag: {
    backgroundColor: colors.primary,
    color: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 4,
    //borderRadius: 4,
    marginRight: 6,
  },
  discount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginRight: 6,
    marginTop: 6,
  },
  netPrice: {
    fontSize: 14,
    color: colors.secondaryText,
    textDecorationLine: "line-through",
    marginLeft: 6,
    marginRight: 6,
    marginTop: 6,
  },
  time: {
    fontSize: 14,
    color: colors.primary,
    //backgroundColor: colors.secondary,
    borderRadius: 5,
    paddingRight: 6,
    marginTop: 2,
    marginRight: 8,
  },
  // discount: {
  //   fontSize: 14,
  //   color: colors.primary,
  //   marginLeft: 6,
  //   backgroundColor: colors.secondary,
  //   padding: 4,
  //   borderRadius: 5,
  // },
});

export default ProductCard;
