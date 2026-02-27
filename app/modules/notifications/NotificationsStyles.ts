import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.lightgrey,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  backText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  eachNotificationSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  switchLabel: {
    fontSize: 15,
    color: "#555",
  },
});

export default styles;
