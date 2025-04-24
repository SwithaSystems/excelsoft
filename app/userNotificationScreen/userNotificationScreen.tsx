import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import colors from '../config/colors';
import { globalStyles } from '@/assets/styles/globalStyles';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';
import { redirectToPage } from '@/utilities/redirectionHelper';
import { color } from 'react-native-elements/dist/helpers';
import styles from './userNotificationScreenStyles';
import Footer from '@/components/Footer';

const userNotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Header headerText="Notifications" />
      <ScrollView>
        <TouchableOpacity
          style={styles.clearButton}
        >
          <Text style={styles.buttonText}>Clear All</Text>
        </TouchableOpacity>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.notification}>
          <Text style={styles.notificationText}>Price drop for the items in your cart! Check them out now!</Text>
          <TouchableOpacity
            onPress={
              ()=>{}
            }
          >
            <Ionicons
              name="close-outline"
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>      
      </ScrollView>
      <Footer />
    </View>
  );
};

export default userNotificationScreen;
