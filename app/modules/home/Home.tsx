import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
  StatusBar,
} from "react-native";
import BrandHeader from "../../components/BrandHeader";
import { useRouter } from "expo-router";
import Footer from "../../components/Footer";
import CategoryItem_Home from "../../components/CategoryItem_Home";
import colors from "../../../constants/colors";
import products from "../../../data/products";
import SearchBar from "../../components/searchBar";
import Header from "../../components/Header";
import RecommendedProductsSlider from "../../components/RecommendedProductsSlider";
import ExclusiveOffers from "../../components/ExclusiveOffers";
import HeroBanner from "../../components/HeroBanner";
import { globalStyles } from "@/assets/styles/globalStyles";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { categoryService, Category } from "../../../services/categoryService";
import { PageLayout } from "@/app/components/commonComponents/pageLayoutProps";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import { PageLayoutWeb } from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import Button from "@/app/components/commonComponents/Button";
import CarouselWeb from "@/app/components/commonComponentsWeb/carousal";

interface Promotion {
  id: number;
  image: string;
  link?: string;
  title?: string;
  description?: string;
}

const TEST_PROMOTIONS: Promotion[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800",
    link: "https://example.com/promo1",
    title: "Summer Sale",
    description: "Get 50% off on all items",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800",
    link: "https://example.com/promo2",
    title: "New Arrivals",
    description: "Check out our latest collection",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800",
    link: "https://example.com/promo3",
    title: "Special Offer",
    description: "Limited time only - Buy 2 Get 1 Free",
  },
];

const exclusiveOffers: any = [];
const bestSellers: any = [];
const featuredProducts: any = [];

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promotionsLoading, setPromotionsLoading] = useState(false);
  const router = useRouter();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTabOrDesktop = width >= 768;

  const HeaderComponent = isTabOrDesktop ? <BrandHeaderWeb /> : <BrandHeader />;
  const FooterComponent = isTabOrDesktop ? <FooterWeb /> : <Footer activeTab="home" />;
  const LayoutComponent = isTabOrDesktop ? PageLayoutWeb : PageLayout;

  const carouselWidth = isTabOrDesktop ? width - 64 : width - 32;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        const sortedData = data.sort((a, b) => {
          if (a.name === "All") return -1;
          if (b.name === "All") return 1;
          return a.id - b.id;
        });
        setCategories(sortedData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setPromotionsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPromotions(TEST_PROMOTIONS);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setPromotionsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <LayoutComponent
      hasHeader
      hasFooter
      headerComponent={HeaderComponent}
      footerComponent={FooterComponent}
      scrollable
    >
      <View style={styles.container}>
        <Header />

        {/* Mobile: Categories first, carousel below */}
        {!isTabOrDesktop && (
          <View style={styles.categoriesContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                  <CategoryItem_Home
                    name={item.name}
                    imageUrl={item.images?.[0] || ""}
                    onPress={() =>
                      item.name === "All"
                        ? redirectToPage(containers.categoriesScreen, {
                            category: item.name,
                            categoryId: item.id,
                          })
                        : redirectToPage(containers.searchResultsScreen, {
                            fromSearch: true,
                            category: item.name,
                            categoryId: item.id,
                          })
                    }
                  />
                )}
              />
            )}
          </View>
        )}

        {/* Carousel */}
        <View style={styles.carouselSection}>
          {promotionsLoading ? (
            <View style={styles.carouselLoader}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : promotions.length > 0 ? (
            <CarouselWeb
              data={promotions}
              isPromotional={true}
              showOverlay={true}
              autoPlay={true}
              autoPlayInterval={4500}
              loop={true}
              showArrows={true}
              showIndicators={true}
              width={carouselWidth}
              height={isTabOrDesktop ? 300 : 230}
              borderRadius={12}
            />
          ) : null}
        </View>

        {/* Desktop: Categories can be elsewhere */}
        {isTabOrDesktop && (
          <View style={styles.categoriesContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : (
              <FlatList
                data={categories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                  <CategoryItem_Home
                    name={item.name}
                    imageUrl={item.images?.[0] || ""}
                    onPress={() =>
                      item.name === "All"
                        ? redirectToPage(containers.categoriesScreen, {
                            category: item.name,
                            categoryId: item.id,
                          })
                        : redirectToPage(containers.searchResultsScreen, {
                            fromSearch: true,
                            category: item.name,
                            categoryId: item.id,
                          })
                    }
                  />
                )}
              />
            )}
          </View>
        )}
      </View>
    </LayoutComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    marginVertical: 8,
  },
  carouselSection: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  carouselLoader: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default HomePage;
