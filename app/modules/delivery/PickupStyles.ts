import { StyleSheet } from "react-native";
import colors from "../../config/colors";

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 16,
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
  },
  required: {
    color: colors.error,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    // marginTop: 20,
    marginBottom: 16,
    color: colors.black,
  },
  collectorOptions: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 20,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: colors.black,
  },
  helperText: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    width: 120,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    // paddingHorizontal: 16,
    borderRadius: 5,
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
