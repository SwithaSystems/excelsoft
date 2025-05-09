import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './verifyUserScreenStyles';
import colors from '../config/colors';

const verifyUserScreen = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={styles.container}>
      <Text style={styles.text}>verifyUserScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default verifyUserScreen;
