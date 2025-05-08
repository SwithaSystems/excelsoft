import colors from '@/app/config/colors';
import containers from '@/containers';
import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { height } = Dimensions.get('window');

type MessageProps = {
    text1: string;
    text2?: string;
    onPress?: () => {};
};

const CustomToastAlert = (props: MessageProps) => {
    return (
        <TouchableOpacity style={styles.toastContainer} onPress={props.onPress}>
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.Text1}>{props.text1}</Text>   
                {props.text2 ? <Text style={styles.Text2}>{props.text2}</Text>: null}
            </View> 
        </View>
        </TouchableOpacity>
    );
};

export default CustomToastAlert;

const styles = StyleSheet.create({
    toastContainer:{
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 100,
        width: '100%',
        height: height,
        zIndex: 1,
    },
    container:{
        backgroundColor: colors.lightgrey,
        padding: 10,
        borderRadius: 50,
        width: '90%',
    },
    textContainer:{
        alignItems: 'center'
    },
    Text1:{
        fontSize: 14,
        fontWeight: "bold",
        color: colors.primary,
    },
    Text2:{
        fontSize: 14,
        fontWeight: '300',
        color: colors.primary,
        paddingTop: 4,
        textDecorationLine: 'underline',
    },
});
