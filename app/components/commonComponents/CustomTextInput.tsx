import colors from "@/constants/colors";
import react, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableWithoutFeedback,
} from "react-native";

interface Props {
  onChangeText?: (text: string) => void;
  placeholder?: string;
  value: string;
  label?: string;
  setValue?: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: string;
  containerStyle?: ViewStyle;
  TextStyle?: TextStyle;
  onPress: () => void;
  iconName?: string;
  iconType?: string;
  iconSize?: number;
  iconColor?: string;
  multiline?: boolean;
  textBoxHeight?: number;
  disabled?: boolean;
  required?: boolean;
  onblur?: () => void;
  style?: ViewStyle;
  maxLength?: number;
  editable?:boolean;
  placeholderTextColor?: string;
}

export const CustomTextInput = (props: Props) => {
  return (
    <View style={[styles.textInput, props?.containerStyle]}>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor || colors.slateGrey} 
        value={props.value}
        onChangeText={props.setValue}
        secureTextEntry={props.secureTextEntry}
        multiline={props.multiline}
        editable={!props.disabled}
        onBlur={props.onblur}
        maxLength={props.maxLength}
        keyboardType = {props.keyboardType as any}
        style={[
          {
            flex: 1,
            padding: 10,
            fontSize: 16,
          },
          props?.TextStyle,
        ]}
        cursorColor={colors.primary}
      />
      {props.iconName && (
        <TouchableWithoutFeedback onPress={props.onPress}>
          {props.iconType === "Ionic" ? (
            <Ionicons
              name={props.iconName as any}
              size={props.iconSize || 20}
              color={props.iconColor || colors.primary}
            />
          ) : (
            <MaterialIcons
              name={props.iconName as any}
              size={props.iconSize || 20}
              color={props.iconColor || colors.primary}
            />
          )}
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    height: 60,
    width: "100%",
  },
});
