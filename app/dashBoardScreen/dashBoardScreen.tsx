import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './dashBoardScreenStyles';

const dashBoardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>dashBoardScreen Component</Text>
    </View>
  );
};

export default dashBoardScreen;
