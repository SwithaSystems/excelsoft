import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
  webContent: {
    width: "100%",
    maxWidth: 980,
    alignSelf: "center",
  },
  webContentMobile: {
    maxWidth: "100%",
    alignSelf: "stretch",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  // For input-type settings: put control on next line
  switchContainerInput: {
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: 10,
  },
  switchContainerMobileWeb: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
  inputContainerBelowLabel: {
    alignSelf: "stretch",
    width: "100%",
  },
  inputContainerBelowLabelDesktopWeb: {
    alignSelf: "flex-end",
    maxWidth: 420,
  },
  inputContainerMobileWeb: {
    width: "100%",
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
inputReadOnly: {
  backgroundColor: colors.lightgrey, // or any color to indicate read-only
},
editButton: {
  padding: 8,
},
editText: {
  fontSize: 14,
  fontWeight: "600",
  color: colors.primary,
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
  switchLabelInput: {
    flex: 0,
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchWrapperMobileWeb: {
    alignSelf: "flex-end",
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
  height: 48,
  flex: 1,
  minWidth: 0,
  borderWidth: 1,
  borderColor: colors.primary,
  borderRadius: 8,
  paddingHorizontal: 10,
  backgroundColor: colors.white,
},
  inputMobileWeb: {
    // kept for backward compatibility
    maxWidth: "100%",
  },
  inputText: {
    textAlign: "right",
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
