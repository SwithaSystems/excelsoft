import colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Keyboard,
} from "react-native";

type props = {
  children: React.ReactNode;
  // showHideButton?: boolean,
};

const KeyBoardWrapper = ({
  children,
}: 
props) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyBoardWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dismissButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 20,
    padding: 8,
  },
});
