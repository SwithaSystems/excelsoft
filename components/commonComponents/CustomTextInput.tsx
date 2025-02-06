import colors from "@/app/config/colors";
import react, { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle, TouchableWithoutFeedback } from "react-native";

interface Props {
    placeholder?: string;
    value: string;
    setValue: (value: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: string;
    containerStyle?: ViewStyle;
    TextStyle?: TextStyle;
    onPress: () => void;
    iconName?: string;
    iconType?: string;
    iconSize?: number;
    iconColor?: string;
}

export const CustomTextInput = (props: Props) => {
    return (

        <View style={[styles.textInput, props?.containerStyle, {alignItems: props.iconName ? "center" : undefined, justifyContent: props.iconName ? "space-between" : undefined,}]}>
            <TextInput
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.setValue}
                secureTextEntry={props.secureTextEntry}
                style={[{
                    flex: 1,
                    padding: 10,
                }, props?.TextStyle]}
                cursorColor={colors.primary}
            />
            {props.iconName && (
                <TouchableWithoutFeedback onPress={props.onPress}>
                    {props.iconType === "Ionic" ? <Ionicons name={props.iconName} size={props.iconSize || 20} color={props.iconColor || colors.primary} /> 
                    : <MaterialIcons name={props.iconName} size={props.iconSize || 20} color={props.iconColor || colors.primary} />}
                </TouchableWithoutFeedback>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: colors.primary, 
        borderRadius: 4,
        height: 45,
        width: "100%"
    },
})