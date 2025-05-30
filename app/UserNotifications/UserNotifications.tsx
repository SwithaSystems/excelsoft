import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import styles from './UserNotificationsStyles';
import { globalStyles } from '@/assets/styles/globalStyles';
import { Ionicons } from "@expo/vector-icons";
import Header from '@/components/Header';


const UserNotifications = () => {
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={globalStyles.container}>
      <Header headerText="Notifications" />
      <ScrollView>
        <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
          </View>
        </ScrollView>
        </View>
      </SafeAreaView>
  );
};

export default UserNotifications;
