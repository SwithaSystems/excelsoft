import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './verifyUserScreenStyles';
import colors from '../config/colors';
import { globalStyles } from '@/assets/styles/globalStyles';

const verifyUserScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>verifyUserScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default verifyUserScreen;
