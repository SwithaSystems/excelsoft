import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useLocalSearchParams } from "expo-router";
import styles from './adminUserOrderDisplayStyles';

const adminUserOrderDisplay = () => {
  return (
    <View style={styles.container}>
      <Header headerText="Cancel Order" />
      <View style={styles.searchSection}>
        <TextInput style={styles.searchbar} 
           placeholder="search orders..."
        />
        <Ionicons name="search"
          size = {24}
          color={colors.primary}
        />
      </View>
      <View style={styles.subCategory}>
        
      </View>
    </View>
  );
};

export default adminUserOrderDisplay;
