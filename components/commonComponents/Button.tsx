import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import colors from "../../app/config/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  primary?: boolean;
  disabled?: boolean;
}

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  primary = true,
  disabled = false,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        primary ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          primary ? styles.primaryText : styles.secondaryText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.lightgrey, // 🧊 visually shows disabled
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primary,
  },
});

export default Button;
