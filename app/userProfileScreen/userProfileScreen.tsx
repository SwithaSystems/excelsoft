import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './userProfileScreenStyles';

const userProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>userProfileScreen Component</Text>
    </View>
  );
};

export default userProfileScreen;
