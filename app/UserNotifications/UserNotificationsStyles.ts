import colors from "../config/colors";
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: "#fff",
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
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
    paddingTop: 16,
  },
  subText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  notificationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
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
    color: "#000",
    flex: 1,
  },
});

export default styles;