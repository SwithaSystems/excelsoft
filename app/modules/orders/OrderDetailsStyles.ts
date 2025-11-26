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
  webTopSection: {
    flexDirection: "row",
    marginBottom: 8,
  },
  webMiddleSection: {
    flexDirection: "row",
    marginBottom: 16,
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
    padding: 16,
    flex: 0.7,
    marginHorizontal: 8,
  },
  webOrderItemsCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    flex: 1.3,
    marginHorizontal: 8,
  },
  webTimelineCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    flex: 0.7,
    marginHorizontal: 8,
  },
  webQrContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  webQrNumber: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  webQrNote: {
    fontSize: 14,
    color: colors.error,
    textAlign: "center",
    marginTop: 8,
    fontWeight: 500,
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
    maxHeight: 350,
  },
  webTimelineContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
});

export default styles;
