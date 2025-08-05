import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    // paddingTop: 32,
    flex: 1,
    backgroundColor: colors.white,
    // paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "400",
    // marginBottom: 35,
    color: colors.deepSkyBlue,
  },
  metricsContainer: {
    // paddingHorizontal: 8,
  },
  metricBox: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "stretch",
  },
  metricIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricTitle: {
    fontSize: 14,
    marginLeft: 16,
    color: colors.black,
    fontWeight: 600,
  },
  metricValue: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  salesRaiseSection: {
    flexDirection: "row",
  },
  metricChange: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 600,
    textAlign: "center",
  },
  ordersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  recentOrdersTitle: {
    fontSize: 20,
    fontWeight: 600,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: 600,
  },

  orderContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.black,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    fontSize: 16,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  customerName: {
    fontSize: 14,
    marginBottom: 8,
  },
  orderTime: {
    fontSize: 14,
    color: colors.slateGrey,
  },
  orderAmount: {
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  eachOrderItem: {
    borderColor: colors.placeholdergrey,
    borderRadius: 10,
    borderWidth: 2,
    marginBottom: 24,
    padding: 16,
  },
  idContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trackOrderText: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    alignSelf: "flex-start",
    marginTop: 4,
  },
  orderPlaced: {
    backgroundColor: colors.infoBg,
    color: colors.infoText,
  },
  cancelled: {
    backgroundColor: colors.errorBg,
    color: colors.errorText,
  },
  replaced: {
    backgroundColor: colors.secondaryYellow,
    color: colors.primaryRed,
  },
  returned: {
    backgroundColor: colors.secondaryPurple,
    color: colors.secondaryPurple,
  },
  defaultStatus: {
    backgroundColor: colors.placeholdergrey,
    color: colors.black,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 4,
    // marginBottom: 16,
  },
});

export default styles;
