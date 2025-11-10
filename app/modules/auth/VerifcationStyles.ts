import { StyleSheet } from "react-native";
import colors from "../../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    //padding: 20,
    //justifyContent: "center",
    alignItems: "center",
  },
  verificationHeaderStyle: {
    marginTop: 20,
    paddingVertical: 10,
  },
  verificationHeaderTitle: {
    fontSize: 35,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainerDesktop: {
    justifyContent: 'center',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    marginTop: -100,
  },
  image: {
    width: "80%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  imageDesktop: {
    width: "60%",
    height: 250,
  },
  description: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.black,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  descriptionDesktop: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  codeContainerDesktop: {
    marginVertical: 30,
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
  inputBoxDesktop: {
    width: 60,
    height: 60,
    fontSize: 24,
    marginHorizontal: 8,
  },
  buttonContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainerDesktop: {
    paddingHorizontal: 40,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  verifyButtonDesktop: {
    paddingVertical: 14,
    borderRadius: 10,
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
  resendTextDesktop: {
    marginTop: 24,
    fontSize: 16,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default styles;
