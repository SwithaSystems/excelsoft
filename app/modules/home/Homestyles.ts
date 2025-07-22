import { StyleSheet, Dimensions } from "react-native";
import colors from "../../config/colors";

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
    paddingVertical: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  categoryImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    maxWidth: 80,
    //flexWrap:'wrap',
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
  discountPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.darkGray,
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
});
