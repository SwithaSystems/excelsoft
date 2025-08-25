import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightgrey,
    paddingVertical: 15,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.lightSkyBlue,
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 4,
  },
  iconContainer: {
    height: 32,
    width: 32,
    backgroundColor: colors.secondary,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    borderColor: colors.primary,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  optionLabel: {
    fontSize: 16,
    color: colors.black,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: colors.lightgrey,
    // or any other dimmed color
  },
  buttonText_disabled: {
    color: colors.black,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;
