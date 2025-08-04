import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

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
    marginTop: 10,
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
    //marginTop: -216,
  },
  cancelButton: {
    backgroundColor: colors.error,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    //marginTop: 20,
  },
  deliverSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginTop: -250,
  },
  addressText: {
    fontSize: 15,
  },
  buttonContainer: {
    marginHorizontal: 16,
    gap: 16,
  },
});

export default styles;
