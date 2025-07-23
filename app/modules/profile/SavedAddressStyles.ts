import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
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
