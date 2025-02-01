import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

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
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  focusedContainer: {
    borderColor: "#007BFF",
    backgroundColor: "#EAF4FF",
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  focusedInput: {
    color: "#007BFF",
  },
});

export default InputBox;
