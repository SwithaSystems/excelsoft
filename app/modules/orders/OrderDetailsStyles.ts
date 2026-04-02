import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite || colors.white,
  },
  mobileContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  mobileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  mobileItemsCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  mobileSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 12,
  },
  cartItemContainerStyle: {
    paddingHorizontal: 0,
  },
  barCodeNote: {
    fontWeight: 500,
    fontSize: 16,
    marginBottom: 10,
  },
  orderSummaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderSummaryItemText: {
    marginTop: 10,
    fontSize: 16,
  },
  orderSummaryItemWeb: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderSummaryItemTextWeb: {
    marginTop: 0,
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
    //marginTop: -216,
  },
  cancelButton: {
    backgroundColor: colors.error,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    //marginTop: 20,
  },
  deliverSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginTop: -250,
  },
  addressText: {
    fontSize: 15,
  },
  buttonContainer: {
    marginHorizontal: 16,
    gap: 16,
  },
  // Web-specific styles
  webContentWrapper: {
    marginTop: 8,
    maxWidth: 1180,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 8,
  },
  webHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  webPageTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.black,
    paddingTop: 8,
  },
  webTopSection: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 18,
  },
  webMiddleSection: {
    flexDirection: "row",
    marginTop: 0,
    marginBottom: 8,
    alignItems: "stretch",
    gap: 18,
  },

  webMiddleSectionMobile: {
    marginTop: 0,
    marginBottom: 12,
  },

  webBottomSection: {
    width: "100%",
    marginBottom: 16,
  },
  webCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  webQrCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  webStatusCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flex: 0.7,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  webOrderItemsCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flex: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginTop: 0,
  },
  webMobileOrderItemsCard: {
    marginTop: 0,
  },
  webTimelineCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 20,
    flex: 0.7,
    minWidth: 0,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  webMobileTimelineCard: {
    paddingTop: 8,     
    paddingBottom: 12,
  },

  webQrContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    marginRight: 16,
  },
  webQrContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  webQrTextWrapper: {
    flex: 1,
    minWidth: 0,
  },
  webQrTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
  },
  webQrHighlight: {
    color: colors.primary,
  },
  webQrDescription: {
    fontSize: 15,
    color: colors.secondaryText,
    marginBottom: 8,
    lineHeight: 22,
  },
  webQrInstruction: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  webDeliverToSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.lightgrey,
  },
  webTimelineTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  webTimelineSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 18,
    lineHeight: 22,
  },
  webTimelineContainer: {
    marginTop: 8,
    maxHeight: 400,
  },
  webMobileTimelineContainer: {
    marginTop: 0,
    maxHeight: undefined,
  },  
  webTimelineContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  webMobileStack: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
    alignItems: "stretch",
  },
  webMobileCard: {
    width: "100%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    marginHorizontal: 0,
    marginTop: 0,
    minWidth: 0,
    borderRadius: 20,
    padding: 16,
  },

    webMobileQrContent: {
      flexDirection: "column",
      alignItems: "center",
    },

    webMobileQrContainer: {
      marginRight: 0,
      marginBottom: 12,
    },

    webMobileTextCenter: {
      textAlign: "center",
    },
});

export default styles;
