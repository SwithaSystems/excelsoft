import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  screenShell: {
    flex: 1,
  },
  formScroll: {
    flex: 1,
  },
  formScrollContent: {
    paddingBottom: 24,
  },
  formPage: {
    paddingTop: 8,
    paddingBottom: 8,
    gap: 16,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F4FBF7",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D5ECDD",
    gap: 12,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  heroIconText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.slateGrey,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E4ECE7",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.primary,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 10,
  },
  container: {
    padding: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  text: {
    fontSize: 12,
    color: "black",
  },
  section: {
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 16,
  },
  cartItemContainerStyle: {
    paddingHorizontal: 0,
  },
  orderSummaryContainer: {
    marginTop: 0,
    paddingHorizontal: 0,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 16,
    color: colors.slateGrey,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#FCFEFC",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CFE2D7",
    padding: 15,
    fontSize: 16,
    marginBottom: 4,
  },
  mobileInput: {
    fontSize: 12,
    lineHeight: 17,
  },
  countriesdropdown: {
    backgroundColor: colors.lightgrey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    paddingBottom: 16,
  },
  bottomActionBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.lightgrey,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    alignContent: "center",
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FBF9",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E1ECE6",
  },
  preferenceTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.slateGrey,
  },
  checkBoxControl: {
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});

export default styles;
