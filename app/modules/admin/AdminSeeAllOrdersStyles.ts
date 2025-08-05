import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    marginBottom: 16,
  },
  ordersContainer: {
    paddingHorizontal: 24,
  },
  eachOrderItem: {
    borderColor: colors.placeholdergrey,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 24,
    padding: 16,
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
