import { StyleSheet } from 'react-native';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: colors.white,
    
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20,
    color: colors.oceanGreen
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: colors.oceanGreen
  },
  signInButton: {
    width: "100%",
    marginBottom: 18,
  },
  signUpButton: {
    width: "100%",
  },
});

export default styles;
