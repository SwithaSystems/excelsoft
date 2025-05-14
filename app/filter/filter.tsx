import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView
} from "react-native";
import { CheckBox } from "react-native-elements";
import colors from "../config/colors";
import Header from "@/components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/components/commonComponents/Button";
import { useLocalSearchParams, useNavigation } from "expo-router";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { categoryService } from "@/services/categoryService";

const Filter = () => {
  const props = useLocalSearchParams();
  console.log("props", props.categoryId);
  const categoryID = props.categoryId;
  console.log("cate", categoryID);
  const navigation = useNavigation();

  const brands = ["Brand1", "Brand2", "Brand3", "Brand4", "Brand5", "Brand6"];
  const [selectedCategories, setSelectedCategories] = useState<any>({});

  const [selectedBrands, setSelectedBrands] = useState<any>({});
  const [categories, setCategories] = useState<any>([]);

  const { width } = Dimensions.get("window");
  const itemWidth = (width - 30) / 2 - 8; // calculating the width of each item by screen size

  useEffect(() => {
    const fetchSubCategories = async () => {
      const data = await categoryService.getAllSubCategories(
        Number(categoryID)
      );
      console.log("all sub categories in badges", data);
      setCategories(data);
    };
    fetchSubCategories();
  }, [categoryID]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategories((prev: any) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleBrandSelect = (brand: any) => {
    setSelectedBrands({ ...selectedBrands, [brand]: !selectedBrands[brand] });
  };

  const applyFilters = () => {
    const selectedCategoryIds = Object.keys(selectedCategories)
      .filter((categoryId) => selectedCategories[categoryId])
      .map(Number); // convert string keys to numbers

    console.log("Selected Subcategory IDs:", selectedCategoryIds);
    if (selectedCategoryIds.length === 0) {
      alert("Please select at least one category!");
      return;
    } else {
      // Now navigate to the search result screen and pass these IDs
      redirectToPage(containers.searchResultsScreenScreen, {
        selectedSubCategories: selectedCategoryIds,
        fromSearch: true,
      });
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeAreaContainer}>
    <View style={styles.container}>
      <Header headerText={"Filter"} headerStyle={styles.header} />
      <View style={globalStyles.sectionContent}>
        <ScrollView style={styles.scrollContainer}>
          <View style={[styles.section, { marginBottom: 0 }]}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.checkBoxRow}>
              {categories.map((category: any) => (
                <View key={category.id} style={[{ width: itemWidth }]}>
                  <CheckBox
                    title={category.name}
                    checked={selectedCategories[category.id]}
                    onPress={() => handleCategorySelect(category.id)}
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
              {brands.map((brand) => (
                <View key={brand} style={[{ width: itemWidth }]}>
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
          <Button
            title="Apply Filters"
            onPress={applyFilters}
            style={styles.applyButton}
          />
        </View>
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {},
  container: {
    flex: 1,
    backgroundColor: colors.lightgrey,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 36,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "400",
    marginBottom: 16,
    color: colors.black, // Use black from your palette
  },
  applyButton: {
    backgroundColor: colors.primary, // Use primary from your palette
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 0, // At the bottom
    left: 0, // Full width
    right: 0,
  },
  checkBoxContainer: {
    backgroundColor: colors.white,
    borderWidth: 0,
    padding: 10,
    marginTop: 0,
    marginBottom: 16,
    marginLeft: 0,
    marginRight: 0,
  },
  checkBoxText: {
    color: colors.black,
    fontWeight: 400,
  },
  checkBoxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});

export default Filter;
