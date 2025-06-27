import { StyleSheet } from "react-native";
import colors from "../config/colors";

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
});

export default styles;
