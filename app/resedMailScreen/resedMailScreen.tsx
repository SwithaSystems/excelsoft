import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import styles from './resedMailScreenStyles';
import colors from '../config/colors';

const resedMailScreen = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Text style={styles.text}>resedMailScreen Component</Text>
    </View>
    </SafeAreaView>
  );
};

export default resedMailScreen;
