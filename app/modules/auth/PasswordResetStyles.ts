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
  passwordResetHeaderStyle: {
    marginTop: 20,
    paddingVertical: 10,
  },
  sectionContainerWeb: {
    justifyContent: 'center',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    marginTop: -100,
  },
  passwordResetHeaderTitle: {
    fontSize: 35,
    fontWeight: '700',
  },
  errorTextDesktop: {
    marginTop: 4,
  },
});

export default styles;
