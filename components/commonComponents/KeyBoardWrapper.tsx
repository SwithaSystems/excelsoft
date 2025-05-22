import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

interface Props {
  children: ReactNode;
  avoidKeyboard?: boolean;
}

const KeyBoardWrapper = ({ children, avoidKeyboard = false }: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100} 
        >
          {children}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.keyboardView}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export default KeyBoardWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
});