import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite, // Light background color
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderSummary: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.placeholdergrey,
    paddingTop: 10,
  },
  // placeOrderButton: {
  //   backgroundColor: "skyblue",
  //   padding: 15,
  //   borderRadius: 8,
  //   alignItems: "center",
  //   marginTop: 20,
  // },
  placeOrderButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    paddingHorizontal: 34,
    paddingTop: 50,
    paddingBottom: 16,
    borderRadius: 8,
    alignItems: "center",
    maxWidth: "80%",
  },
  modalButtons: {
    marginTop: 16,
    width: "70%",
  },

  savedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  savedItemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  addBtn: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  similarProductsContainer: {
    marginTop: 24,
  },
  similarProductsTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: colors.black,
  },
  similarProductItem: {
    width: 150, // Adjust width as needed
    marginRight: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    alignItems: "center", // Center content vertically
  },
  similarProductImage: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  similarProductDetails: {
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  saveLaterBtn: {
    color: colors.primary,
    textDecorationLine: "underline",
    textDecorationColor: colors.primary,
  },
  sectionHeading: {
    fontSize: 24,
    marginBottom: 16,
  },
  // Compact Order Summary for Web
  compactOrderSummary: {
    padding: 12,
    marginTop: 0,
  },
  compactOrderSummaryHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.black,
  },
  emptyCartContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // padding: 20,
    // paddingTop: 40,
  },
  cartIcon: {
    marginBottom: 24,
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: colors.black,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  hereText: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontWeight: "500",
    top: 3.5,
  },
  // Web/Desktop Layout Styles
  webContainer: {
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 1,
    minWidth: 0, // Prevents flex items from overflowing
  },
  rightColumn: {
    width: 360,
    minWidth: 320,
    height: "20%",
  },
  cartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cartHeaderText: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.black,
  },
  clearCartText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  placeOrderContainer: {
    marginTop: 16,
    width: "100%",
  },
  ageWarningContainer: {
    backgroundColor: colors.ageRestrictionBg,
    borderColor: colors.ageRestrictionBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  ageWarningTitle: {
    color: colors.ageRestrictionText,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  ageWarningText: {
    color: colors.ageRestrictionText,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyCartMessage: {
  padding: 20,
  backgroundColor: colors.lightgrey,
  borderRadius: 8,
  marginBottom: 16,
  alignItems: 'center',
},
emptyCartMessageText: {
  fontSize: 16,
  color: colors.primary,
  textAlign: 'center',
},
});

export default styles;
