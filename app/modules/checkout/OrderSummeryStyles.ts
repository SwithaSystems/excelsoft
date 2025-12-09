import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  orderSummaryContainer: {
    // marginTop: 0,
    // paddingHorizontal: 0,
  },
  subheading: {
    fontWeight: "bold",
    //paddingRight: 12,
  },
  checkBoxContainer: {
    padding: 0,
    backgroundColor: colors.white,
    borderWidth: 0,
    margin: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: 12,
  },
  checkBoxText: {
    fontWeight: "normal",
    fontSize: 14,
    marginLeft: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 14,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  addressTextBox: {
    // height: 150,
    // borderWidth: 1,
    // borderColor: colors.black,
    //padding: 10,
    borderRadius: 10,
    textAlignVertical: "top",
  },
  billingAddress: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    // marginVertical: 8,
    marginRight: 12,
    width: "100%",
  },
  billingAddressAccordian: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  changeSlotText: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 12,
  },
  cartItemContainerStyle: {
    paddingHorizontal: 0,
  },
  addressContainer: {
    flexDirection: "column",
    paddingRight: 16,
  },
  addressList: {
    paddingHorizontal: 6,
    paddingTop: 0,
    flexGrow: 1,
  },
  deliverAddress: {
    flexDirection: "row",
  },
  checkBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    marginTop: 10,
    // marginBottom: 10,
  },
  setAddressText: {
    // fontSize: 16,
    // fontWeight: 'normal',
    marginRight: 10,
  },
  accordianIcon: {
    marginLeft: "auto",
  },
  accordian: {
    //marginLeft:'auto'
  },
  accordionContent: {
    marginTop: 10,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.placeholdergrey,
    minHeight: 200,
  },
  noAddressContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  noAddressText: {
    color: colors.placeholdergrey,
    fontSize: 16,
  },
  activeBtn: {
    backgroundColor: colors.primary,
  },
  disabledBtn: {
    backgroundColor: colors.lightgrey,
  },
  buttonText: {
    color: colors.white,
  },
  // Web-specific Styles
  webContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  webPageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 24,
    color: colors.black,
  },
  webContentWrapper: {
    flexDirection: "row",
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 40,
    paddingBottom: 40,
    gap: 40,
  },
  webLeftSection: {
    flex: 0.6,
    gap: 16,
  },
  webRightSection: {
    flex: 0.4,
    gap: 8,
  },
  webSectionCard: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 0,
  },
  webSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 12,
  },
  webAddressBox: {
    borderWidth: 1,
    borderColor: colors.lightgrey,
    borderRadius: 4,
    padding: 12,
  },
  webAddressText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
  },
  webSlotText: {
    fontSize: 14,
    color: colors.black,
    lineHeight: 20,
  },
  webChangeSlotLink: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: "underline",
    marginTop: 4,
  },
  webCheckboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  webCheckboxContainer: {
    padding: 0,
    margin: 0,
    marginRight: 8,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  webCheckboxLabel: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
  webSubText: {
    fontSize: 12,
    color: colors.black,
    marginTop: 8,
    lineHeight: 18,
  },
  webTableHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightgrey,
  },
  webTableRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  webTableCell: {
    fontSize: 14,
    color: colors.black,
  },
  webSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  webSummaryLabel: {
    fontSize: 14,
    color: colors.primary,
  },
  webSummaryValue: {
    fontSize: 14,
    color: colors.black,
  },
  webSubtotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.lightgrey,
    marginTop: 8,
    paddingTop: 12,
  },
  webSubtotalLabel: {
    fontSize: 14,
    color: colors.black,
  },
  webSubtotalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  webPlaceOrderButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 4,
    marginTop: 16,
  },

  webAccordionToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    // backgroundColor: colors.lightgrey,
    borderRadius: 8,
    marginTop: 12,
  },

  webAccordionContent: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    maxHeight: 400,
    overflow: "scroll",
  },

  webNoAddressContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  webNoAddressText: {
    fontSize: 14,
    color: colors.slateGrey,
    textAlign: "center",
  },
  compactOrderSummary: {
    padding: 12,
    marginTop: 0,
  },
  compactOrderSummaryHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.black,
  },
  noteText: {
    fontSize: 12,
    color: colors.errorText,
    fontStyle: "italic",
    marginTop: 8,
  },
});

export default styles;
