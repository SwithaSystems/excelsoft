import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from "react-native";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import colors from "../config/colors";

const AdminProductUpdation = () => {
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]); // Format date as yyyy-mm-dd
  };

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={globalStyles.container}>
      <Header headerText="Add Product" />
      <ScrollView>
        <View
          style={[
            globalStyles.sectionContent,
            globalStyles.pt_0,
            globalStyles.mt_n3,
          ]}
        >
          <View>
            <Text style={styles.label}>Product Name</Text>
            <CustomTextInput
              setValue={setProductName}
              value={productName}
              onPress={() => {}}
              placeholder="Enter product name"
            />

            <Text style={styles.label}>Category</Text>
            <View>
              <Picker
                style={globalStyles.picker}
                selectedValue={category}
                onValueChange={(value) => setCategory(value)}
              >
                <Picker.Item
                  style={globalStyles.pickerValue}
                  label="Select"
                  value=""
                />
                <Picker.Item
                  style={globalStyles.pickerValue}
                  label="Category 1"
                  value="cat1"
                />
                <Picker.Item
                  style={globalStyles.pickerValue}
                  label="Category 2"
                  value="cat2"
                />
              </Picker>
            </View>

            <Text style={styles.label}>Stock</Text>
            <CustomTextInput
              onPress={() => {}}
              setValue={setStock}
              value={stock}
              //style={styles.input}
              placeholder="Enter available stock"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Price</Text>
            <CustomTextInput
              onPress={() => {}}
              setValue={setPrice}
              value={price}
              //style={styles.input}
              placeholder="Enter price per unit"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Discount Price</Text>
            <CustomTextInput
              //style={styles.input}
              onPress={() => {}}
              setValue={setDiscountPrice}
              value={discountPrice}
              placeholder="Enter the discount price"
              keyboardType="numeric"
            />
            <View style={[globalStyles.mt_3]}>
              <Text style={[globalStyles.size_16, globalStyles.mb_3]}>
                Pick the date and time when the discount starts and ends.
              </Text>
              <View
                style={[
                  globalStyles.flexRow,
                  globalStyles.justifyContentBetween,
                ]}
              >
                <View style={utilitiesStyles.flex_1}>
                  <Text style={[styles.label, globalStyles.mt_0]}>Date: *</Text>
                  {Platform.OS === "web" ? (
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
                <View style={[utilitiesStyles.flex_1, globalStyles.pl_3]}>
                  <Text style={[styles.label, globalStyles.mt_0]}>Time: *</Text>
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
              </View>
            </View>
            <View style={styles.imageContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <TouchableOpacity key={index} style={styles.imagePlaceholder}>
                  <Text style={styles.plus}>+</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          globalStyles.p_3,
          globalStyles.flexRow,
          globalStyles.justifyContentBetween,
        ]}
      >
        <Button onPress={() => {}} title="Add" />
        <Button onPress={() => {}} title="Discard" primary={false} />
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D1D1D1",
    marginTop: 5,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  plus: {
    fontSize: 24,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#00AEEF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  discardButton: {
    backgroundColor: "#6C757D",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AdminProductUpdation;
