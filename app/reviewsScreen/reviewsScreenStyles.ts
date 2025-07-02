import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    marginBottom: 16,
  },
  overAllRatingContainer: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    fontSize: 32,
    fontWeight: 500,
  },
  reviewsContainer: {},
  reviewContainerHeading: {
    //fontWeight: 500,
    fontSize: 36,
    marginBottom: 16,
    lineHeight: 36,
  },
  addReviewContainer: {
    // flexDirection: "row-reverse",
    // flexWrap: "nowrap",
    // paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addReviewBtn: {
    borderRadius: 50,
  },
  starsContainer: {
    marginBottom: 0,
  },
  reviewsHeader:{
      flexDirection:"row",
      justifyContent:"space-between",
      alignContent:"center",
      alignItems:"center",
    },
    addReviewText:{
      textDecorationStyle:"solid",
      textDecorationLine:"underline",
      fontSize:14,
      // paddingTop: 8,
      color:colors.primary,
    }
});

export default styles;
