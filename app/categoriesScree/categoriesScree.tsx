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
import { globalStyles } from "@/assets/styles/globalStyles";

const screenWidth = Dimensions.get("window").width;

const categoriesScreen = () => {
  const [subCategories, setsubCategories] = useState<Category[]>([]);
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
    const fetchSubCategories = async () => {
      try {
        const data = await categoryService.getAllSubCategories(
          Number(categoryId)
        );
        console.log(data);
        const filterData = data.filter(
          (item) => item.id !== Number(categoryId)
        );
        setsubCategories(filterData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchSubCategories();
  }, []);

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <View
        style={[
          styles.categoryItem,
          isEven ? styles.leftItem : styles.rightItem,
          { width: (screenWidth / 2) - 15 },
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
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
    <View style={{flex:1}}>
      <Header headerText={category?.name} />
       <ScrollView style = {styles.categories}> 
      <FlatList
        ListHeaderComponent={
            <View style={[{ backgroundColor: colors.white }]}>
              <FlatList
                data={subCategories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={[
                  styles.row,
                  { justifyContent: 'space-between' }
                ]}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                //nestedScrollEnabled={true}
              />
            </View>
        }
        data={[]}
        renderItem={null}
      />

     </ScrollView> 
      <Footer navigation={router} activeTab="home" />
    </View>
   </SafeAreaView>
  );
};

export default categoriesScreen;
