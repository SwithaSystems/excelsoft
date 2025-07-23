import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.black,
    lineHeight: 24,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.black,
  },
  inputContainer: {
    marginBottom: 16,
    // paddingTop: 16,
  },
  required: {
    color: colors.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    backgroundColor: colors.white,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  note: {
    color: colors.buttonError,
    fontSize: 14,
    marginBottom: 16,
  },
  savedAddressContainer: {},
  addressTitle: {},
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    width: 120,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    // paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.black,
  },
  activeText: {
    color: colors.white,
  },
});

export default styles;
