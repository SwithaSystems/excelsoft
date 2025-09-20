import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
  },
  // New category dropdown style (for the main selector button)
  categoryDropdown: {
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 52,
  },


  separator: {
    height: 1,
    backgroundColor: colors.secondary,
    // marginLeft: 8,
    // marginRight: 8,
    marginTop: 8,
    marginBottom: 20, 
  },

  buttonContainer: {
    //marginHorizontal: 32,
    //marginBottom: 16,
  },

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal:16,
  },
  categoryImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1, 
  },
  categoryDetails: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 2,
  },
  // New category dropdown text style
  categoryDropdownText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: '400',
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // height: "100%",
    //paddingHorizontal: 12,
    minHeight: 24,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.black,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  details: {
    paddingLeft: 24,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 500,
  },
});

export default styles;
