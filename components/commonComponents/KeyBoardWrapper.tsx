import colors from "@/app/config/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { Children, useEffect, useState }  from "react";
import { KeyboardAvoidingView, Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { Keyboard } from "react-native";

type props={
    children: React.ReactNode,
    showHideButton?: boolean,
}

const KeyBoardWrapper = ({
    children, 
    showHideButton = true,
}: props) => {
    const deviceTheme = useColorScheme();
    const iconColor = deviceTheme === "dark" ? "colors.white" : "colors.black";
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(()=>{
        const showKeyboard = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const hideKeyboard = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

        return () => {
            showKeyboard.remove();
            hideKeyboard.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView
            style = {{flex:1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS==='ios' ? 0 : 20}
        >
            {children}
            {showHideButton && keyboardVisible && (
                <TouchableOpacity
                    onPress={()=>Keyboard.dismiss()}
                >
                    <Ionicons 
                        name="chevron-down-outline"
                        size={24}
                        color={iconColor}
                    />
                </TouchableOpacity>
            )}
        </KeyboardAvoidingView>
    );
};

export default KeyBoardWrapper;