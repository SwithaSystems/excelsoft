import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native"; // Replace with your style file

const ReturnReplaceToggle = ({ mode, setMode }: any) => {
  return (
    <View style={{ flexDirection: "row", marginVertical: 10 }}>
      {["return", "replace"].map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => setMode(option)}
          style={[
            styles.radioOption,
            mode === option && styles.radioOptionSelected,
          ]}
        >
          <View style={styles.radioCircle}>
            {mode === option && <View style={styles.radioInnerCircle} />}
          </View>
          <Text style={styles.radioLabel}>
            {option === "return" ? "Return" : "Replace"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ReturnReplaceToggle;
const styles = StyleSheet.create({
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioOptionSelected: {
    opacity: 1,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  radioLabel: {
    fontSize: 16,
  },
});
