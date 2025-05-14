import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './paymentSaveCardScreenStyles';
import colors from '../config/colors';

const paymentSaveCardScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>paymentSaveCardScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default paymentSaveCardScreen;
