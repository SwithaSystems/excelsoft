import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './updateCardDetailsScreenStyles';
import colors from '../config/colors';
import { globalStyles } from '@/assets/styles/globalStyles';

const updateCardDetailsScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>updateCardDetailsScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default updateCardDetailsScreen;
