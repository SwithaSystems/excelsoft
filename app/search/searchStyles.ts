import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchBarContainer: {
    // paddingHorizontal: 16,
    // marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    // marginHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  clearAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
    paddingLeft: 15,
  },
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    // paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // paddingHorizontal: 15,
  },
  suggestionsContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  suggestionItem: {
    // padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  suggestionText: {
    fontSize: 16,
  },
  loadingContainer: {
    // padding: 20,
    alignItems: "center",
  },
  emptyStateText: {
    color: colors.black,
    textAlign: "center",
    paddingRight: 15,
    paddingBottom: 16,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;
