import { router } from "expo-router";
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
import DisplayPrice from "./DisplayPrice";
import { globalStyles } from "@/assets/styles/globalStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";

function ExclusiveOffers(props) {
  const exclusiveOffers = props.exclusiveOffers || [];
  return exclusiveOffers.length > 0 ? (
    <>
      <View>
        <Text style={globalStyles.sectionHeading}>Exclusive Offers</Text>
        <FlatList
          horizontal
          data={exclusiveOffers}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exclusiveCard}
              onPress={() =>
                redirectToPage(containers.productDetailScreenScreen, {
                  productId: item.id,
                })
              }
            >
              <Image
                source={item.imageUrl}
                style={styles.exclusiveImage}
                resizeMode="cover"
              />
              <View style={styles.exclusiveDetails}>
                <Text style={styles.exclusiveTitle}>{item.title}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.starIcon}> ★ </Text>
                  <Text style={styles.reviewsText}>({item.reviews})</Text>
                </View>
                <View style={styles.saleContainer}>
                <View style = {styles.saleTimeBox}>
                  <View style={styles.saleTag}>
                    <Text style={styles.saleText}>Sale</Text>
                  </View>
                    <Text style={styles.saleTime}>02:48:26</Text>
                    </View>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountText}>{item.discount}</Text>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <DisplayPrice
                    price={item.price}
                    originalPrice={item.originalPrice}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </View>
    </>
  ) : (
    <></>
  );
}
const styles = StyleSheet.create({
  productsList: {
    //padding: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    color: colors.reviewsColor,
  },
  starIcon: {
    color: colors.reviewsColor,
    fontSize: 14,
  },
  reviewsText: {
    fontSize: 14,
    color: colors.reviewsColor,
  },
  saleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  saleTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  saleText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  saleTimeBox:{
    backgroundColor:"#E9F3F6",
    flexDirection: "row",
  },
  saleTime: {
    color: colors.primary,
    fontSize: 14,
    marginTop:2,
    marginRight: 8,
  },
  discountTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  salePrice: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: colors.black,
  },
  exclusiveTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.black,
  },
  exclusiveDetails: {
    padding: 12,
  },
  exclusiveImage: {
    width: "100%",
    height: 250,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  exclusiveCard: {
    width: 240,
    height: 400,
    marginRight: 12,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
    overflow: "hidden",
  },
  /* sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    marginLeft: 10,
  }, */
});
export default ExclusiveOffers;
