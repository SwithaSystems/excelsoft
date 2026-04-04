import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import colors from "../../../../constants/colors";

const CategoryDropdown = ({
  selectedCategory,
  setSelectedCategory,
  containerStyle,
  placeholder = "Select parent category",
  categories,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (category) => {
    // Handle "All Categories" option (when id and _id are both null/undefined)
    if ((!category.id && !category._id) || category.id === null || category._id === null) {
      setSelectedCategory("");
      setIsVisible(false);
      return;
    }
    // Support both id and _id
    const categoryId = category.id || category._id;
    setSelectedCategory(categoryId);
    setIsVisible(false);
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory || selectedCategory === "") {
      return placeholder;
    }
    // Support both id and _id
    const selected = categories.find(
      (cat) => (cat.id || cat._id) == selectedCategory
    );
    return selected ? selected.name : placeholder;
  };

  return (
    <View style={containerStyle}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text
          style={[
            styles.dropdownText,
            !selectedCategory && styles.placeholderText,
          ]}
        >
          {getSelectedCategoryName()}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={[{ name: placeholder, id: null, _id: null }, ...categories]}
              keyExtractor={(item, index) => 
                item.id ? item.id.toString() : 
                item._id ? item._id.toString() : 
                `all-categories-${index}`
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = {
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    height: 60,
    backgroundColor: colors.white,
    marginbottom: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: colors.slateGrey,
    fontSize: 14,
  },
  arrow: {
    fontSize: 12,
    color: colors.darkGray,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 300,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
};

export default CategoryDropdown;
