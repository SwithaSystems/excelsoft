import colors from "@/constants/colors";
import { Platform, StatusBar, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const statusBarHeight = StatusBar.currentHeight;
// console.log("Status bar height:", statusBarHeight);

// Get device dimensions for responsive calculations
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Platform-specific status bar height calculation
const getStatusBarHeightSafe = () => {
  if (Platform.OS === "android") {
    return StatusBar.currentHeight || 24; // Fallback to 24 if undefined
  }
  return 0; // iOS safe area is handled by SafeAreaView
};

// Check if device has notch/dynamic island (rough estimation)
const hasNotch = () => {
  if (Platform.OS === "ios") {
    // iPhone X and later have height >= 812
    return screenHeight >= 812;
  }
  return false;
};

export const globalStyles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.select({
      android: 0,
      ios: 0,
      default: 0,
    }),
  },
  // Alternative container for screens not using SafeAreaView
  containerWithStatusBar: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: getStatusBarHeightSafe(),
  },
  safeAreaBottom: {
    paddingBottom: Platform.select({
      ios: hasNotch() ? 34 : 0, // Home indicator area
      android: 0,
      default: 0,
    }),
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
  savedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    height: Platform.select({
      ios: 48,
      android: 52, // Slightly taller for Android
      default: 48,
    }),
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: Platform.select({
      ios: 0,
      android: 8, // Android needs vertical padding
      default: 0,
    }),
    marginBottom: 16,
    backgroundColor: colors.lightgrey,
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
  px_4: {
    paddingHorizontal: 8,
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
    fontWeight: Platform.select({
      ios: "600",
      android: "bold",
      default: "500",
    }),
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: Platform.select({
      ios: "700",
      android: "bold",
      default: "600",
    }),
    marginBottom: 16,
  },
  sectionTitleStyle: {
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 10,
  },
  fontWeight500: {
    fontWeight: Platform.select({
      ios: "500",
      android: "normal",
      default: "500",
    }),
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
    // marginBottom: 16,
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
    // marginVertical: 24,
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
    backgroundColor: colors.primaryRed,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  orderPlacedBadge: {
    backgroundColor: colors.primary,
    color: colors.black,
  },
  orderCompletedBadge: {
    backgroundColor: colors.secondaryGreen,
    color: colors.primaryGreen,
  },
  orderPendingBadge: {
    backgroundColor: colors.secondaryYellow,
    color: colors.primaryYellow,
  },
  orderCanceledBadge: {
    backgroundColor: colors.secondaryRed,
    color: colors.error,
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
    backgroundColor: colors.secondary,
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
    color: colors.primary,
  },
  redeemButton: {
    backgroundColor: colors.primary,
    color: colors.white,
    margin: 8,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  verify: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: "underline",
    marginLeft: 4,
    marginTop: 5,
  },
  deviceHeading: {
    flexDirection: "row",
  },
  bottom_btn: {},
});
