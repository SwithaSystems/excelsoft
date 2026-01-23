import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "@/constants/colors";

interface Category {
  id?: string | number;
  _id?: string | number;
  name: string;
}

interface Props {
  categories: Category[];
  selectedCategory: string | number;
  setSelectedCategory: (val: string | number) => void;
}

const WebCategoryDropdown: React.FC<Props> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (Platform.OS !== "web") return null;

  const renderItems = () => (
    <>
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          setSelectedCategory("");
          setIsOpen(false);
        }}
      >
        <Text style={styles.dropdownItemText}>All Categories</Text>
      </TouchableOpacity>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id || cat._id}
          style={styles.dropdownItem}
          onPress={() => {
            setSelectedCategory(cat.id || cat._id || "");
            setIsOpen(false);
          }}
        >
          <Text style={styles.dropdownItemText}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity onPress={() => setIsOpen((p) => !p)}>
        <View style={styles.categorySelector}>
          <Text
            style={[
              styles.categoryText,
              {
                color:
                  selectedCategory && selectedCategory !== ""
                    ? colors.black
                    : colors.slateGrey,
              },
            ]}
          >
            {selectedCategory && selectedCategory !== ""
              ? categories.find(
                  (c) => (c.id || c._id) == selectedCategory
                )?.name
              : "All Categories"}
          </Text>

          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.black}
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScrollArea}>
            {renderItems()}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default WebCategoryDropdown;

const styles = StyleSheet.create({
  categoryContainer: {
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 8,
    height: 40,
    minWidth: 140,
    position: "relative",
    zIndex: 1000,
  },

  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    paddingHorizontal: 16,
  },

  categoryText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: colors.black,
  },

  dropdownList: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderColor: colors.placeholdergrey,
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1001,
    maxHeight: 260,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  dropdownScrollArea: {
    maxHeight: 260,
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.placeholdergrey,
    backgroundColor: colors.white,
  },

  dropdownItemText: {
    fontSize: 16,
    color: colors.primary,
  },
});

