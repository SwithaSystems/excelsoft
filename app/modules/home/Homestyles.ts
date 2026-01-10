import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../constants/colors";
import { color } from "react-native-elements/dist/helpers";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    padding: 16,
  },
  logo: {
    width: 24,
    height: 24,
  },
  welcomeText: {
    alignSelf: "flex-end",
  },
  categoriesContainer: {
    // paddingVertical: 2,
    // paddingLeft: 5,
  },
  categoryItem: {
    width: 70,             
    alignItems: "center",
  },
  categoryImageWrapper: {
    width: 45,
    height: 45,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: "#1F7A5C",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  categoryImage: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },

  categoryText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    color: colors.black,
  },
  banner: {
    height: 150,
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: 16,
    padding: 16,
    justifyContent: "center",
  },
  bannerText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  bannerSubText: {
    color: colors.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 16,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  productCard: {
    width: (width - 48) / 2,
    margin: 8,
    backgroundColor: colors.lightgrey,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 150,
  },
  productInfo: {
    padding: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  productRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.darkGray,
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  discount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  netPrice: {
    fontSize: 14,
    color: colors.darkGray,
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  finalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginRight: 6,
  },

  mrpStriked: {
    fontSize: 14,
    color: colors.darkGray,
    textDecorationLine: "line-through",
  },


});
