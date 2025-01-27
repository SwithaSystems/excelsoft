import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './cartScreenStyles';

const cartScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>cartScreen Component</Text>
    </View>
  );
};

export default cartScreen;
