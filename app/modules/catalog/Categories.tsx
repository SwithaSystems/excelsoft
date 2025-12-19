import React, { useEffect, useState } from "react";
import { View, FlatList, Dimensions, useWindowDimensions, Platform } from "react-native";
import Header from "../../components/Header";
import colors from "../../../constants/colors";
import CategoryItem from "../../components/CategoryItem";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import Footer from "@/app/components/Footer";
import { router, useLocalSearchParams } from "expo-router";
import { categoryService, Category } from "@/services/categoryService";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import styles from "./CategoriesStyles";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";

const screenWidth = Dimensions.get("window").width;

const categoriesScreen = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>();
  const { categoryId } = useLocalSearchParams();

  // Responsive design: detect if device is tablet or desktop
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    // console.log("categoryId", categoryId);
    const fetchCategory = async () => {
      const data = await categoryService.getCategoryById(Number(categoryId));
      // console.log(data);
      setCategory(data);
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        // console.log(data);
        setAllCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchAllCategories();
  }, []);

  const numColumns = isWeb ? 4 : 2;
  // Use flex-basis percentage for responsive layout
  const itemFlexBasis = isWeb ? "23%" : "47%";

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View
        style={[
          styles.categoryItem,
          {
            flexBasis: itemFlexBasis,
            maxWidth: itemFlexBasis,
            marginRight: isWeb ? 15 : 0,
            marginBottom: 16,
          },
        ]}
      >
        <CategoryItem
          containerStyle={{ width: "100%" }}
          title={item.name}
          image={item.images?.[0] || ""}
          onPress={() =>
            redirectToPage(containers.searchResultsScreen, {
              fromSearch: true,
              category: item.name,
              categoryId: item.id,
            })
          }
        />
      </View>
    );
  };
  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb />
  ) : (
    <Header headerText={category?.name} />
  );
  const FooterComponent = isWeb ? (
    <FooterWeb />
  ) : (
    <Footer navigation={router} />
  );

  return (
    <LayoutComponent
      scrollable
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
    >
      <FlatList
        ListHeaderComponent={
          <View style={[{ backgroundColor: colors.white }]}>
            <FlatList
              data={allCategories}
              keyExtractor={(item: any) => item.id}
              renderItem={renderItem}
              numColumns={numColumns}
              key={numColumns}
              columnWrapperStyle={[
                styles.row,
                {
                  justifyContent: isWeb ? "flex-start" : "space-between",
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
    </LayoutComponent>
  );
};

export default categoriesScreen;
