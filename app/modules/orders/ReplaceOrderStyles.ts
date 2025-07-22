import colors from "@/app/config/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  view: {
    paddingBottom: 16,
  },
  returnOrderCategory: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 20,
    marginBottom: 10,
  },
  returnOrderItemText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  returnOrderId: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.lightSkyBlue,
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 4,
  },
  selectedOption: {
    borderColor: colors.primary,
  },
  iconContainer: {
    height: 32,
    width: 32,
    backgroundColor: colors.secondary,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.black,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  sideHeadingText: {
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: colors.paleWhite,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQty: {
    fontSize: 14,
    color: colors.darkGray,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.darkCharcoal,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: colors.argentGray,
    fontSize: 13,
    marginLeft: 4,
  },
  striked: {
    textDecorationLine: "line-through",
    color: "gray",
    fontSize: 14,
  },
  checkBoxContainer: {
    backgroundColor: colors.white,
    borderWidth: 0,
    padding: 10,
    marginTop: 0,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0,
  },
  checkBoxText: {
    color: colors.black,
    fontWeight: 400,
  },
  replaceReason: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectReason: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.white,
    marginTop: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
    backgroundColor: colors.placeholdergrey,
  },
  addComments: {
    marginVertical: 20,
  },
  commentsText: {
    height: 150,
    backgroundColor: colors.placeholdergrey,
    borderWidth: 0,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
    marginTop: 20,
  },
  keepOrderButton: {
    backgroundColor: colors.reviewsColor,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
    marginTop: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  addressTextBox: {
    height: 150,
    borderWidth: 1,
    borderColor: colors.black,
    padding: 10,
    borderRadius: 10,
    textAlignVertical: "top",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default styles;
