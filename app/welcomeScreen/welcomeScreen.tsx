import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './welcomeScreenStyles';
import colors from '../config/colors';

const welcomeScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>welcomeScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default welcomeScreen;
