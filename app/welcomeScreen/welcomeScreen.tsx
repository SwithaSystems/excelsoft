import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './welcomeScreenStyles';

const welcomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>welcomeScreen Component</Text>
    </View>
  );
};

export default welcomeScreen;
