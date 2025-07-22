import { StyleSheet } from "react-native";
import colors from "../../config/colors";

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
});

export default styles;
