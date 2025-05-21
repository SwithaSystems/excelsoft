import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import Button from "@/components/commonComponents/Button";
import { CustomTextInput } from "@/components/commonComponents/CustomTextInput";
import { Picker } from "@react-native-picker/picker";
import React, { use, useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from "react-native";
import { utilitiesStyles } from "@/assets/styles/utilitiesStyles";
import colors from "../config/colors";
import { useLocalSearchParams } from "expo-router";
import { CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";


const AdminProductUpdation = () => {
  const props = useLocalSearchParams();
  const [productName, setProductName] = useState("");
  const [title, setTitle] = useState("");  
  const [productDescription, setProductDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [minimumOrderQunatity, setMinimumOrderQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [period, setPeriod] = useState("am");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default date as ISO for web support
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerPrice, setOfferPrice] = useState([{
    qty:"", 
    actualPrice:"",
     discountPrice:""
  }])

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const product =
    typeof props.item === "string" ? JSON.parse(props.item) : props.item;
  console.log("product selected", product);

  useEffect(() => {
    if (product) {
      setProductName(product.name || "");
      setStock(product.stock?.toString() || "");
      setPrice(product.originalPrice?.toString() || "");
      setDiscountPrice(product.price?.toString() || "");
      setCategory(product.categoryId?.[0]?.toString() || "");

      const now = new Date();
      let hrs = now.getHours();
      const mins = now.getMinutes();
      setPeriod(hrs >= 12 ? "pm" : "am");
      hrs = hrs % 12 || 12;
      setHours(hrs < 10 ? `0${hrs}` : `${hrs}`);
      setMinutes(mins < 10 ? `0${mins}` : `${mins}`);
    }
  }, [product]);

  const onDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || new Date(date);
    setShowDatePicker(false);
    setDate(currentDate.toISOString().split("T")[0]); // Format date as yyyy-mm-dd
  };

  const addNewPrice = () => {
    const newRow = {qty: "", actualPrice:"", discountPrice:""};
    const updatedPrices = offerPrice.concat(newRow);
    setOfferPrice(updatedPrices);
  }

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={[
      globalStyles.container,
      {paddingTop: 16}
      ]}>
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
            <TextInput
              value={productName}
              onChangeText={setProductName}
              onPress={() => {}}
              placeholder="Enter product name"
              style={styles.textboxStyles}
            />
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              onPress={() => {}}
              placeholder="Enter title"
              style={styles.textboxStyles}
            />
            <Text style={styles.label}>Product Description</Text>
            <TextInput
              value={productDescription}
              onChangeText={setProductDescription}
              onPress={() => {}}
              placeholder="Enter Product Description"
              multiline
              numberOfLines={6}
              style={styles.multilinetextbox}
            />

              <Text style={styles.label}>Category</Text>
              <View style={[styles.categoryStyles, {height:40, justifyContent:'center'}]}>
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
              <TextInput
              value={stock}
              onChangeText={setStock}
              onPress={() => {}}
              placeholder="Enter available stock"
              keyboardType="numeric"
              style={styles.textboxStyles}
             />
              <Text style={styles.label}>Price</Text>
              
              <TextInput
                value={price}
                onChangeText={setPrice}
                onPress={() => {}}
                placeholder="Enter price per unit"
                keyboardType="numeric"
                style={styles.textboxStyles}
             />

              <Text style={styles.label}>Minimum Order Qunatity:</Text>
              <TextInput
                value={minimumOrderQunatity}
                onChangeText={setMinimumOrderQuantity}
                onPress={() => {}}
                placeholder="Enter the minimum order quantity"
                keyboardType="numeric"
                style={styles.textboxStyles}
             />
             <Text style={styles.label}>Select Color</Text>
              <View style={[styles.categoryStyles, {height:40, justifyContent:'center'}]}>
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
                    label="Black"
                    value="Black"
                  />
                  <Picker.Item
                    style={globalStyles.pickerValue}
                    label="White"
                    value="White"
                  />
                </Picker>
              </View>
              {/* <View style={[globalStyles.mt_3]}>
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
                    <Text style={[styles.label, globalStyles.mt_0]}>
                      Date: *
                    </Text>
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
                    <Text style={[styles.label, globalStyles.mt_0]}>
                      Time: *
                    </Text>
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

                      AM/PM Dropdown
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
              </View> */}
              {/* <View style={styles.imageContainer}>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <TouchableOpacity key={index} style={styles.imagePlaceholder}>
                    <Text style={styles.plus}>+</Text>
                  </TouchableOpacity>
                ))}
              </View> */}
              <View style={styles.checkBox}>
                <CheckBox
                  checked={isDefault}
                  onPress={() => setIsDefault(!isDefault)}
                />
                <Text>Is returnable?</Text>
              </View>
              <Text style={styles.tableHeading}>QTY        Actual Price        Discounted Price</Text>
              {offerPrice.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <TextInput
                      style={styles.tableInput}
                      value={item.qty}
                      //onChangeText={}
                      placeholder="QTY"
                    />
                    <TextInput
                      style={styles.tableInput}
                      value={item.actualPrice}
                      //onChangeText={}
                      placeholder="Price"
                    />
                    <TextInput
                      style={styles.tableInput}
                      value={item.discountPrice}
                      //onChangeText={}
                      placeholder="Discounted"
                    />
                    
                    {index === offerPrice.length - 1 && (
                      <TouchableOpacity onPress={addNewPrice}>
                        <Ionicons 
                        name="add-circle" 
                        size={36} 
                        color={colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              <View style={{marginBottom: 20}}>
                <Text style={styles.label}>
                  Would you like to add some pictures for your products?
                </Text>
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={pickImage}
                  disabled={isSubmitting}
                >
                  <Ionicons
                    name="add"
                    size={30}
                    color={isSubmitting ? "#ccc" : "gray"}
                  />
                </TouchableOpacity>
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 200, height: 200, marginTop: 10 }}
                  />
                )}
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
   textboxStyles: {
      backgroundColor: colors.placeholdergrey,
      borderWidth: 0,
      borderRadius: 8,
      padding: 10,
      textAlignVertical: 'top',  
    },
    multilinetextbox:{
      height: 150,
      backgroundColor: colors.placeholdergrey,
      borderWidth: 0,
      borderRadius: 8,
      padding: 10,
      textAlignVertical: 'top', 
    },
    categoryStyles:{
      backgroundColor: colors.placeholdergrey,
      borderWidth: 0,
      borderRadius: 8,
      // padding: 10,
      // textAlignVertical: 'top', 
    },
    checkBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  tableHeading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    //padding: 8,
    alignItems: 'center',
    gap:16,
  },
  tableInput: {
    flex: 1,
    height: 40,
    marginHorizontal: 4,
    padding: 8,
    backgroundColor: colors.secondary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    textAlign: 'center',
  },
});

export default AdminProductUpdation;
