import { StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    // padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderStyle: "dashed",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.placeholdergrey,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "600",
  },
  // Date Range Selection
  dateRangeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateInputWrapper: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  dateInputText: {
    fontSize: 16,
    color: colors.black,
    flex: 1,
  },
  webDateInput: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.white,
  },
});

export default styles;

