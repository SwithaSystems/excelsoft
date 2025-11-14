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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  forgotPasswordHeaderStyle: {
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
  forgotPasswordHeaderTitle: {
    fontSize: 35,
    fontWeight: '700',
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
    marginBottom: 16,
  },
  phoneInputContainerError: {
    borderColor: 'red',
  },
  phoneInputContainerDesktop: {
    borderRadius: 8,
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.offWhite,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: colors.placeholdergrey,
  },
  countryPickerContainerDesktop: {
    paddingHorizontal: 4,
    paddingVertical: 0,
    height: 48,
    justifyContent: 'center',
  },
  countryPickerButton: {
    paddingVertical: 8,
    paddingRight: 5,
  },
  countryPickerButtonDesktop: {
    paddingVertical: 0,
    paddingRight: 2,
    paddingLeft: 2,
    height: '100%',
    justifyContent: 'center',
  },
  errorTextDesktop: {
    marginTop: 4,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: colors.lightgrey,
  },
  phoneInputDesktop: {
    height: 48,
  },
});

export default styles;
