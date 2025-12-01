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
  signUpHeaderStyle: {
    marginTop: 40,
    paddingVertical: 10,
  },
  sectionContainerWeb: {
    justifyContent: 'center',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    marginTop: -100,
  },
  signUpHeaderTitle: {
    fontSize: 35,
    fontWeight: '700',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  labelDesktop: {
    marginLeft: 3,
  },
  input: {
    height: 48,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 8,
    backgroundColor: colors.lightgrey,
  },
  inputDesktop: {
    paddingHorizontal: 12,
    fontSize: 16,
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
  phoneInputContainerError: {
    borderColor: 'red',
  },
  phoneInputContainerFocused: {
    borderColor: colors.black,
    borderWidth: 2,
  },
  phoneInputContainerDesktop: {
    borderRadius: 8,
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: colors.placeholdergrey,
    minWidth: 80,
  },
  countryPickerContainerDesktop: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    height: 48,
    justifyContent: 'center',
    minWidth: 100,
  },
  countryPickerButton: {
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
  countryPickerButtonDesktop: {
    paddingVertical: 0,
    paddingRight: 8,
    paddingLeft: 8,
    height: '100%',
    justifyContent: 'center',
    minWidth: 100,
  },
  errorTextDesktop: {
    marginTop: 4,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 14,
    backgroundColor: colors.lightgrey,
  },
  phoneInputDesktop: {
    height: 48,
    fontSize: 16,
  },
  passwordContainer: {
    paddingTop: 16,
  },
});

export default styles;
