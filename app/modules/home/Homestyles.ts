import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../constants/colors";

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
    paddingVertical: 4,
  },
  categoryItem: {
    alignItems: "center",
    // marginHorizontal: 8,
    // minWidth: 80,
    marginRight: 8,
    height: 104,
    width: 72,
  },
  categoryImage: {
    width: 52,
    height: 52,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  categoryText: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    // maxWidth: 80,
    //flexWrap:'wrap',
    lineHeight: 14,
    height: 32,
    fontWeight: "500",
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
