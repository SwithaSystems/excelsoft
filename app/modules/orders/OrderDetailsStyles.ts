import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 16,
    backgroundColor: colors.white,
    //marginBottom: 16,
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
    marginTop: -8,
  },
  webHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  webPageTitle: {
    fontSize: 35,
    color: colors.black,
  },
  webTopSection: {
    flexDirection: "row",
    marginBottom: 2,
  },
  webMiddleSection: {
  flexDirection: "row",
  marginTop: -12,
  marginBottom: 4,
  alignItems: "stretch",
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
    borderRadius: 8,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
  },
  webStatusCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 0.7,
    marginHorizontal: 8,
  },
  webOrderItemsCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
    minWidth: 0,
    marginHorizontal: 8,
    marginTop: -12,
  },
  webMobileOrderItemsCard: {
    marginTop: 0,
  },
  webTimelineCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    flex: 0.7,
    minWidth: 0,
    marginHorizontal: 8,
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
    fontWeight: "600",
    marginBottom: 4,
  },
  webQrHighlight: {
    color: colors.primary,
  },
  webQrDescription: {
    fontSize: 15,
    color: colors.black,
    marginBottom: 8,
  },
  webQrInstruction: {
    fontSize: 13,
    color: colors.secondaryText,
  },
  webDeliverToSection: {
    marginTop: 16,
  },
  webTimelineTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  webTimelineSubtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 16,
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
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  webMobileStack: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
    alignItems: "flex-start",
  },
    webMobileCard: {
      width: "100%",
      // flex: undefined,     
      flexGrow: 0,
  flexShrink: 0,
  flexBasis: "auto",
      marginHorizontal: 0,
      marginTop: 0,
      minWidth: 0,
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
