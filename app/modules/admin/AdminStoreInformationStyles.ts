import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.slateGrey,
    marginBottom: 16,
  },
  timeSection: {
    marginBottom: 12,
  },
  timeContainer: {
    marginTop: 6,
  },
  pickerSm: {
    color: colors.black,
    height: 36,
    width: 84,
    backgroundColor: "transparent",
    borderWidth: 0,
    borderColor: "transparent",
    fontSize: 15,
    // Keep Picker visible on web; on mobile we overlay it (see pickerSmMobile).
  },
  pickerSmMobile: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  pickerItem: {
    color: colors.black,
    fontSize: 15,
  },
  pickerWrap: {
    height: 36,
    minWidth: 110,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "rgba(13, 123, 75, 0.18)",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginLeft: 8,
    position: "relative",
  },
  pickerChevron: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -9,
  },
  pickerDisplayText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.black,
    paddingLeft: 6,
    paddingRight: 22,
  },
  saveRow: {
    marginTop: 10,
  },
});

export default styles;
