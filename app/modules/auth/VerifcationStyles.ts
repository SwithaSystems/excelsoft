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
  verificationHeaderStyleMobileWeb: {
    marginTop: 6,
    paddingVertical: 6,
  },
  verificationHeaderTitle: {
    fontSize: 35,
    fontWeight: '700',
  },
  verificationHeaderTitleMobileWeb: {
    fontSize: 24,
    fontWeight: "600",
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
  contentContainerMobileWeb: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
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
    marginTop: 60,
  },
  imageMobileWeb: {
    width: "72%",
    height: 150,
    marginTop: 6,
    marginBottom: 12,
  },
  description: {
    textAlign: "center",
    marginVertical: 10,
    color: colors.black,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  descriptionDesktop: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  descriptionMobileWeb: {
    marginVertical: 6,
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  codeContainerDesktop: {
    marginTop: 15,
    marginBottom: 30,
  },
  codeContainerMobileWeb: {
    marginTop: 10,
    marginBottom: 14,
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
  inputBoxMobileWeb: {
    width: 42,
    height: 46,
    fontSize: 18,
    marginHorizontal: 3,
  },
  buttonContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainerDesktop: {
    paddingHorizontal: 40,
  },
  buttonContainerMobileWeb: {
    paddingHorizontal: 6,
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
  verifyButtonMobileWeb: {
    paddingVertical: 12,
    borderRadius: 8,
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
  resendTextMobileWeb: {
    marginTop: 14,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});

export default styles;
