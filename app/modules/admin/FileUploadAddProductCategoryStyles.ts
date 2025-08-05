import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";
import { color } from "react-native-elements/dist/helpers";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: colors.black,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  modalSelector: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 10,
  },
  modalInitValue: {
    color: colors.darkGray,
  },
  modalSelectedText: {
    fontSize: 16,
    color: colors.black,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalSelectedItemText: {
    fontWeight: "bold",
    color: colors.linkBlue,
  },
  modalTriggerText: {
    fontSize: 16,
    paddingVertical: 10,
    color: colors.black,
  },
  modalTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTriggerIcon: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.black,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
  },
  helpContainer: {
    backgroundColor: colors.infoBg,
    padding: 12,
    marginBottom: 15,
  },
  helpText: {
    fontSize: 14,
    color: colors.infoText,
    textAlign: "center",
    lineHeight: 20,
  },
  fileInfoContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fileInfoText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chooseButton: {
    backgroundColor: colors.primary,
    flex: 1,
    // marginRight: 10,
  },
  alternativeButton: {
    backgroundColor: colors.secondaryYellow,
    flex: 1,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.placeholdergrey,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
