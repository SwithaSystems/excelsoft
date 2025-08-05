import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  changePictureButton: {
    position: "absolute",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 4,
    top: 55,
    left: "50%",
    marginLeft: -45,
  },
  changePictureText: {
    fontSize: 16,
    color: colors.black,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});

export default styles;
