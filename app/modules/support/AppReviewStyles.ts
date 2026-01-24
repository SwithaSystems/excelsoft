import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  reviewContainer: {
    // paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },

  reviewContainerWeb: {
    width: "70%",
    alignSelf: "center",
  },

  label: {
    fontSize: 15,
    color: colors.black,
    marginBottom: 8,
    fontWeight: "500",
  },

  ratingCategory: {
    marginBottom: 28,
  },

  selectCategory: {
    marginBottom: 24,
  },

  chooseCategory: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.white,
    marginTop: 8,
  },

  categoryText: {
    flex: 1,
    fontSize: 14,
    color: colors.placeholdergrey,
  },

  radioContainer: {
    marginBottom: 24,
  },

  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  radioLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.black,
  },

  addYourReview: {
    marginBottom: 28,
  },

  reviewText: {
    height: 160,
    backgroundColor: colors.white,
    borderWidth: 1.2,
    borderColor: colors.placeholdergrey,
    borderRadius: 10,
    padding: 14,
    textAlignVertical: "top",
    marginTop: 8,
  },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
  },

  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
