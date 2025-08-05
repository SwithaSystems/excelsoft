import colors from "../../../constants/colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: colors.white,
    flexGrow: 1,
  },
  emptyNotifContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 118,
  },
  noNotificationText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
    marginBottom: 16,
    paddingTop: 16,
  },
  subText: {
    fontSize: 14,
    color: colors.black,
    textAlign: "center",
  },
  notificationBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 1,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationText: {
    fontSize: 14,
    color: colors.black,
    flex: 1,
  },
});

export default styles;
