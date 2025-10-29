import { Platform, StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
  },

  categoryDropdown: {
    borderWidth: 1,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    minHeight: 52,
  },

  separator: {
    height: 1,
    backgroundColor: colors.secondary,
    marginTop: 8,
    marginBottom: 20,
  },

  buttonContainer: {
    height: 48,
    width: Platform.OS === "web" ? "15%" : "100%",
    marginTop: 8,
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 4,
  },

  // === Category Row + Container ===
  categoryActionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginHorizontal: 0,
    marginBottom: 16,
  },

  categoryContainer: {
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 8,
    height: Platform.OS === "web" ? 40 : 52,
    width: Platform.OS === "web" ? "18%" : "100%",
    minWidth: 220,
    maxWidth: "100%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  // === Add Button ===
  addButton: {
    height: Platform.OS === "web" ? 40 : 48,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: Platform.OS === "web" ? 140 : 120,
  },

  addButtonMobile: {
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
    minWidth: "auto",
  },

  addButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // === Sticky Containers (Top & Bottom) ===
  stickyTopContainer: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: colors.white,
    paddingVertical: 6,
    marginBottom: -20,
  },

  stickyBottomContainer: {
    position: Platform.OS === "web" ? "sticky" : "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    height: 45,
    paddingVertical: 0,
    marginBottom: 0,
    borderTopWidth: 0,
    borderColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },

  // === Category Dropdown Styles ===
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

  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },

  categoryImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  categoryDetails: {
    color: colors.secondaryText,
    fontSize: 12,
    marginTop: 2,
  },

  categoryDropdownText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "400",
  },

  // === Image & Details ===
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },

  details: {
    paddingLeft: 16,
    paddingRight: 16,
  },

  text: {
    fontSize: 16,
    marginBottom: 4,
  },

  bold: {
    fontWeight: 500,
  },
});

export default styles;
