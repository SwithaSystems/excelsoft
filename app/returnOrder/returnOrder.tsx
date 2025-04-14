import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './returnOrderStyles';

const returnOrder = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>returnOrder Component</Text>
    </View>
  );
};

export default returnOrder;
