import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { CheckBox } from "react-native-elements";
import colors from "../../../constants/colors";
import Header from "../../components/Header";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import containers from "@/containers";
import { redirectToPage } from "@/utilities/redirectionHelper";
import { categoryService } from "@/services/categoryService";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import Footer from "@/app/components/Footer";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import { FILTER_SCREEN_TITLE } from "../../../constants/stringLiterals";

const Filter = () => {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingFilters, setApplyingFilters] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<{
    [key: number]: boolean;
  }>({});
  const [selectedBrands, setSelectedBrands] = useState<{
    [key: string]: boolean;
  }>({});

  const brands = ["Brand1", "Brand2", "Brand3", "Brand4", "Brand5", "Brand6"];
  const itemWidth = (Dimensions.get("window").width - 30) / 2 - 8;

  // Responsive design: detect if device is tablet or desktop
  const { width } = useWindowDimensions();
  const isTabOrDesktop = width >= 768;

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await categoryService.getAllSubCategories(
          Number(categoryId)
        );
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCategories();
  }, [categoryId]);

  const handleCategorySelect = useCallback((id: number) => {
    setSelectedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleBrandSelect = useCallback((brand: string) => {
    setSelectedBrands((prev) => ({ ...prev, [brand]: !prev[brand] }));
  }, []);

  const applyFilters = useCallback(async () => {
    setApplyingFilters(true);

    const selectedCategoryIds = Object.keys(selectedCategories)
      .filter((id) => selectedCategories[Number(id)])
      .map(Number);

    if (selectedCategoryIds.length === 0) {
      setApplyingFilters(false);
      alert("Please select at least one category!");
      return;
    }
    try {
      redirectToPage(containers.searchResultsScreen, {
        selectedSubCategories: selectedCategoryIds,
        fromSearch: true,
        category: "Filtered Results",
        categoryId: categoryId,
      });
    } finally {
      setApplyingFilters(false);
    }
  }, [selectedCategories]);

  const isApplyFiltersEnabled = categories.length > 0 && Object.values(selectedCategories).some((checked) => checked);

  // Choose layout component based on screen size
  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isTabOrDesktop ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={FILTER_SCREEN_TITLE} />
  );
  const FooterComponent = isTabOrDesktop ? (
    <FooterWeb />
  ) : (
    <Footer navigation={router} />
  );

  if (isTabOrDesktop) {
    return (
      <LayoutComponent
        hasFooter
        hasHeader
        scrollable={true}
        headerComponent={HeaderComponent}
        footerComponent={false}
      >
        <View style={globalStyles.sectionContent}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : categories.length > 0 ? (
            <ScrollView style={styles.scrollContainer}>
              <View style={[styles.section, { marginBottom: 0 }]}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.checkBoxRow}>
                  {categories
                    .filter((category) => category.id !== Number(categoryId))
                    .map((category) => (
                      <View key={category.id} style={{ width: itemWidth }}>
                        <CheckBox
                          title={category.name}
                          checked={!!selectedCategories[category.id]}
                          onPress={() => handleCategorySelect(category.id)}
                          containerStyle={styles.checkBoxContainer}
                          textStyle={styles.checkBoxText}
                          checkedColor={colors.primary}
                          uncheckedColor={colors.secondary}
                        />
                      </View>
                    ))}
                </View>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.noCategoriesContainer}>
              <Text style={styles.noCategoriesText}>No Categories Available</Text>
            </View>
          )}

          <Button
            title="Apply Filters"
            onPress={applyFilters}
            style={isApplyFiltersEnabled ? styles.applyButton : styles.disabledButton}
            textStyle={styles.buttonText}
            disabled={!isApplyFiltersEnabled}
          />
        </View>
      </LayoutComponent>
    );
  }

  return (
    <PageLayout
      hasFooter
      hasHeader
      scrollable
      headerComponent={<Header headerText={FILTER_SCREEN_TITLE} />}
      footerComponent={<Footer navigation={router} />}
    >
      <View style={globalStyles.sectionContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : categories.length > 0 ? (
          <ScrollView style={styles.scrollContainer}>
            <View style={[styles.section, { marginBottom: 0 }]}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.checkBoxRow}>
                {categories
                  .filter((category) => category.id !== Number(categoryId))
                  .map((category) => (
                    <View key={category.id} style={{ width: itemWidth }}>
                      <CheckBox
                        title={category.name}
                        checked={!!selectedCategories[category.id]}
                        onPress={() => handleCategorySelect(category.id)}
                        containerStyle={styles.checkBoxContainer}
                        textStyle={styles.checkBoxText}
                        checkedColor={colors.primary}
                        uncheckedColor={colors.secondary}
                      />
                    </View>
                  ))}
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noCategoriesContainer}>
            <Text style={styles.noCategoriesText}>No Categories Available</Text>
          </View>
        )}

        <Button
          title="Apply Filters"
          onPress={applyFilters}
          style={isApplyFiltersEnabled ? styles.applyButton : styles.disabledButton}
          textStyle={styles.buttonText}
          disabled={!isApplyFiltersEnabled}
        />
      </View>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 36 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "400",
    marginBottom: 16,
    color: colors.black,
  },
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
  checkBoxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  disabledButton: {
    backgroundColor: colors.placeholdergrey,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  noCategoriesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  noCategoriesText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
  },
});

export default Filter;
