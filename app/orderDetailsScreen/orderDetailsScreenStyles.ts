import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 16,
    backgroundColor: colors.white,
    //marginBottom: 16,
  },
  cartItemContainerStyle: {
    paddingHorizontal: 0,
  },
  barCodeNote: {
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  orderSummaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderSummaryItemText: {
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: colors.buttonError,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    //marginTop: 20,
  },
  deliverSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginTop: 16,
  },
  addressText: {
    fontSize: 15,
  },
  buttonContainer: {
    marginHorizontal: 16,
  },
});

export default styles;
