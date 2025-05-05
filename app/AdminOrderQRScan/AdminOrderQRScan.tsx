import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import styles from './AdminOrderQRScanStyles';
import Header from '@/components/Header';
import { Ionicons } from "@expo/vector-icons";
import colors from '../config/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';


const AdminOrderQRScan = () => {
  const [qrCode,setQrCode] = useState("");
  return (
    <View style={styles.container}>
      <Header headerText="Scan QR Code" />
      <ScrollView>
        <View>
          <View>
            <Text>Scan the consumer's QR Order</Text>
            <MaterialIcons
            name="flashlight-on"
            size={24}
            color={colors.primary}
            />
          </View>
          <MaterialIcons
            name="qr-code-scanner"
            size={108}
            color={colors.primary}
            />
        </View>
        <Text>OR</Text>
        <View>
          <Text>Enter QR Number</Text>
          <CustomTextInput 
            placeholder="Enter 5-Digit QR Code"
            value={qrCode}
            setValue={setQrCode} 
            onPress= {() => {}}          
            />
            <TouchableOpacity
                style={styles.verifyButton}
                onPress={()=>{}}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default AdminOrderQRScan;
