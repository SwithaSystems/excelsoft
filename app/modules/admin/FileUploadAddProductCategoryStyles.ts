import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: colors.white,
  },
  pageContainerWeb: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: "center",
  },
  card: {
    width: "100%",
  },
  cardWeb: {
    maxWidth: 720,
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardMobileWeb: {
    maxWidth: "100%",
    padding: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: colors.slateGrey,
  },
  infoBanner: {
    marginTop: 14,
    marginBottom: 16,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: "rgba(13, 123, 75, 0.18)",
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 4,
  },
  infoBannerText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.secondaryText,
  },
  section: {
    gap: 12,
    marginBottom: 12,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  modalSelector: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
    padding: 10,
  },
  modalInitValue: {
    color: colors.darkGray,
  },
  modalSelectedText: {
    fontSize: 16,
    color: colors.black,
  },
  modalOptionText: {
  fontSize: 16,
  color: colors.primary, 
},
  modalSelectedItemText: {
    fontWeight: "bold",
    color: colors.primary,
  },
  modalTriggerText: {
    fontSize: 16,
    paddingVertical: 10,
    color: colors.primary,
  },
  modalTrigger: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTriggerIcon: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.black,
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  picker: {
    height: 50,
  },
  helpContainer: {
    backgroundColor: colors.infoBg,
    padding: 12,
    marginBottom: 15,
  },
  helpText: {
    fontSize: 14,
    color: colors.infoText,
    textAlign: "center",
    lineHeight: 20,
  },
  fileInfoContainer: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  fileInfoText: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  buttonRowMobileWeb: {
    flexDirection: "column",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chooseButton: {
    backgroundColor: colors.primary,
    flex: 1,
    // marginRight: 10,
  },
  alternativeButton: {
    backgroundColor: colors.secondaryYellow,
    flex: 1,
    marginLeft: 10,
  },
  uploadButton: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: colors.placeholdergrey,
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: { marginTop: 25, alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#555" },
  resultContainer: {
    backgroundColor: "white",
    marginTop: 25,
    borderRadius: 10,
    overflow: "hidden",
  },
  resultHeader: { padding: 15 },
  successHeader: { backgroundColor: "#daf5d9" },
  errorHeader: { backgroundColor: "#ffdada" },
  resultTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  statisticsContainer: { padding: 15 },
  statisticsTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  statLine: { fontSize: 15, marginBottom: 6 },
});

export default styles;
