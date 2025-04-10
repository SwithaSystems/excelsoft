import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../app/config/colors';

interface StarProps {
    filled?: boolean;
    size?: number;
    color?: string;
}

const Star = ({ filled = true, size = 16 }: StarProps) => {
    return (
        <Ionicons 
            name={filled ? "star" : "star-outline"} 
            size={size} 
            color={filled ? colors.starColor : colors.black}
        />
    );
};

export default Star;
