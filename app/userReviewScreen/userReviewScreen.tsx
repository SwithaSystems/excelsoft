import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './userReviewScreenStyles';
import colors from '../config/colors';
import { globalStyles } from '@/assets/styles/globalStyles';

const userReviewScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>userReviewScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default userReviewScreen;
