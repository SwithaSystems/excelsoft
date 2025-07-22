import { StyleSheet } from "react-native";
import colors from "../../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    //padding: 20,
    //justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  description: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.black,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    width: 50,
    height: 50,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  resendText: {
    marginTop: 20,
    color: colors.black,
    textAlign: "center",
  },
  resendLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default styles;
