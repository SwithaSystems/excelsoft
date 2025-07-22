import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import colors from "../../config/colors";

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
    borderColor: colors.Gray88,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  focusedContainer: {
    borderColor: colors.linkBlue,
    backgroundColor: colors.linkBlueBg,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  focusedInput: {
    color: colors.linkBlue,
  },
});

export default InputBox;
