import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from 'react-native';
import styles from './verifyUserScreenStyles';
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";
import colors from '../config/colors';
import { globalStyles } from '@/assets/styles/globalStyles';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';
import { redirectToPage } from '@/utilities/redirectionHelper';
import { color } from 'react-native-elements/dist/helpers';

const verifyUserScreen = () => {
const [qrNumber, setQrNumber] = useState("");

  return (
    <View style={styles.container}>
      <Header headerText="Scan QR Code" />
      <ScrollView>
        <View style={styles.heading}>
          <Text style={styles.headingText}>
            Scan the Consumer's QR Order.
          </Text>
          <TouchableOpacity 
            onPress={() => {}}
          >
            <Ionicons
              name='flashlight-outline'
              size={24}
              color={colors.black}
            />
          </TouchableOpacity>

        </View>
        <TouchableOpacity
         style={styles.scanner}
         onPress={() => {}}
        >
          <Ionicons
            name='scan-outline'
            size={150}
            color={colors.black}
          />
        </TouchableOpacity>
        <Text style={styles.orText}>
          Or
        </Text>
        <View style={{ flex: 1 }}>
              <Text style={globalStyles.userInputLabel}>Enter QR Number</Text>
              <CustomTextInput
                containerStyle={globalStyles.userInputContainer}
                TextStyle={globalStyles.input}
                placeholder="Enter 5 digit number under the QR scan"
                value={qrNumber}
                onPress={() => {}}
                setValue={setQrNumber}
              />
        </View>
        <Button
            onPress={() => {
              redirectToPage();
            }}
            color={colors.primary}
            title="Verify"
        />
      </ScrollView>
    </View>
  );
};

export default verifyUserScreen;
