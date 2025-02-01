import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { CheckBox } from 'react-native-elements';
import colors from '../config/colors';
import Header from '@/components/Header';
import { globalStyles } from '@/assets/styles/globalStyles';
import Button from '@/components/commonComponents/Button';
import { useNavigation } from 'expo-router';
import containers from '@/containers';

const Filter = () => {
  const navigation = useNavigation(); 
  const categories = ["Kids Gadgets", "Kids toys", "Baby Food", "Baby books", "Kids clothes"];
  const brands = ["Brand1", "Brand2", "Brand3", "Brand4", "Brand5", "Brand6"];
  const [selectedCategories, setSelectedCategories] = useState({  });

  const [selectedBrands, setSelectedBrands] = useState({});

  const { width } = Dimensions.get('window');
    const itemWidth = ((width - 30) / 2) - 8; // calculating the width of each item by screen size

  const handleCategorySelect = (category:String) => {
    setSelectedCategories({ ...selectedCategories, [category]: !selectedCategories[category] });
  };

  const handleBrandSelect = (brand: String) => {
    setSelectedBrands({ ...selectedBrands, [brand]: !selectedBrands[brand] });
  };

  const applyFilters = () => {
    const appliedCategories = Object.keys(selectedCategories).filter(category => selectedCategories[category]);
    const appliedBrands = Object.keys(selectedBrands).filter(brand => selectedBrands[brand]);

    console.log('Applied Filters:', { categories: appliedCategories, brands: appliedBrands });
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate(containers.homeScreen);
  };

  return (
    <View style={styles.container}>
      <Header headerText={"Filter"} headerStyle={styles.header}/>
      <View style={globalStyles.sectionContent}>
      <ScrollView style={styles.scrollContainer}>
        <View style={[styles.section, {marginBottom: 0}]}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.checkBoxRow}>
            {categories.map(category => (
              <View key={category} style={[{width: itemWidth}]}>
                <CheckBox
                  title={category}
                  checked={selectedCategories[category]}
                  onPress={() => handleCategorySelect(category)}
                  containerStyle={styles.checkBoxContainer}
                  textStyle={styles.checkBoxText}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brands</Text>
          <View style={styles.checkBoxRow}>
            {brands.map(brand => (
              <View key={brand} style={[{width: itemWidth}]}>
              <CheckBox
                title={brand}
                  containerStyle={styles.checkBoxContainer}
                  checked={selectedBrands[brand]}
                onPress={() => handleBrandSelect(brand)}
                textStyle={styles.checkBoxText}

              />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View>
        <Button title="Apply Filters" onPress={applyFilters} style={styles.applyButton} />
      </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
  },
  container: {
    flex: 1,
    backgroundColor: colors.lightgrey,
  },
  scrollContainer:{
    flexGrow: 1,
    paddingBottom: 36
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 16,
    color: colors.black, // Use black from your palette
  },
  applyButton: {
    backgroundColor: colors.primary, // Use primary from your palette
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: "absolute",
    bottom: 0,           // At the bottom
    left: 0,             // Full width
    right: 0,
  },
  checkBoxContainer: { 
    backgroundColor: colors.white, 
    borderWidth: 0, 
    padding: 10,
    marginTop: 0,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0
  },
  checkBoxText: {
    color: colors.black,
    fontWeight: 400
  },
  checkBoxRow: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
  },
});

export default Filter;