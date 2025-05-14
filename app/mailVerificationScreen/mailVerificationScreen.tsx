import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './mailVerificationScreenStyles';
import colors from '../config/colors';

const mailVerificationScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>mailVerificationScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default mailVerificationScreen;
