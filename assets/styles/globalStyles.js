import colors from "@/app/config/colors";
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  input: {
    height: 48,
    borderColor: "#EBEDED",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#F8F8F8",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionContent: {
    padding: 16,
    //backgroundColor: "#F8F8F8",
    flex: 1,
  },
  mb_3: {
    marginBottom: 16,
  },
});
