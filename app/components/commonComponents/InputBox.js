import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import colors from "@/constants/colors";

const InputBox = ({ placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      <TextInput
        style={[styles.input, isFocused && styles.focusedInput]}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.placeholdergrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  focusedContainer: {
    borderColor: colors.secondary,
    backgroundColor: colors.infoBg,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  focusedInput: {
    color: colors.secondary,
  },
});

export default InputBox;
