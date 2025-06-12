import { StyleSheet } from "react-native";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#555",
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#00BFFF",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendText: {
    marginTop: 20,
    color: "#555",
    textAlign:"center",
  },
  resendLink: {
    color: "#00BFFF",
    fontWeight: "bold",
  },
});

export default styles;
