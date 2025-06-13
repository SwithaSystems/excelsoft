import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import HomePage from "./home/home";
import colors from "../config/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  display: {
    flex: 2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
    backgroundColor: colors.white,
  },
  displayText: {
    fontSize: 48,
    color: colors.darkCharcoal,
  },
  buttons: {
    flex: 3,
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    margin: 5,
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  operatorButton: {
    backgroundColor: colors.sparkleBlue,
  },
  equalsButton: {
    backgroundColor: colors.seaGreen,
  },
  buttonText: {
    fontSize: 24,
    color: colors.darkCharcoal,
  },
});

export default HomePage;
