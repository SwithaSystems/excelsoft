import { StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  pageHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 20,
  },
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
    emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  emptyStateStar: {
    fontSize: 48,
    color: colors.gold,
    marginBottom: 10,
  },

  emptyStateHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 6,
    textAlign: "center",
  },
    emptyStateSubText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: "center",
    marginBottom: 12,
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
  reviewHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
  },
  addReviewLink: {
    textDecorationLine: "underline",
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  noReviewContainerHeading: {
    //fontWeight: 500,
    fontSize: 26,
    marginBottom: 16,
    lineHeight: 26,
  },
  addReviewContainer: {
    // flexDirection: "row-reverse",
    // flexWrap: "nowrap",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addReviewBtn: {
    borderRadius: 50,
  },
  starsContainer: {
    marginBottom: 0,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
  },
  addReviewText: {
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    fontSize: 14,
    // paddingTop: 8,
    color: colors.primary,
  },

  // Web-specific styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  webContentWrapper: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    paddingVertical: Platform.OS === "web" ? 24 : 0,
    paddingHorizontal: 0,
  },
  webSectionContent: {
    paddingHorizontal: 0,
  },
  webReviewsHeader: {
    marginBottom: 8,
  },
  webOverAllRatingContainer: {
    marginBottom: 24,
  },
  webStarsContainer: {
    marginBottom: 0,
  },
  webEmptyStateContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  webReviewsContainer: {
    marginTop: 8,
  },
  webAddReviewContainer: {
    paddingHorizontal: 0,
    paddingTop: 16,
    paddingBottom: 24,
  },
  webAddReviewBtn: {
    borderRadius: 50,
  },
  // reviewsHeader:{
  //     flexDirection:"row",
  //     justifyContent:"space-between",
  //     alignContent:"center",
  //     alignItems:"center",
  //   },
  //   addReviewText:{
  //     textDecorationStyle:"solid",
  //     textDecorationLine:"underline",
  //     fontSize:14,
  //     paddingBottom:8,
  //     // paddingTop: 8,
  //     color:colors.primary,
  //   },
});

export default styles;
