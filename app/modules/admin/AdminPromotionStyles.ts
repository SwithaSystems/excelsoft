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
    marginBottom: 32,
    overflow: "visible",
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
  // Live Promotions
  horizontalList: {
    paddingRight: 16,
    gap: 16,
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
    zIndex: 1000,
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
    position: "absolute",
    top: Platform.OS === "web" ? 40 : 52,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 2000,
    maxHeight: 260,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: Platform.OS === "android" ? 10 : 0,
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
      },
      default: {
        width: "90%",
        maxHeight: "80%",
      },
    }),
    ...(Platform.OS === "web" ? { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } : {}),
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
});

export default styles;

