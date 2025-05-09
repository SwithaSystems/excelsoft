import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './paymentScreenStyles';
import colors from '../config/colors';

const paymentScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={styles.container}>
      <Text style={styles.text}>paymentScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default paymentScreen;
