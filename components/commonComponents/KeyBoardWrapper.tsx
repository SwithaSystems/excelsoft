import React, { Children }  from "react";
import { KeyboardAvoidingView, Platform } from 'react-native';

const KeyBoardWrapper = ({children}: {children: any}) => {
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