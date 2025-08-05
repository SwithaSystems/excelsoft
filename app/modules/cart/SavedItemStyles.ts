import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.offWhite,
  },
  text: {
    fontSize: 16,
    color: colors.white,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImage: {
    height: 383,
    width: 383,
  },
  emptyCartContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  cartIcon: {
    // marginBottom: 24,
    opacity: 0.6,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
    color: colors.black,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  hereText: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontWeight: "500",
    top: 3.5,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopColor: colors.placeholdergrey,
    borderTopWidth: 1,
  },
});

export default styles;
