import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  addressList: {
    paddingHorizontal: 26,
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
  orderSummaryContainer: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  activeBtn: {
    backgroundColor: colors.primary,
  },
  disabledBtn: {
    backgroundColor: colors.lightgrey,
  },
  buttonText: {
    color: colors.black,
  },
});

export default styles;
