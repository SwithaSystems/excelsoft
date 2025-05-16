import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 16,
    color: colors.white,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImage:{
    height:383,
    width:383,
  }
});

export default styles;
