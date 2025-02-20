import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Platform, TouchableOpacity } from 'react-native';
import styles from './homeDeliveryScreenStyles';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';
import { globalStyles } from '@/assets/styles/globalStyles';
import { Picker } from '@react-native-picker/picker';
import Header from '@/components/Header';
import { redirectToPage } from '@/utilities/redirectionHelper';
import containers from '@/containers';
import Button from '@/components/commonComponents/Button';

const homeDeliveryScreen = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);
      const [hours, setHours] = useState('');
      const [minutes, setMinutes] = useState('');
      const [period, setPeriod] = useState('am');
      const [address, setAddress] = useState('');
      const [additionalDetails, setAdditionalDetails] = useState('');

      const onDateChange = (event : DateTimePickerEvent, selectedDate : Date | undefined) => {
        const currentDate = selectedDate || new Date(date);
        setShowDatePicker(false);
        setDate(currentDate.toISOString().split('T')[0]); // Format date as yyyy-mm-dd
      };
  return (
    <>
    <View style={globalStyles.container}>
      <Header headerText="Home Delivery"/>
      <ScrollView>
    <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>

      <Text style={styles.label}>
      Do you prefer home delivery? Let us know your available day and time. 
      </Text>

      {/* Date Picker */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Date: *</Text>
        {Platform.OS === 'web' ? (
          <input
            type="date"
            style={globalStyles.webDateInput}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        ) : (
          <TouchableOpacity
            style={globalStyles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{date}</Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(date)}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Time Input */}
      <Text style={styles.inputLabel}>Time: *</Text>
      <View style={globalStyles.timeContainer}>
        <TextInput
          style={globalStyles.timeInput}
          placeholder="HH"
          keyboardType="numeric"
          maxLength={2}
          value={hours}
          onChangeText={setHours}
        />
        <Text>:</Text>
        <TextInput
          style={globalStyles.timeInput}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
          value={minutes}
          onChangeText={setMinutes}
        />

        {/* AM/PM Dropdown */}
        <Picker
          selectedValue={period}
          style={globalStyles.picker_sm}
          onValueChange={(itemValue) => setPeriod(itemValue)}
        >
          <Picker.Item style={globalStyles.pickerValue_sm} label="AM" value="am" />
          <Picker.Item style={globalStyles.pickerValue_sm} label="PM" value="pm" />
        </Picker>
      </View>
      <View style={globalStyles.mb_3}>
      <Text style={styles.inputLabel}>Address: *</Text>
          <CustomTextInput multiline={true} textBoxHeight={150} containerStyle={{borderRadius: 10, width: '100%', height:"auto"}} onPress={()=>{}} setValue={setAddress} value={address} />
      </View>
      <View style={globalStyles.mb_3}>
      <Text style={styles.inputLabel}>Additional instructions for delivery partner:  </Text>
          <CustomTextInput containerStyle={{borderRadius: 10, width: '100%'}}  onPress={()=>{}} setValue={setAdditionalDetails} value={additionalDetails} placeholder='Enter your instructions....'/>
      </View>
    </View>
      </ScrollView>
        <View style={globalStyles.p_3}>
          <Button onPress={()=>{redirectToPage(containers.orderSummeryScreenScreen)}} title='Confirm'/>
        </View>
    </View>
    </>
  );
};

export default homeDeliveryScreen;
