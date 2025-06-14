import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "../app/config/colors";
import { router } from "expo-router";
import DisplayPrice from "./DisplayPrice";
import Button from "./commonComponents/Button";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "@/assets/styles/globalStyles";

function RecommendedProductsSlider(props) {
  const recommendedProducts = props?.recommendedProducts;
  const renderRecommendedProducts = () => (
    <View>
      <Text style={props?.sectionTitleStyle}>{props.title}</Text>
      <FlatList
        horizontal
        data={recommendedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recommendedCard}
            onPress={() =>
              redirectToPage(containers.productDetailScreenScreen, {
                productId: item.id,
              })
            }
          >
            <Image
              source={item.imageUrl}
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <View style={styles.recommendedDetails}>
              <Text style={styles.recommendedTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating} ★ </Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>
              {props.showAddToCart && (
                <>
                  <DisplayPrice
                    price={item.price}
                    originalPrice={item.originalPrice}
                  />
                  <View style={[{ marginTop: 4 }, styles.button]}>
                    <Button
                      style={styles.addToCArtBtn}
                      textStyle={styles.addToCArtBtnText}
                      title="Add"
                      onPress={() => {
                        console.log("item to be added in cart", item);
                        const itemWithQuantity = { ...item, quantity: 1 };
                        props.handleAdd(itemWithQuantity);
                      }}
                    />
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
  return renderRecommendedProducts();
}
const styles = StyleSheet.create({
  addToCArtBtn: {
    paddingVertical: 8,
  },
  addToCArtBtnText: {
    fontSize: 12,
  },
  button: {
    //alignItems: "center",
    //justifyContent: "center",
    //alignSelf: "center",
    paddingRight: 10,
  },
  productsList: {
    // padding: 10,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.reviewsColor,
  },
  ratingText: {
    fontSize: 14,
    color: colors.reviewsColor,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recommendedDetails: {
    marginLeft: 12,
  },
  recommendedCard: {
    width: 160,
    paddingBottom: 4,
    marginRight: 16,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
  },
  recommendedImage: {
    width: "100%",
    height: 120,
    marginBottom: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});

export default RecommendedProductsSlider;
