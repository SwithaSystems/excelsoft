import colors from "@/app/config/colors";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  input: {
    height: 48,
    borderColor: "#EBEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#F8F8F8",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionContent: {
    padding: 16,
    flex: 1,
  },
  mb_3: {
    marginBottom: 16,
  },
  mt_4: {
    marginTop: 24,
  },
  mb_4: {
    marginBottom: 24,
  },
  pt_0: {
    paddingTop: 0,
  },
  pb_0: {
    paddingBottom: 0,
  },
  px_3: {
    paddingHorizontal: 16,
  },
  pl_3: {
    paddingLeft: 16,
  },
  p_3: {
    padding: 16,
  },
  mb_0: {
    marginBottom: 0,
  },
  mb_2: {
    marginBottom: 8,
  },
  h6: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 20,
    marginBottom: 16,
  },
  fontWeight500: {
    fontWeight: 500,
  },
  btnSmUnderLine: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  // date time picker styling
  webDateInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 8,
    borderRadius: 8,
    outline: "none",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 8,
    borderRadius: 8,
    width: 50,
    textAlign: "center",
    marginHorizontal: 4,
  },
  picker_sm: {
    height: 16,
    width: 40,
    fontSize: 8,
    marginLeft: 12,
    borderColor: colors.primary,
  },
  pickerValue_sm: {
    fontSize: 8,
  },
  picker_50: {
    height: 43,
    width: "50%",
    fontSize: 16,
    borderColor: colors.primary,
    borderRadius: 10,
  },
  pickerValue_50: {
    fontSize: 16,
    width: "100%",
  },
  pickUpInput: {
    borderRadius: 10,
    width: "50%",
  },
  userInputLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  userInputContainer: { width: "100%", borderWidth: 0 },
  userInputBox: {
    borderWidth: 0,
  },
  profileInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 85,
    alignSelf: "center",
    borderColor: colors.primary,
    borderWidth: 2,
    marginBottom: 16,
  },
  profilePictureContainer: {
    alignItems: "center",
    marginVertical: 24,
    position: "relative",
  },
  userInputLabelIcon: {},
});
