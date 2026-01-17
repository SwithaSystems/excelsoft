import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
inputReadOnly: {
  backgroundColor: colors.lightgrey, // or any color to indicate read-only
},
editButton: {
  padding: 8,
},
editIcon: {
  fontSize: 18,
},
actionButtons: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
saveButton: {
  padding: 8,
  backgroundColor: colors.primary,
  borderRadius: 4,
},
saveIcon: {
  fontSize: 18,
  color: colors.white,
},
cancelButton: {
  padding: 8,
  backgroundColor: colors.lightgrey,
  borderRadius: 4,
},
cancelIcon: {
  fontSize: 18,
  color: colors.darkGray,
},
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    flex: 1,
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchLoader: {
    marginRight: 8,
  },
  switchDescription: {
    fontSize: 14,
    color: colors.reviewsColor,
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  input: {
  borderWidth: 1,
  // borderColor: colors.border,
  borderRadius: 6,
  paddingHorizontal: 10,
  paddingVertical: 6,
  minWidth: 100,
  textAlign: "right",
  // color: colors.primary,
},

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.reviewsColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
});

export default styles;
