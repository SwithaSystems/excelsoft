import colors from "@/constants/colors";
import { StyleSheet } from "react-native";

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
    // marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.black,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  switchDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    alignItems: "flex-start",
    paddingHorizontal: 16,
  },
});

export default styles;
