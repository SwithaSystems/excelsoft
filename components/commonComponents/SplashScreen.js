import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../app/config/colors";
import Logo from "./Logo";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo logoStyle={styles.logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  logoContainer: {
    // width: 100,
    // height: 100,
    // borderRadius: 50,
    // justifyContent: "center",
    //alignItems: "center",
  },
  logo: {
    height: 192,
    width: 192,
    borderRadius: "50%",
  },
});

export default SplashScreen;
