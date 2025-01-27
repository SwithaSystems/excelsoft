import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './paymentScreenStyles';

const paymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>paymentScreen Component</Text>
    </View>
  );
};

export default paymentScreen;
