import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginLeft: 80,
  },
  imageContainer: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  contentContainer: {
    // padding: 16,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
  exclusiveDetails: {},
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
  saleTimeBox: {
    backgroundColor: colors.secondary,
    flexDirection: "row",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  saleTime: {
    color: colors.primary,
    backgroundColor: colors.secondary,
    fontSize: 14,
    marginTop: 2,
    marginRight: 8,
  },
  discountTag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  discountText: {
    color: colors.primary,
    fontSize: 14,
    marginTop: 2,
    marginRight: 6,
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 16,
    color: colors.lightgrey,
    textDecorationLine: "line-through",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
    marginBottom: 24,
  },
  colorSection: {
    marginBottom: 16,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: "row",
    gap: 12,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.lightgrey,
  },
  selectedColorOption: {
    borderColor: colors.primary,
  },
  quantitySection: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.lightgrey,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectQuantityText: {
    fontSize: 11,
    color: colors.primary,
    textDecorationLine: "underline",
    marginLeft: 4,
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
  },
  buttonsContainer: {
    flexDirection: "row",
    // gap: 38,
    //paddingHorizontal: 16,
  },
  button: {
    flex: 1,
  },
  reviewsSection: {
    marginTop: 24,
    // paddingHorizontal: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  seeMoreButton: {
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.black,
    marginBottom: 16,
  },
  seeMoreText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "500",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.placeholdergrey,
    margin: 4,
  },
  activeDot: {
    backgroundColor: colors.black,
    width: 10,
    height: 10,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addReviewText: {
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    fontSize: 12,
    paddingTop: 4,
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primaryRed,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
