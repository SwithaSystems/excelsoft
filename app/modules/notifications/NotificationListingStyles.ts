import { StyleSheet } from "react-native";
import colors from "../../config/colors";
import { color } from "react-native-elements/dist/helpers";

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  notificationContainer: {},
});

export default styles;
