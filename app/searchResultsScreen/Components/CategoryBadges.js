import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import colors from "@/app/config/colors";
import { router } from "expo-router";

const CategoryBadges = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const categories = [
    "All",
    "Babies",
    "Kids",
    "Toys",
    "Clothing",
    "Cribs",
    "Accessories",
    "Shoes",
  ]; // Add more categories

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                activeFilter === category && styles.activeFilterButton,
                index === categories.length - 1 ? { marginRight: 0 } : {}, // Remove margin for last item
              ]}
              onPress={() => setActiveFilter(category)}
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
              router.push({
                pathname: "/filter/filter",
                //params: { query: searchQuery }
              });
            }}
          >
            <Feather name="filter" size={26} color={colors.black} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.iconButton, { marginLeft: 24 }]}>
            <Feather name="arrow-up" size={26} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 10,
    backgroundColor: colors.lightSkyBlue,
    padding: 10,
    borderRadius: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 10,
  },
  filterWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingRight: 20, // Ensures space before fixed icons
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.lightSkyBlue,
    marginRight: 24,
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
  },
  iconButton: {
    padding: 2,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    //marginLeft: 12, // Space between filter and sort icon
  },
});

export default CategoryBadges;
