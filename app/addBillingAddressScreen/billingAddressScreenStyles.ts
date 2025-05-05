import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  addressList: {
    paddingHorizontal: 26,
  },
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  section: {
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  cartItemContainerStyle: {
    paddingHorizontal: 0,
  },
  orderSummaryContainer: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 4,
  },
  countriesdropdown: {
    backgroundColor: colors.lightgrey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
    marginTop: 20,
  },
});

export default styles;
