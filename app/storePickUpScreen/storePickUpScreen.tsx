import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct picker import for cross-platform
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { globalStyles } from '@/assets/styles/globalStyles';
import Header from '@/components/Header';
import colors from '../config/colors';
import Button from '@/components/commonComponents/Button';
import { redirectToPage } from '@/utilities/redirectionHelper';
import containers from '@/containers';
import styles from './storePickUpScreenStyles';

const storePickupScreen = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState('am');

  // Handle date change
  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split('T')[0]); // Format date as yyyy-mm-dd
  };

  return (
    <View style={globalStyles.container}>
      <Header headerText="Store Pickup"/>
      <ScrollView>
    <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>

      <Text style={styles.label}>
        Do you like to store pick up? Let us know the date and time that suits you for Store pickup.
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
    </View>
      </ScrollView>
        <View style={globalStyles.p_3}>
          <Button onPress={()=>{redirectToPage(containers.orderSummeryScreenScreen)}} title='Confirm'/>
        </View>
    </View>
  );
};


export default storePickupScreen;
