import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    marginBottom: 16,
  },
  ordersContainer: {
    paddingHorizontal: 24,
  },
  eachOrderItem: {
    // Mobile default look (old code)
    borderColor: colors.placeholdergrey,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 24,
    padding: 16,
  },
  eachOrderItemWeb: {
    flex: 1,
    minWidth: 270,
    // Web/tablet enhanced card look
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    // soft shadow for card look (Android uses elevation)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  idContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statusContainer: {
    // paddingTop: 24,
  },
  trackOrderText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  searchIcon: {
    marginLeft: 10,
  },
});

export default styles;
