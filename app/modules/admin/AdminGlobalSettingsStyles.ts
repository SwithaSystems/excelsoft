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
