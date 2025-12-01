import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
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
  _id,
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
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;
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

  const maxTitleLength = isTabOrDesktop ? 20 : 12;
  let displayName =
    name.length > maxTitleLength
      ? name.substring(0, maxTitleLength - 3) + "..."
      : name;
  if (!isTabOrDesktop) {
    while (displayName.length < maxTitleLength) displayName += " ";
  }

  // Web-specific dimensions - smaller for compact grid layout
  const imageHeight = isTabOrDesktop ? 150 : 203;
  const titleFontSize = isTabOrDesktop ? 13 : 18;
  const ratingFontSize = isTabOrDesktop ? 11 : 16;
  const priceFontSize = isTabOrDesktop ? 13 : 16;
  const heartSize = isTabOrDesktop ? 16 : 20;
  const starSize = isTabOrDesktop ? 12 : 16;
  const contentPadding = isTabOrDesktop ? 6 : 8;
  const discountPercentage = discount > 0 ? Math.round((discount / netPrice) * 100) : 0;


  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        redirectToPage(containers.productDetailScreen, { productId: id })
      }
    >
      {/* Only render image if product has one */}
      {/* {image ? ( */}
      <View style={[styles.image, { height: imageHeight }]}>
        {/* <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          /> */}
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
      {/* ) : null} */}

      <View style={[styles.content, { padding: contentPadding }]}>
        <View style={globalStyles.savedContainer}>
          <Text style={[styles.title, { fontSize: titleFontSize }]} numberOfLines={isTabOrDesktop ? 2 : 1}>
            {displayName}
          </Text>
          <TouchableOpacity onPress={handleHeartPress}>
            <Ionicons
              name={isItemSaved(id) ? "heart" : "heart-outline"}
              size={heartSize}
              color={isItemSaved(id) ? colors.primaryRed : colors.black}
            />
          </TouchableOpacity>
        </View>
        {noOfreviews > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={[styles.rating, { fontSize: ratingFontSize }]}>{rating}</Text>
            <Star filled={false} size={starSize} />
            <Text style={[styles.reviews, { fontSize: ratingFontSize }]}>({noOfreviews})</Text>
          </View>
        )}
        {netPrice > 0 && discountPercentage > 0 && (
          <View style={styles.saleContainer}>
            <View style={styles.saleTimeBox}>
              {/* <View style={styles.saleTag}>
                <Text style={styles.saleText}>Sale</Text>
              </View> */}
              {/* <Text style={styles.time}>02:48:26</Text> */}
            </View>
            <Text style={[styles.discount, { fontSize: priceFontSize }]}>
              {/* {Math.round((discount / netPrice) * 100)}% */}
              {discountPercentage}%
            </Text>
          </View>
        )}

        <View style={styles.priceContainer}>
          <Text style={[styles.discount, { fontSize: priceFontSize }]}>
            {CurrencySymbol}
            {(netPrice - discount).toFixed(2)}
          </Text>
          {discount > 0 && (
            <Text style={[styles.netPrice, { fontSize: isTabOrDesktop ? 12 : 14 }]}>
              {CurrencySymbol}
              {Number(netPrice).toFixed(2)}
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  saleContainer: {
    flexDirection: "row",
    marginBottom: 4,
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
    fontWeight: "600",
    color: colors.primary,
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
