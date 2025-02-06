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
    flex: 1,
  },
  mb_3: {
    marginBottom: 16,
  },
  mt_4: {
    marginTop: 24,
  },
  mb_4: {
    marginBottom: 24,
  },
  pt_0: {
    paddingTop: 0,
  },
  pb_0: {
    paddingBottom: 0,
  },
  px_3: {
    paddingHorizontal: 16,
  },
  pl_3: {
    paddingLeft: 16,
  },
  mb_0: {
    marginBottom: 0,
  },
  mb_2: {
    marginBottom: 8,
  },
  h6: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 20,
    marginBottom: 16,
  },
  fontWeight500: {
    fontWeight: 500,
  },
  btnSmUnderLine: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
