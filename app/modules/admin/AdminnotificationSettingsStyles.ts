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
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  switchLabel: {
    fontSize: 15,
    color: colors.black,
    flex: 1,
    paddingRight: 12,
  },
});

export default styles;
