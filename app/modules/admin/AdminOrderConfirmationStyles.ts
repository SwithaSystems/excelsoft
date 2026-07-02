import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  contentContainerWeb: {
    width: "70%",
    maxWidth: 980,
    alignSelf: "center",
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    width: "100%",
  },
  cardWeb: {
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  detailsBlock: {
    marginBottom: 20,
  },
  detailLine: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
    lineHeight: 24,
  },
  detailLabel: {
    fontWeight: "700",
    color: colors.black,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    overflow: "hidden",
    paddingVertical: 12,
    paddingLeft: 12,
    marginBottom: 16,
  },
  itemImageFrame: {
    width: 116,
    height: 116,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: "hidden",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  itemContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 10,
  },
  itemMeta: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 10,
  },
  itemPriceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
  },
  strikeText: {
    fontSize: 16,
    color: colors.slateGrey,
    textDecorationLine: "line-through",
    marginLeft: 10,
  },
  summaryBlock: {
    marginTop: 10,
    marginBottom: 28,
  },
  summaryLine: {
    fontSize: 16,
    color: colors.black,
    marginBottom: 8,
    lineHeight: 26,
  },
  summaryLabel: {
    fontWeight: "700",
    color: colors.black,
  },
  buttonSpacing: {
    marginTop: 8,
  },
});

export default styles;
