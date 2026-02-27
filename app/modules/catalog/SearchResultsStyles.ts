import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../constants/colors";

const { width } = Dimensions.get("window");
const itemWidth = (width - 48) / 2; // 48 = padding (16) * 2 + gap between items (16)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 90,
    color: colors.black,
  },
  resultsCount: {
    fontSize: 14,
    color: colors.reviewsColor,
    // paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
    paddingTop: 0,
  },
  row: {
    justifyContent: "space-between",
    // paddingHorizontal: 8,
  },
  productItem: {
    width: itemWidth,
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  leftItem: {
    marginRight: 8,
    flex: 1,
  },
  rightItem: {
    marginLeft: 8,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    marginTop: 10,
  },
  // Web-specific styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 16,
  },
  resultsHeaderContainerWeb: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 16,
    marginBottom: 16,
  },
  resultsHeaderWeb: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    marginBottom: 8,
  },
  resultsTitleWeb: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
    flex: 1,
  },
  filterSortContainerWeb: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
  },
  // Icon-only buttons to match CategoryBadges visuals
  iconButtonWeb: {
    width: 35,
    height: 35,
    padding: 2,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  iconButtonWebSpacing: {
    marginLeft: 16,
  },
  modalOverlayWeb: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },
  sortDropdownWeb: {
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingVertical: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  sortOptionWeb: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  activeSortOptionWeb: {
    backgroundColor: colors.secondary,
  },
  sortOptionTextWeb: {
    fontSize: 14,
    color: colors.black,
  },
  activeSortOptionTextWeb: {
    fontWeight: "600",
    color: colors.primary,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center",
  },
  productsContainerWeb: {
    flex: 1,
    width: "100%",
  },
  listContainerWeb: {
    padding: 0,
    paddingTop: 0,
  },
  productsGridWeb: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "flex-start",
  },
  rowWeb: {
    justifyContent: "flex-start",
    marginBottom: 16,
    gap: 16,
  },
  productItemWeb: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
});

export default styles;
