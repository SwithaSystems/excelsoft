import React, { Children, ReactNode }  from "react";
import { KeyboardAvoidingView, Platform } from 'react-native';

interface props{
    children: ReactNode;
}

const KeyBoardWrapper = ({children}: props) => {
    return (
        <KeyboardAvoidingView
            style = {{flex:1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS==='ios' ? 0 : 20}
        >
            {children}
        </KeyboardAvoidingView>
    );
};

export default KeyBoardWrapper;