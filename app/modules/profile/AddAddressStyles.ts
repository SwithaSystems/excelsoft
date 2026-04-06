import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  screenShell: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingBottom: 24,
  },
  container: {
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
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
    backgroundColor: colors.lightgrey,
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
    alignItems: "center",
    paddingBottom: 16,
  },
  bottomActionBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightgrey,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    alignContent: "center",
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default styles;
