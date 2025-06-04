import colors from "@/app/config/colors";
import { Platform, StatusBar, StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  textCenter: {
    textAlign: "center",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  flexRowReverse: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  size_16: { fontSize: 16 },
  justifyContentCenter: {
    justifyContent: "center",
  },
  justifyContentBetween: {
    justifyContent: "space-between",
  },
  alignItemsCenter: {
    alignItems: "center",
  },
  savedContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    height: 48,
    borderColor: "#EBEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 0,
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
  mt_0: {
    marginTop: 0,
  },
  mt_n3: {
    marginTop: -16,
  },
  mt_3: {
    marginTop: 16,
  },
  mt_4: {
    marginTop: 24,
  },
  mt_2: {
    marginTop: 8,
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
  mb_1: {
    marginBottom: 4,
  },
  ml_1: {
    marginLeft: 4,
  },
  ml_2: {
    marginLeft: 8,
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
  picker: {
    borderColor: colors.primary,
    padding: 8,
    borderRadius: 10,
    fontSize: 16,
  },
  pickerValue: {
    width: "100%",
    fontSize: 16,
  },
  picker_sm: {
    height: 16,
    width: 40,
    fontSize: 8,
    marginLeft: 12,
    borderColor: colors.primary,
  },
  pickerValue_sm: {
    fontSize: 6,
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
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF4B4B",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderCompletedBadge: {
    backgroundColor: "#C3FED9",
    color: "#16A34A",
  },
  orderPendingBadge: {
    backgroundColor: "#F1E29B",
    color: "#B5990C",
  },
  orderCanceledBadge: {
    backgroundColor: "#EAA9A9",
    color: "#FC1B1B",
  },
  OrderStatusText: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 40,
    textAlign: "center",
  },
  discountSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discountTextInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#CEF1F9",
    height: 48,
    flex: 1,
    borderRadius: 8,
    marginTop: 4,
    justifyContent: "space-between",
  },
  discountText: {
    margin: 8,
  },
  discountClearIcon: {
    marginRight: 8,
    fontSize: 24,
    color: "#17C6ED",
  },
  redeemButton: {
    backgroundColor: "#17C6ED",
    color: colors.white,
    margin: 8,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  verify: {
    fontSize: 11,
    color: "#17C6ED",
    textDecorationLine: "underline",
    marginLeft: 4,
    marginTop: 5,
  },
  deviceHeading: {
    flexDirection: "row",
  },
});
