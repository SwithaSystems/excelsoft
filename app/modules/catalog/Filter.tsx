import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { CheckBox } from "react-native-elements";
import colors from "../../../constants/colors";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { useLocalSearchParams } from "expo-router";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { categoryService } from "@/services/categoryService";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { FILTER_SCREEN_TITLE } from "../../../constants/stringLiterals";

const Filter = () => {
  const { categoryId } = useLocalSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<{ [key: number]: boolean }>({});
  const [selectedBrands, setSelectedBrands] = useState<{ [key: string]: boolean }>({});

  const brands = ["Brand1", "Brand2", "Brand3", "Brand4", "Brand5", "Brand6"];
  const itemWidth = (Dimensions.get("window").width - 30) / 2 - 8;

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await categoryService.getAllSubCategories(Number(categoryId));
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [categoryId]);

  const handleCategorySelect = (id: number) => {
    setSelectedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleBrandSelect = (brand: string) => {
    setSelectedBrands((prev) => ({ ...prev, [brand]: !prev[brand] }));
  };

  const applyFilters = () => {
    const selectedCategoryIds = Object.keys(selectedCategories)
      .filter((id) => selectedCategories[Number(id)])
      .map(Number);

    if (selectedCategoryIds.length === 0) {
      alert("Please select at least one category!");
      return;
    }
    redirectToPage(containers.searchResultsScreen, {
      selectedSubCategories: selectedCategoryIds,
      fromSearch: true,
    });
  };

  return (
    <PageLayout
      hasHeader
      hasFooter={false}
      scrollable
      headerComponent={<Header headerText={FILTER_SCREEN_TITLE} />}
    >
      <View style={globalStyles.sectionContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <ScrollView style={styles.scrollContainer}>
            <View style={[styles.section, { marginBottom: 0 }]}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.checkBoxRow}>
                {categories.map((category) => (
                  <View key={category.id} style={{ width: itemWidth }}>
                    <CheckBox
                      title={category.name}
                      checked={!!selectedCategories[category.id]}
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
                  <View key={brand} style={{ width: itemWidth }}>
                    <CheckBox
                      title={brand}
                      checked={!!selectedBrands[brand]}
                      onPress={() => handleBrandSelect(brand)}
                      containerStyle={styles.checkBoxContainer}
                      textStyle={styles.checkBoxText}
                    />
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        <Button title="Apply Filters" onPress={applyFilters} style={styles.applyButton} />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 36 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "400", marginBottom: 16, color: colors.black },
  applyButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkBoxContainer: {
    backgroundColor: colors.white,
    borderWidth: 0,
    padding: 10,
    marginBottom: 16,
  },
  checkBoxText: { color: colors.black },
  checkBoxRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});

export default Filter;
