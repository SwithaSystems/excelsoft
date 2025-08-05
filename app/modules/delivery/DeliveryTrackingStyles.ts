import { StyleSheet } from "react-native";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
  headingNote: {
    fontSize: 16,
    marginBottom: 32,
  },
  trackingContainer: {},
  adminInfoCard: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.black,
  },
  label: {
    fontWeight: "bold",
    color: colors.black,
  },
});

export default styles;
