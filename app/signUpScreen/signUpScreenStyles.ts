import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  sectionContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 48,
    borderColor: "#EBEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 0,
    backgroundColor: "#F8F8F8",
  },
  forgotPassword: {
    color: colors.primary,
    marginBottom: 16,
  },
  signInButton: {
    marginBottom: 16,
  },
  signInText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpText: {
    textAlign: "center",
    color: "#6E6F76",
  },
  signUpLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
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
    color: "#fff",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#333",
  },
  callingCode: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBEDED",
    borderRadius: 5,
    overflow: "hidden",
    height: 48,
  },
  countryPickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: "#EBEDED",
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
  passwordContainer:{
    paddingTop: 16,
  },
});

export default styles;
