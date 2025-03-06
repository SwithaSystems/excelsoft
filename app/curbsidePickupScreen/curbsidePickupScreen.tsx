import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import styles from './curbsidePickupScreenStyles';
import { redirectToPage } from '@/utilities/redirectionHelper';
import containers from '@/containers';
import Button from '@/components/commonComponents/Button';
import { globalStyles } from '@/assets/styles/globalStyles';
import Header from '@/components/Header';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';
import OrderCollectionDetails from '@/components/OrderCollectionDetails';


const curbsidePickupScreen = () => {
  const vehicleTypeOptions = [
    { label:"type 1", value: "type1" },{ label:"type 2", value: "type2" },
  ]
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default date as ISO for web support
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [period, setPeriod] = useState('am');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    
    const onDateChange = (event : DateTimePickerEvent, selectedDate : Date | undefined) => {
      const currentDate = selectedDate || new Date(date);
      setShowDatePicker(false);
      setDate(currentDate.toISOString().split('T')[0]); // Format date as yyyy-mm-dd
    };

  return (
    <>
    <View style={globalStyles.container}>
      <Header headerText="Curbside Pickup"/>
      <ScrollView>
    <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>

      <Text style={styles.label}>
      Do you like curb side pick up? Let us know the date and time that suits you for Curbside pickup.
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
      <Text style={styles.inputLabel}>Vehicle Type: *</Text>
      <Picker
          selectedValue={vehicleType}
          style={globalStyles.picker_50}
          onValueChange={(itemValue) => setVehicleType(itemValue)}
        >
          {vehicleTypeOptions.map((each, index)=>{
            return <>
            <Picker.Item style={globalStyles.pickerValue_50} label={each.label} value={each.value} />
            </>
          })}
        </Picker>
      </View>
      <View style={globalStyles.mb_3}>
      <Text style={styles.inputLabel}>Vehicle Number: *</Text>
          <CustomTextInput containerStyle={globalStyles.pickUpInput} onPress={()=>{}} setValue={setVehicleNumber} value={vehicleNumber} />
      </View>
      <View style={globalStyles.mb_3}>
      <Text style={styles.inputLabel}>Additional Details</Text>
          <CustomTextInput containerStyle={globalStyles.pickUpInput} onPress={()=>{}} setValue={setAdditionalDetails} value={additionalDetails} />
      </View>
      <OrderCollectionDetails />
    </View>
      </ScrollView>
        <View style={globalStyles.p_3}>
          <Button onPress={()=>{redirectToPage(containers.orderSummeryScreenScreen)}} title='Confirm'/>
        </View>
    </View>
    </>
  );
};

export default curbsidePickupScreen;
