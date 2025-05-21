import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import styles from './AdminCategoriesStyles';
import { SafeAreaView } from 'react-native';
import { globalStyles } from '@/assets/styles/globalStyles';
import Header from '@/components/Header';
import { Button } from 'react-native-elements';
import colors from '../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput } from '@/components/commonComponents/CustomTextInput';

const AdminCategories = () => {
  const [category,setCategory] = useState("");
  const [categoryList, setCategoryList] = useState([
    "Groceries",
    "Baby & Kids",
    "Fruits",
    "Home & Furniture",
    "Drinks & Beverages",
    "Beauty & Skincare",
    "Gifts & Hardware"
  ]);

  const setNewCategory = () => {
    if(category.trim()){
      setCategoryList([...categoryList, category]);
      setCategory("");
    }
  };
  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
      <View style={styles.container}>
        <Header headerText="Categories" />
        <ScrollView>
          <View style = {{}}>
          <CustomTextInput 
            value={category} 
            setValue={setCategory} 
            placeholder='Enter Category name'
            containerStyle={styles.input}
            onPress={()=>{}}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={setNewCategory}
          >
            <Text
            style={styles.addButtonText}>Add New Category</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.listContainer}>
        {categoryList.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            <Text style={styles.categoryText}>{category}</Text>
            <Ionicons name="chevron-forward" size={20} color="#C8C8C8" />
          </TouchableOpacity>
        ))}
      </ScrollView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AdminCategories;
