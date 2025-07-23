import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    // paddingTop: 16,
  },
  signInButton: {
    marginBottom: 16,
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  sectionContainer: {
    flex: 1,
    // paddingHorizontal: 10,
    marginTop: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: colors.offWhite,
    borderRadius: 30,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  activeText: {
    color: colors.white,
    fontWeight: "600",
  },
  inactiveText: {
    color: colors.darkCharcoal,
  },
  callingCode: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderGrey,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 16,
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.offWhite,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: colors.borderGrey,
  },
  countryPickerButton: {
    paddingVertical: 8,
    paddingRight: 5,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default styles;
