import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Light background color
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
    marginTop: 20,
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
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  placeOrderButton: {
    backgroundColor: "skyblue",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
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
    marginTop: 20,
  },
  similarProductsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
});

export default styles;
