import React, { Children, ReactNode }  from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet } from 'react-native';

interface props{
    children: ReactNode;
}

const KeyBoardWrapper = ({children}: props) => {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
            style = {{flex:1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS==='ios' ? 0 : 20}
        >
            {children}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );

};

export default KeyBoardWrapper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});