import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './addNewPaymentScreenStyles';
import colors from '../config/colors';

const addNewPaymentScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={styles.container}>
      <Text style={styles.text}>addNewPaymentScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default addNewPaymentScreen;
