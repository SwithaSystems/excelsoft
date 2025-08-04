import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  passwordContainer: {
    paddingTop: 16,
  },
  emailContainer: {
    //marginBottom: 10,
  },
  input: {
    height: 48,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 0,
    backgroundColor: colors.lightgrey,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  forgotPassword: {
    color: colors.primary,
    marginBottom: 16,
  },
  signInButton: {
    marginBottom: 16,
  },
  signInText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    textAlign: "center",
    color: colors.reviewsColor,
  },
  signUpLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
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
    color: colors.black,
  },
  callingCode: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 5,
    overflow: "hidden",
    height: 48,
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.offWhite,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: colors.placeholdergrey,
    //height: 36,
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
    backgroundColor: colors.lightgrey,
  },
});

export default styles;
