import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './splashScreenStyles';

const splashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>splashScreen Component</Text>
    </View>
  );
};

export default splashScreen;
