import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, SafeAreaView } from "react-native";
import styles from "./AdminStoreInformationStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/commonComponents/Button";
import colors from "../config/colors";

const AdminStoreInformation = () => {
  const [storeName, setStoreName] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  return (
    <>
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={globalStyles.container}>
        <Header headerText="Store Details" />
        <ScrollView>
          <View style={[globalStyles.sectionContent, globalStyles.pt_0]}>
            <View style={globalStyles.profileInputContainer}>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.userInputLabel}>Store Name</Text>
                <CustomTextInput
                  containerStyle={globalStyles.userInputContainer}
                  TextStyle={globalStyles.input}
                  placeholder="Store Name"
                  value={storeName}
                  onPress={() => {}}
                  setValue={setStoreName}
                />
              </View>
            </View>
            <View style={globalStyles.profileInputContainer}>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.userInputLabel}>Contact Details</Text>
                <CustomTextInput
                  containerStyle={globalStyles.userInputContainer}
                  TextStyle={globalStyles.input}
                  placeholder="Contact Details"
                  value={contactDetails}
                  onPress={() => {}}
                  setValue={setContactDetails}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={[utilitiesStyles.flex_1]}>
              <Text style={globalStyles.userInputLabel}>Opening hours</Text>
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
                  <Picker.Item
                    style={globalStyles.pickerValue_sm}
                    label="AM"
                    value="am"
                  />
                  <Picker.Item
                    style={globalStyles.pickerValue_sm}
                    label="PM"
                    value="pm"
                  />
                </Picker>
              </View>
            </View>
            <View style={globalStyles.profileInputContainer}>
              <View style={{ flex: 1 }}>
                <Text style={globalStyles.userInputLabel}>Address</Text>
                <CustomTextInput
                  containerStyle={globalStyles.userInputContainer}
                  TextStyle={globalStyles.input}
                  placeholder="Address"
                  value={storeAddress}
                  onPress={() => {}}
                  multiline={true}
                  setValue={setStoreAddress}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={globalStyles.p_3}>
          <Button onPress={() => {}} title="Save" />
        </View>
      </View>
      </SafeAreaView>
    </>
  );
};

export default AdminStoreInformation;
