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
  linkText: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 16,
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
    color: colors.error,
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
  noteContainer: {
    backgroundColor: colors.ageRestrictionBg,
    borderColor: colors.ageRestrictionBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    width: "100%",
    alignSelf: "stretch",
  },
  noteContainerWebDesktop: {
    marginBottom: 16,
  },
  noteContainerWebMobile: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 12,
  },
  noteTitle: {
    color: colors.ageRestrictionText,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  noteTitleWebMobile: {
    fontSize: 14,
    marginBottom: 3,
  },
  noteText: {
    color: colors.ageRestrictionText,
    fontSize: 13,
    lineHeight: 18,
  },
  noteTextWebMobile: {
    fontSize: 12,
    lineHeight: 16,
  },
  addressSectionBlock: {
    marginBottom: 8,
  },
  addressSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 6,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 6,
  },
});

export default styles;
