import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import colors from "@/app/config/colors";
import { router } from "expo-router";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { categoryService } from "@/services/categoryService";

const CategoryBadges = (props) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("relevance");
  const [activeFilter, setActiveFilter] = useState("All");
  const sortOptions = [
    { label: "Relevance", value: "relevance" },
    { label: "Low to High", value: "lowToHigh" },
    { label: "High to Low", value: "highToLow" },
  ];
  const [subCategoriesNames, setsubCategoriesNames] = useState([]);
  // const categories = [
  //   "All",
  //   "Babies",
  //   "Kids",
  //   "Toys",
  //   "Clothing",
  //   "Cribs",
  //   "Accessories",
  //   "Shoes",
  // ];

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await categoryService.getAllSubCategories(
          props.categoryId
        );
        console.log("all sub categories", data);
        if (data && data.length > 0) {
          const setsubCategories = data.map((category) => category.name);
          setsubCategoriesNames(setsubCategories);
        } else {
          // If no subcategories, only show "All"
          setsubCategoriesNames([]);
        }
        setActiveFilter("All");
        props.onCategorySelect && props.onCategorySelect(props.categoryId);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setsubCategoriesNames([]);
      }
    };
    fetchSubCategories();
  }, [props.categoryId]);

  const renderSortOption = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedOption(item.value);
        setIsDropdownVisible(false);
        alert(item.value);
      }}
    >
      <Text
        style={[
          styles.sortOptions,
          selectedOption == item.value ? styles.activeSortOption : null,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {["All",...subCategoriesNames].map((category, index) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                activeFilter === category && styles.activeFilterButton,
                index === subCategoriesNames.length - 1
                  ? { marginRight: 0 }
                  : {}, // Remove margin for last item
              ]}
              onPress={() => {
                setActiveFilter(category);
                if (category === "All") {
                  props.onCategorySelect && props.onCategorySelect(props.categoryId);
                } else {
                  const selectedSubCategory = props.subCategories.find(
                    (subCat) => subCat.name === category
                  );
                  if (selectedSubCategory) {
                    props.onCategorySelect && props.onCategorySelect(selectedSubCategory.id);
                  }
                }
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === category && styles.activeFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.fixedIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              redirectToPage(containers.filterScreen);
            }}
          >
            <Feather name="filter" size={26} color={colors.black} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { marginLeft: 24 }]}
            onPress={() => setIsDropdownVisible(true)}
          >
            <Ionicons name="swap-vertical" size={26} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownContent}>
            <FlatList
              data={sortOptions}
              renderItem={renderSortOption}
              keyExtractor={(item) => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sortOptions: {
    padding: 16,
    fontSize: 14,
  },
  activeSortOption: {
    backgroundColor: colors.lightSkyBlue,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContent: {
    backgroundColor: colors.white,
    borderRadius: 5,
    width: "100%",
  },

  container: {
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    paddingBottom: 16,
  },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingRight: 60,
    alignItems: "center",
    flex: 1,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.lightSkyBlue,
    marginRight: 12,
    marginLeft: 0,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.black,
    minWidth: 80,
    textAlign: "center",
  },
  activeFilterText: {
    color: colors.black,
    fontWeight: "bold",
  },
  fixedIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 'auto',
  },
  iconButton: {
    padding: 2,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    //marginLeft: 12, // Space between filter and sort icon
  },
});

export default CategoryBadges;
