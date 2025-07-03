import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal } from "react-native";
import colors from "../config/colors";

const CategoryDropdown = ({
  selectedCategory,
  setSelectedCategory,
  containerStyle,
  placeholder = "Select parent category",
  categories,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (category) => {
    console.log("Parent category", category);
    setSelectedCategory(category.id);
    setIsVisible(false);
  };

  const getSelectedCategoryName = () => {
    const selected = categories.find((cat) => cat.id === selectedCategory);
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
              data={categories}
              keyExtractor={(item) => item.id.toString()}
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
    color: "#999",
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
