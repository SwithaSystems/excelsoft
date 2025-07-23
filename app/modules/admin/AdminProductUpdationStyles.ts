import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.offWhite,
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: colors.black,
  },
  inputContainer: {
    marginBottom: 20,
  },
});

export default styles;
