import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './userReviewScreenStyles';
import colors from '../config/colors';

const userReviewScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={styles.container}>
      <Text style={styles.text}>userReviewScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default userReviewScreen;
