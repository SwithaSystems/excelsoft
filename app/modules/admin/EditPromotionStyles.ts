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
  webFormContainer: {
    width: "75%",
    alignSelf: "center",
    flex: 1,
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
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderStyle: "dashed",
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.placeholdergrey,
    fontWeight: "500",
  },
  imageClickableContainer: {
    width: "100%",
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
    ...(Platform.OS === "web" && {
      justifyContent: "center",
      alignItems: "center",
    }),
  },
  saveButton: {
    flex: Platform.OS === "web" ? 0 : 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  webButton: {
    width: Platform.OS === "web" ? "30%" : undefined,
    flex: Platform.OS === "web" ? 0 : 1,
    paddingVertical: Platform.OS === "web" ? 8 : 14,
    paddingHorizontal: Platform.OS === "web" ? 24 : undefined,
    minWidth: Platform.OS === "web" ? 120 : undefined,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "600",
  },
  deleteButton: {
    flex: Platform.OS === "web" ? 0 : 1,
    backgroundColor: colors.placeholdergrey,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: colors.black,
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "600",
  },
  goLiveButton: {
    flex: Platform.OS === "web" ? 0 : 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  goLiveButtonText: {
    color: colors.white,
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "600",
  },
  // Date Range Selection
  dateRangeContainer: {
    flexDirection: "row",
    gap: Platform.select({ web: 16, default: 12 }),
    marginBottom: 16,
    alignItems: Platform.select({ web: "flex-end", default: "flex-start" }),
    flexWrap: "nowrap",
  },
  dateInputWrapper: {
    flex: Platform.select({ web: 0, default: 1 }),
    minWidth: Platform.select({ web: 200, default: 0 }),
    ...(Platform.OS === "web" ? { maxWidth: 250 } : { maxWidth: "100%" }),
  },
  dateToLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    alignSelf: Platform.select({ web: "flex-end", default: "center" }),
    marginBottom: Platform.select({ web: 8, default: 0 }),
    paddingHorizontal: Platform.select({ web: 8, default: 4 }),
    lineHeight: Platform.select({ web: 48, default: 20 }),
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
  // Attach Products Section
  attachProductsSection: {
    marginBottom: 32,
  },
  attachProductsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    ...(Platform.OS === "web" ? {} : { flexDirection: "column", gap: 12 }),
  },
  attachProductsTitleContainer: {
    flex: 1,
  },
  attachProductsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  attachProductsSubtitle: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.secondaryText,
  },
  selectProductsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...(Platform.OS === "web" ? {} : { alignSelf: "flex-start" }),
  },
  selectProductsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  attachedProductsList: {
    gap: 12,
  },
  attachedProductCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  attachedProductImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
  },
  attachedProductInfo: {
    flex: 1,
  },
  attachedProductName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 4,
  },
  attachedProductSku: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  removeProductButton: {
    padding: 4,
  },
  // Product Display Mode Selection
  productDisplayModeSection: {
    marginBottom: 24,
  },
  productDisplayModeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 16,
  },
  radioButtonContainer: {
    gap: 16,
  },
  radioButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioButtonLabel: {
    fontSize: 16,
    color: colors.black,
  },
  // Category Selection Section
  categorySelectionSection: {
    marginBottom: 24,
  },
  categorySelectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  categoryContainer: {
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 8,
    height: Platform.OS === "web" ? 40 : 52,
    width: Platform.OS === "web" ? undefined : "100%",
    minWidth: Platform.OS === "web" ? 200 : undefined,
    maxWidth: "100%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    position: "relative",
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 16,
    minHeight: 24,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: colors.black,
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 260,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownScrollArea: {
    maxHeight: 260,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.placeholdergrey,
    backgroundColor: colors.white,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.primary,
  },
  modalDropdown: {
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 20,
    maxHeight: "60%",
    padding: 8,
  },
  // Product Selection Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    ...Platform.select({
      web: {
        width: 600,
        maxHeight: "80%",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      },
      default: {
        width: "90%",
        maxHeight: "80%",
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.placeholdergrey,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSearchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.placeholdergrey,
  },
  modalLoadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  modalList: {
    ...Platform.select({
      web: {
        maxHeight: "60%",
      },
      default: {
        maxHeight: 400,
      },
    }),
  },
  productModalItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
    gap: 12,
  },
  productModalItemSelected: {
    backgroundColor: colors.secondary,
  },
  productModalImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.lightgrey,
  },
  productModalInfo: {
    flex: 1,
  },
  productModalName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
    marginBottom: 4,
  },
  productModalSku: {
    fontSize: 14,
    color: colors.secondaryText,
  },
  modalFooter: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.placeholdergrey,
  },
  modalDoneButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalDoneButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  // On Live Checkbox
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.black,
  },
});

export default styles;

