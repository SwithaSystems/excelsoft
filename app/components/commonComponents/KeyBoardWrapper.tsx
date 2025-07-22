import colors from "@/app/config/colors";
import { Ionicons } from "@expo/vector-icons";
import React, {useEffect, useState }  from "react";
import { 
    KeyboardAvoidingView, 
    Platform, 
    TouchableOpacity, 
    useColorScheme,
    StyleSheet,
    Keyboard 
} from 'react-native';

type props={
    children: React.ReactNode,
    // showHideButton?: boolean,
}

const KeyBoardWrapper = ({
    children, 
    // showHideButton = true,
}: props) => {
    // const deviceTheme = useColorScheme();
    // const iconColor = deviceTheme === "dark" ? colors.white : colors.black;
    // const [keyboardVisible, setKeyboardVisible] = useState(false);
    // const [keyboardHeight, setKeyboardHeight] = useState(0);

    // useEffect(()=>{
    //     const showKeyboard = Keyboard.addListener("keyboardDidShow", 
    //         (e) => {
    //             setKeyboardVisible(true);
    //             setKeyboardHeight(e.endCoordinates.height);
    //         });
    //     const hideKeyboard = Keyboard.addListener("keyboardDidHide", 
    //         (e) => {
    //             setKeyboardVisible(false)
    //             setKeyboardHeight(0);
    //         });

    //     return () => {
    //         showKeyboard.remove();
    //         hideKeyboard.remove();
    //     };
    // }, []);

    // const getBottomOffset = () => {
    //     if (Platform.OS === 'ios') {
    //         return keyboardHeight > 0 ? keyboardHeight - 60 : 0; 
    //     } else {
    //         return keyboardHeight > 0 ? keyboardHeight - 40 : 0;
    //     }
    // };

    return (
        <KeyboardAvoidingView
            style = {styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS==='ios' ? 0 : 20}
        >
            {children}
            {/* {showHideButton && keyboardVisible && (
                <TouchableOpacity
                    onPress={()=>Keyboard.dismiss()}
                    style={[styles.dismissButton, {bottom: getBottomOffset()}]}
                >
                    <Ionicons 
                        name="chevron-down-outline"
                        size={24}
                        color={iconColor}
                    />
                </TouchableOpacity>
            )} */}
        </KeyboardAvoidingView>
    );
};

export default KeyBoardWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }, 
    dismissButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 20, 
        padding: 8,
    },  
})