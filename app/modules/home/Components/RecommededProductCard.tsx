import react from "react";
import { View, Image, Text, TouchableOpacity, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import colors from "../../../config/colors";
import { router } from "expo-router";
import products from "@/data/products";
import { Ionicons } from "@expo/vector-icons";

const RecommededProductCard = () => {
  const recommendedProducts = products
    .filter((p) =>
      ["Greek Yogurt", "Baby Stroller", "Granola Bars"].includes(p.name)
    )
    .map((product) => ({
      id: product.id,
      title: product.name,
      rating: product.rating,
      reviews: product.noOfreviews,
      imageUrl: product.image,
    }));
  return (
    <View>
      <Text style={styles.sectionTitle}>Recommended for You</Text>
      <FlatList
        horizontal
        data={recommendedProducts}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recommendedCard}
            onPress={() =>
              router.push({
                pathname: "./productDetailScreen/productDetailScreen",
                params: { productId: item.id },
              })
            }
          >
            <Image
              source={item.imageUrl}
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <View style={styles.recommendedDetails}>
              <View style={styles.savedContainer}>
                <Text style={styles.recommendedTitle}>{item.title}</Text>
                <Ionicons
                  name="heart-outline"
                  size={20}
                  color={colors.black}
                  style={{
                    paddingRight: 4,
                    paddingTop: 5,
                  }}
                />
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating} ★</Text>
                <Text style={styles.reviewsText}>({item.reviews})</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  productsList: {
    padding: 10,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.reviewsColor,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: colors.reviewsColor,
    marginLeft: 16,
  },
  savedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  recommendedCard: {
    width: 160,
    height: 180,
    marginRight: 15,
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
  recommendedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recommendedDetails: {
    marginLeft: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginLeft: 10,
  },
});

export default RecommededProductCard;
