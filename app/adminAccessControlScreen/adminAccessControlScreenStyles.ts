import { StyleSheet, Platform } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: "black",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 25,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: Platform.OS === "ios" ? 1 : 0,
    borderColor: colors.lightgrey,
    minHeight: Platform.OS === "ios" ? 50 : 44,
  },

  searchIcon: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  checkboxCell: {
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 16,
    borderWidth: 1,
    aspectRatio: 1,
    borderColor: "black",
  },
  nameCell: {
    flexBasis: "30%",
    fontSize: 14,
  },

  phoneCell: {
    flexBasis: "30%",
    fontSize: 14,
  },

  emailCell: {
    flexBasis: "30%",
    fontSize: 14,
  },
  seeMoreButton: {
    padding: 10,
    backgroundColor: "#00bcd4",
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 10,
  },
  seeMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkGray,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  pageInfo: {
    fontSize: 12,
    fontWeight: "400",
    color: "#666",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "white",
  },
  userInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  adminBadge: {
    backgroundColor: colors.primary || "#007bff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  phoneText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  emailText: {
    fontSize: 14,
    color: "#666",
  },
  accessToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  accessToggleActive: {
    backgroundColor: colors.primary || "#007bff",
    borderColor: colors.primary || "#007bff",
  },
  paginationContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paginationInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 14,
    color: "#666",
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageNumberButton: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 8,
  },
  pageNumberButtonActive: {
    backgroundColor: colors.primary || "#007bff",
    borderColor: colors.primary || "#007bff",
  },
  pageNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  pageNumberTextActive: {
    color: "white",
  },
  ellipsis: {
    fontSize: 16,
    color: "#666",
    paddingHorizontal: 4,
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  showMoreText: {
    fontSize: 16,
    color: colors.primary || "#007bff",
    fontWeight: "600",
    marginRight: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.Gray88 || "#666",
    textAlign: "center",
    marginTop: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
});

export default styles;
