import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from "react-native";
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

interface ProductCardProps extends Product {
  onAddToCart?: () => void;
}

const ProductCard = ({
  _id,
  id,
  name,
  categoryId,
  description,
  rating,
  noOfreviews,
  // discount,
  netPrice,
  isVatApplicable,
  vatRate,
  vatAmount,
  image,
  onAddToCart,
}: ProductCardProps) => {
  const router = useRouter();
  const isWeb = Platform.OS === "web";
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
      _id,
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
      // discount: 0,
      quantity: 1,
    };

    if (isItemSaved(id)) {
      dispatch(removeFromSavedItems(id));
    } else {
      dispatch(addToSavedItems(currentItem));
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    }
  };

  const maxTitleLength = isWeb ? 20 : 12;
  let displayName =
    name.length > maxTitleLength
      ? name.substring(0, maxTitleLength - 3) + "..."
      : name;
  if (!isWeb) {
    while (displayName.length < maxTitleLength) displayName += " ";
  }

  // Web-specific dimensions - smaller for compact grid layout
  const imageHeight = isWeb ? 150 : 203;
  const titleFontSize = isWeb ? 13 : 18;
  const ratingFontSize = isWeb ? 11 : 16;
  const priceFontSize = isWeb ? 13 : 16;
  const heartSize = isWeb ? 40 : 30;
  const starSize = isWeb ? 12 : 16;
  const contentPadding = isWeb ? 6 : 8;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        redirectToPage(containers.productDetailScreen, { productId: id })
      }
    >
      {/* Only render image if product has one */}
      <View style={[styles.image, { height: imageHeight }]}>
        <Image
          source={
            typeof image === "string" && image !== ""
              ? { uri: image }
              : typeof image === "object" && image
              ? image
              : require("../../assets/Placeholder.png")
          }
          style={[styles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
      </View>

      <View style={[styles.content, { padding: contentPadding }]}>
        <View style={globalStyles.savedContainer}>
          <Text style={[styles.title, { fontSize: titleFontSize }]} numberOfLines={isWeb ? 2 : 1}>
            {displayName}
          </Text>
          <TouchableOpacity 
            onPress={handleHeartPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={isItemSaved(id) ? "heart" : "heart-outline"}
              size={heartSize}
              color={isItemSaved(id) ? colors.primaryRed : colors.black}
            />
          </TouchableOpacity>
        </View>

        {noOfreviews > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { fontSize: ratingFontSize }]}>{Number(rating).toFixed(1)}</Text>
            <Star filled={false} size={starSize} />
            <Text style={[styles.reviews, { fontSize: ratingFontSize }]}>({noOfreviews})</Text>
          </View>
        )}

        {netPrice > 0 && (
          <View style={styles.saleContainer}>
            <View style={styles.saleTimeBox}>
              {/* Sale/Time content removed as per your code */}
            </View>
          </View>
        )}

        <View style={styles.priceAndButtonContainer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceText, { fontSize: priceFontSize }]}>
              {CurrencySymbol}
              {netPrice.toFixed(2)}
            </Text>
          </View>
          
          {onAddToCart && (
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="cart-outline" size={isWeb ? 16 : 20} color={colors.white} />
              <Text style={styles.addToCartText}>Add</Text>
            </TouchableOpacity>
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
    width: "100%",
    flex: 1,
  },
  image: {
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
  },
  title: {
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
    fontWeight: "500",
    marginRight: 4,
    color: colors.reviewsColor,
  },
  reviews: {
    margin: 4,
    color: colors.reviewsColor,
  },
  priceAndButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  priceText: {
    fontWeight: "600",
    color: colors.primary,
  },
  saleContainer: {
    flexDirection: "row",
    marginBottom: 4,
  },
  saleTimeBox: {
    flexDirection: "row",
    backgroundColor: colors.secondary,
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
    marginRight: 6,
  },
  netPrice: {
    color: colors.secondaryText,
    textDecorationLine: "line-through",
    marginLeft: 6,
    marginRight: 6,
  },
  time: {
    fontSize: 14,
    color: colors.primary,
    borderRadius: 5,
    paddingRight: 6,
    marginTop: 2,
    marginRight: 8,
  },
  addToCartButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ProductCard;