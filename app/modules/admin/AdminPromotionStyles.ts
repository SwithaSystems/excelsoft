import { StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 16,
  },
  imageUploadArea: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderColor: colors.placeholdergrey,
    borderStyle: "dashed",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    backgroundColor: colors.secondary,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "500",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
  },
  inputContainer: {
    marginBottom: 16,
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
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    backgroundColor: colors.placeholdergrey,
  },
  resetButtonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "600",
  },
  // Live Promotions
  horizontalList: {
    paddingRight: 16,
  },
  livePromotionCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promotionImage: {
    width: "100%",
    height: 160,
  },
  promotionActions: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  removeButton: {
    backgroundColor: colors.primaryRed,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  // Saved Promotions
  savedPromotionCard: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
  },
  savedPromotionImage: {
    width: 120,
    height: 120,
  },
  savedPromotionDetails: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  savedPromotionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  urlText: {
    fontSize: 14,
    color: colors.primary,
    flex: 1,
  },
  savedPromotionActions: {
    flexDirection: "row",
    gap: 8,
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
});

export default styles;

