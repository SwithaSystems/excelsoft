import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import colors from '../../app/config/colors';

const BackArrow = () => {
    const router = useRouter();

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={() => router.canGoBack() ? router.back() : router.replace({
                pathname: "/",
              })}
        >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width:24,
        height:24,
        backgroundColor:colors.secondary,
        borderRadius:12,
    alignItems:"center",
        
    },
});

export default BackArrow;
