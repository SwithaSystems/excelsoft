import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: 15,
    backgroundColor: colors.white,
  },
  sectionContainer:{
    flex: 1,
    paddingHorizontal:20,
    marginTop: 10
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
});

export default styles;
