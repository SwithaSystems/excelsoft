import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import Header from "@/components/Header";
import colors from "../config/colors";
import CategoryItem from "../components/CategoryItem";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Footer from "@/components/Footer";
import { router, useLocalSearchParams } from "expo-router";
import styles from "./categoriesScreeStyles";
import { categoryService, Category } from "@/services/categoryService";
import PageLayout from "../pageLayoutProps";

const screenWidth = Dimensions.get("window").width;

const categoriesScreen = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>();
  const { categoryId } = useLocalSearchParams();

  useEffect(() => {
    console.log("categoryId", categoryId);
    const fetchCategory = async () => {
      const data = await categoryService.getCategoryById(Number(categoryId));
      console.log(data);
      setCategory(data);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        console.log(data);
        // const filterData = data.filter(
        //   (item) => item.id !== Number(categoryId)
        // );
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAllCategories();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <View
        style={[
          styles.categoryItem,
          isEven ? styles.leftItem : styles.rightItem,
          { width: (screenWidth - 80) / 2 },
        ]}
      >
        <CategoryItem
          containerStyle={{ width: "100%" }}
          title={item.name}
          image={item.images?.[0] || ""}
          onPress={() =>
            redirectToPage(containers.searchResultsScreenScreen, {
              fromSearch: true,
              category: item.name,
              categoryId: item.id,
            })
          }
        />
      </View>
    );
  };
  return (
    <PageLayout
      scrollable
      hasHeader
      hasFooter
      headerComponent={<Header headerText={category?.name} />}
      footerComponent={<Footer />}
    >
      <FlatList
        ListHeaderComponent={
          <View style={[{ backgroundColor: colors.white }]}>
            <FlatList
              data={allCategories}
              keyExtractor={(item: any) => item.id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={[
                styles.row,
                {
                  justifyContent: "space-between",
                  // paddingHorizontal: 16
                },
              ]}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>
        }
        data={[]}
        renderItem={null}
      />
    </PageLayout>
  );
};

export default categoriesScreen;
