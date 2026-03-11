import { StyleSheet, Platform } from "react-native";
import colors from "../../../constants/colors";

const cardShadow = Platform.select({
  ios: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
  web: {
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  containerWeb: {
    maxWidth: 720,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  containerMobileWeb: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  heroSection: {
    marginBottom: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.slateGrey,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slateGrey,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardsRow: {
    flexDirection: "column",
    gap: 16,
  },
  cardsRowWeb: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.lightgrey,
    minHeight: 140,
    ...cardShadow,
  },
  cardWeb: {
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
  },
  cardTouchable: {
    flex: 1,
    borderRadius: 12,
  },
  cardInner: {
    flex: 1,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconWrapperCall: {
    backgroundColor: colors.secondary,
  },
  iconWrapperEmail: {
    backgroundColor: colors.infoBg,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 6,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.slateGrey,
    lineHeight: 20,
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 4,
  },
  availabilityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.lightgrey,
  },
  availabilityText: {
    fontSize: 13,
    color: colors.secondaryText,
    marginLeft: 6,
  },
  contentWidthWeb: {
    width: "70%",
    alignSelf: "center",
  },
  contentWidthMobileWeb: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
  },
});

export default styles;
