import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { globalStyles } from "@/assets/styles/globalStyles";
import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import { useLocalSearchParams } from "expo-router";
import styles from "./adminUserOrderDisplayStyles";

const adminUserOrderDisplay = () => {  
  const [activeCategory, setActiveCategory] = useState("All Orders");
  const categories = ["All Orders", "Cancelled", "Replaced", "Returned"];

  return (
    <View style={styles.container}>
      <Header headerText="Orders" />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search orders..."
        />
        <TouchableOpacity>
          <Ionicons name="search" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.subCategory}>
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setActiveCategory(category)}
              style={[
                styles.subCategoryNames,
                isActive ? styles.activeSubCategory : null,
              ]}
            >
              <Text
                style={[
                  styles.subCategoryNameText,
                  isActive ? styles.activeSubCategoryText : null,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.welcomeText}>WELCOME, Let’s go through the orders details!</Text>
    </View>
  );
};

export default adminUserOrderDisplay;
