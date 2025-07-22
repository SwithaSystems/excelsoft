import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { StyleSheet } from "react-native"; // Replace with your style file
import colors from "@/app/config/colors";
import { globalStyles } from "@/assets/styles/globalStyles";

const ReturnReplaceToggle = ({ mode, setMode }: any) => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
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
    </SafeAreaView>
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
    borderColor: colors.darkCharcoal,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInnerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.darkCharcoal,
  },
  radioLabel: {
    fontSize: 16,
  },
});
