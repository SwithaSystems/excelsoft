import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
  },
  contentContainerWeb: {
    width: "70%",
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: colors.black,
  },
  addButtonContainer: {
    minWidth: 180,
  },
  rowItem: {
    marginBottom: 10,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 24,
  },
  mobileButtonContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  addressContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.black,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  addressList: {
    // paddingHorizontal: 16,
    //alignItems:"center",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
});

export default styles;
