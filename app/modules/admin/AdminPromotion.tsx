import React, { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Platform,
  FlatList,
  Modal,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import Header from "../../components/Header";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import colors from "../../../constants/colors";
import styles from "./AdminPromotionStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import Button from "@/app/components/commonComponents/Button";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import PromotionCard from "@/app/components/PromotionCard";
import { redirectToPage } from "@/utilities/redirectionHelper";
import containers from "@/containers";
import { Product, ProductsAPI } from "@/services/productService";
import SearchBar from "@/app/components/searchBar";
import { categoryService } from "@/services/categoryService";
import useDebounce from "@/utilities/customHooks/useDebounce";
import { promotionService, Promotion as APIPromotion } from "@/services/promotionService";
import ConfirmationModal from "@/app/components/commonComponents/ConfirmationModal";
import WebCategoryDropdown from "./componentsWeb/webCategoryDropdown";

interface Promotion {
  id: string;
  title: string;
  url: string;
  image: string | number;
  isLive: boolean;
  _id?: string;
  startingDate?: string;
  endingDate?: string;
  attachedProducts?: any[];
}

const AdminPromotion = () => {
  const params = useLocalSearchParams();
  
  const [promotionImage, setPromotionImage] = useState<string | null>(null);
  const [promotionTitle, setPromotionTitle] = useState("");
  const [promotionUrl, setPromotionUrl] = useState("");
  const [startingDate, setStartingDate] = useState<string>("");
  const [endingDate, setEndingDate] = useState<string>("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [attachedProducts, setAttachedProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productDisplayMode, setProductDisplayMode] = useState<"category" | "product">("product");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const debouncedProductQuery = useDebounce(productSearchQuery, 300);
  const [livePromotions, setLivePromotions] = useState<Promotion[]>([]);
  const [savedPromotions, setSavedPromotions] = useState<Promotion[]>([]);
  const [isLoadingLivePromotions, setIsLoadingLivePromotions] = useState(false);
  const [isSavingPromotion, setIsSavingPromotion] = useState(false);
  const [showRemoveLiveModal, setShowRemoveLiveModal] = useState(false);
  const [promotionToRemoveLive, setPromotionToRemoveLive] = useState<Promotion | null>(null);
  const [errorLoadingPromotions, setErrorLoadingPromotions] = useState<string | null>(null);
  
  // Confirmation modals
  const [showGoLiveModal, setShowGoLiveModal] = useState(false);
  const [promotionToGoLive, setPromotionToGoLive] = useState<Promotion | null>(null);
  const [showDeleteLiveModal, setShowDeleteLiveModal] = useState(false);
  const [promotionToDeleteLive, setPromotionToDeleteLive] = useState<string | null>(null);
  const [showDeleteSavedModal, setShowDeleteSavedModal] = useState(false);
  const [promotionToDeleteSaved, setPromotionToDeleteSaved] = useState<string | null>(null);

  const isWeb = Platform.OS === "web";

  async function getallCategories() {
    try {
      const categories = await categoryService.getAllCategories();
      if (categories) {
        setAllCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    getallCategories();
  }, []);

  const fetchAvailableProducts = useCallback(async () => {
    try {
      setIsLoadingProducts(true);
      const response = await ProductsAPI.getAllProducts(1, 100);
      setAvailableProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to load products");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const handleSelectProducts = useCallback(() => {
    setShowProductModal(true);
    setProductSearchQuery("");
    if (availableProducts.length === 0) {
      fetchAvailableProducts();
    }
  }, [availableProducts.length, fetchAvailableProducts]);

  const searchProductsByName = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchAvailableProducts();
      return;
    }
    try {
      setIsLoadingProducts(true);
      const response = await ProductsAPI.productsBy_Name_Id(query.trim());
      if (response) {
        setAvailableProducts(response);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      Alert.alert("Error", "Failed to search products");
    } finally {
      setIsLoadingProducts(false);
    }
  }, [fetchAvailableProducts]);

  const handleProductSearch = useCallback(async () => {
    await searchProductsByName(productSearchQuery);
  }, [productSearchQuery, searchProductsByName]);

  useEffect(() => {
    if (showProductModal) {
      searchProductsByName(debouncedProductQuery);
    }
  }, [debouncedProductQuery, showProductModal, searchProductsByName]);

  const fetchAllPromotions = useCallback(async () => {
    try {
      setIsLoadingLivePromotions(true);
      setErrorLoadingPromotions(null);
      const apiPromotions = await promotionService.getAllPromotions();
      
      // Convert API promotions to local Promotion format
      const convertedPromotions: Promotion[] = apiPromotions.map((promo: APIPromotion) => ({
        id: promo._id || Date.now().toString(),
        _id: promo._id,
        title: promo.title,
        url: promo.link || promo.imageURL, // fallback to imageURL if link is missing
        image: promo.imageURL,
        isLive: promo.isLive || false,
        startingDate: promo.startDate,
        endingDate: promo.endDate,
        attachedProducts: promo.products || [],
      }));
      
      // Separate into live and saved promotions
      const live = convertedPromotions.filter((p) => p.isLive === true);
      const saved = convertedPromotions.filter((p) => p.isLive !== true);
      
      console.log("FetchAllPromotions - Total:", convertedPromotions.length, "Live:", live.length, "Saved:", saved.length);
      console.log("FetchAllPromotions - Live promotions:", live.map(p => ({ id: p.id, title: p.title, isLive: p.isLive })));
      console.log("FetchAllPromotions - Saved promotions:", saved.map(p => ({ id: p.id, title: p.title, isLive: p.isLive, _id: p._id })));
      
      setLivePromotions(live);
      setSavedPromotions(saved);
    } catch (error: any) {
      console.error("Error fetching promotions:", error);
      setErrorLoadingPromotions(error?.response?.data?.message || "Failed to load promotions");
      // Set empty arrays on error to show empty state
      setLivePromotions([]);
      setSavedPromotions([]);
    } finally {
      setIsLoadingLivePromotions(false);
    }
  }, []);

  useEffect(() => {
    fetchAllPromotions();
  }, [fetchAllPromotions]);

  // Refresh promotions when screen comes into focus (after navigating back from edit)
  useFocusEffect(
    useCallback(() => {
      fetchAllPromotions();
    }, [fetchAllPromotions])
  );

  // Refresh promotions when returning from EditPromotion screen
  // The useFocusEffect above will handle the refresh automatically

  const handleAddProduct = useCallback((product: Product) => {
    setAttachedProducts((prev) => {
      const exists = prev.some((p) => (p._id || p.id) === (product._id || product.id));
      if (exists) return prev;
      return [...prev, product];
    });
  }, []);

  const handleRemoveProduct = useCallback((productId: string) => {
    setAttachedProducts((prev) =>
      prev.filter((p) => (p._id || p.id) !== productId)
    );
  }, []);

  const handleToggleProductAttachment = useCallback((product: Product) => {
    const isAttached = attachedProducts.some(
      (p) => (p._id || p.id) === (product._id || product.id)
    );
    if (isAttached) {
      handleRemoveProduct(String(product._id || product.id));
    } else {
      handleAddProduct(product);
    }
  }, [attachedProducts, handleAddProduct, handleRemoveProduct]);

  const openImagePicker = useCallback(async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPromotionImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  }, []);

  const handleAddPromotion = () => {
    if (!promotionImage) {
      Alert.alert("Error", "Please add an image");
      return;
    }
    if (!promotionTitle.trim()) {
      Alert.alert("Error", "Please enter a promotional slide title");
      return;
    }
    if (!promotionUrl.trim()) {
      Alert.alert("Error", "Please enter a promotional URL");
      return;
    }

    const newPromotion: Promotion = {
      id: Date.now().toString(),
      title: promotionTitle,
      url: promotionUrl,
      image: promotionImage,
      isLive: false,
    };

    setSavedPromotions([...savedPromotions, newPromotion]);
    handleResetPromotion();
    Alert.alert("Success", "Promotion saved successfully");
  };


  const handleResetPromotion = () => {
    setPromotionImage(null);
    setPromotionTitle("");
    setPromotionUrl("");
    setStartingDate("");
    setEndingDate("");
  };

  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const getMinEndDate = () => {
    if (startingDate) {
      const start = new Date(startingDate);
      start.setDate(start.getDate() + 1);
      return start;
    }
    return getTodayDate();
  };

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    if (Platform.OS === "web") {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  const handleRemoveLiveClick = (id: string) => {
    const promotion = livePromotions.find((p) => p.id === id);
    if (promotion) {
      setPromotionToRemoveLive(promotion);
      setShowRemoveLiveModal(true);
    }
  };

  const confirmRemoveLive = async () => {
    if (!promotionToRemoveLive) return;

    try {
      const promotion = promotionToRemoveLive;
      if (promotion._id) {
        // Determine if the link is internal or external
        const isInternalLink = !promotion.url.startsWith("http://") && !promotion.url.startsWith("https://");
        
        // Format dates for API
        const formatDateForAPI = (dateString: string): string => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString + "T00:00:00.000Z");
            if (!isNaN(date.getTime())) {
              return date.toISOString();
            }
            return dateString;
          } catch {
            return dateString;
          }
        };

        const today = new Date();
        const defaultEndDate = new Date();
        defaultEndDate.setDate(today.getDate() + 30);

        // Update promotion to set isLive: false
        const updateData: any = {
          title: promotion.title,
          link: promotion.url,
          isInternalLink: isInternalLink,
          isLive: false, // Set as not live
          startDate: formatDateForAPI(promotion.startingDate || format(today, "yyyy-MM-dd")),
          endDate: formatDateForAPI(promotion.endingDate || format(defaultEndDate, "yyyy-MM-dd")),
        };
        
        // Include products if available
        if (promotion.attachedProducts && promotion.attachedProducts.length > 0) {
          updateData.products = promotion.attachedProducts.map((p: any) => p._id || p.id).filter(Boolean);
        } else {
          updateData.products = [];
        }
        
        await promotionService.updatePromotion(promotion._id, updateData);
        
        // Refresh all promotions to reflect the change
        await fetchAllPromotions();
        Alert.alert("Success", "Promotion removed from live");
      }
    } catch (error: any) {
      console.error("Error removing promotion from live:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to remove promotion from live");
    } finally {
      setShowRemoveLiveModal(false);
      setPromotionToRemoveLive(null);
    }
  };

  const handleGoLive = (id: string) => {
    const promotion = savedPromotions.find((p) => p.id === id);
    if (!promotion) {
      console.error("Promotion not found in savedPromotions:", id);
      return;
    }

    console.log("Go Live - Promotion found:", promotion);
    setPromotionToGoLive(promotion);
    setShowGoLiveModal(true);
  };

  const confirmGoLive = async () => {
    if (!promotionToGoLive) return;
    
    const promotion = promotionToGoLive;
    const id = promotion.id;
    setShowGoLiveModal(false);

    // Execute the go live logic
    try {
      console.log("Go Live - Confirmation confirmed, starting process...");
      setIsSavingPromotion(true);
      console.log("Go Live - setIsSavingPromotion(true) called");
      
      // Determine if the link is internal or external
      const isInternalLink = !promotion.url.startsWith("http://") && !promotion.url.startsWith("https://");
      console.log("Go Live - isInternalLink:", isInternalLink);
      
      // If promotion already exists in backend (has _id), update it instead of creating new one
      if (promotion._id) {
        console.log("Go Live - Updating existing promotion with _id:", promotion._id);
        // Update existing promotion to make it live
        const updateData: any = {
          title: promotion.title,
          link: promotion.url,
          isInternalLink: isInternalLink,
          isLive: true, // Set as live
        };
        
        // Format dates for API
        const formatDateForAPI = (dateString: string): string => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString + "T00:00:00.000Z");
            if (!isNaN(date.getTime())) {
              return date.toISOString();
            }
            return dateString;
          } catch {
            return dateString;
          }
        };

        const today = new Date();
        const defaultEndDate = new Date();
        defaultEndDate.setDate(today.getDate() + 30);

        // Include dates if available, otherwise use defaults
        updateData.startDate = formatDateForAPI(promotion.startingDate || format(today, "yyyy-MM-dd"));
        updateData.endDate = formatDateForAPI(promotion.endingDate || format(defaultEndDate, "yyyy-MM-dd"));
        
        // Include products if available
        if (promotion.attachedProducts && promotion.attachedProducts.length > 0) {
          updateData.products = promotion.attachedProducts.map((p: any) => p._id || p.id).filter(Boolean);
        } else {
          updateData.products = [];
        }
        
        console.log("Go Live - Update data:", JSON.stringify({ ...updateData, products: updateData.products.length }, null, 2));
        console.log("Go Live - Calling updatePromotion API...");
        try {
          const updatedPromotion = await promotionService.updatePromotion(promotion._id, updateData);
          console.log("Go Live - Updated promotion response:", updatedPromotion);
          console.log("Go Live - Updated promotion isLive:", updatedPromotion?.isLive);
          
          // Verify the update worked
          if (updatedPromotion && !updatedPromotion.isLive) {
            console.warn("Go Live - WARNING: Promotion was updated but isLive is still false!");
            console.warn("Go Live - Full response:", JSON.stringify(updatedPromotion, null, 2));
          }
        } catch (updateError: any) {
          console.error("Go Live - Error in updatePromotion call:", updateError);
          console.error("Go Live - Error details:", updateError?.response?.data || updateError?.message);
          throw updateError; // Re-throw to be caught by outer catch
        }
      } else {
        // Create new promotion (for local-only promotions)
        // Prepare image file for upload
        let imageFile: File | any;
        if (Platform.OS === "web") {
          if (typeof promotion.image === "string") {
            if (promotion.image.startsWith("data:")) {
              const response = await fetch(promotion.image);
              const blob = await response.blob();
              imageFile = new File([blob], "promotion-image.jpg", { type: blob.type });
            } else if (promotion.image.startsWith("http://") || promotion.image.startsWith("https://")) {
              const response = await fetch(promotion.image);
              const blob = await response.blob();
              imageFile = new File([blob], "promotion-image.jpg", { type: blob.type });
            } else {
              const response = await fetch(promotion.image);
              const blob = await response.blob();
              imageFile = new File([blob], "promotion-image.jpg", { type: blob.type });
            }
          } else {
            Alert.alert("Error", "Please select a new image for upload");
            setIsSavingPromotion(false);
            return;
          }
        } else {
          if (typeof promotion.image === "string") {
            imageFile = {
              uri: promotion.image,
              type: "image/jpeg",
              name: "promotion-image.jpg",
            };
          } else {
            Alert.alert("Error", "Please select a new image for upload");
            setIsSavingPromotion(false);
            return;
          }
        }

        // Format dates for API
        const formatDateForAPI = (dateString: string): string => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString + "T00:00:00.000Z");
            if (!isNaN(date.getTime())) {
              return date.toISOString();
            }
            return dateString;
          } catch {
            return dateString;
          }
        };

        const today = new Date();
        const defaultEndDate = new Date();
        defaultEndDate.setDate(today.getDate() + 30);

        console.log("Go Live - Creating new promotion (no _id)");
        const createData: any = {
          title: promotion.title,
          link: promotion.url,
          isInternalLink: isInternalLink,
          image: imageFile,
          isLive: true, // Set as live
          startDate: formatDateForAPI(promotion.startingDate || format(today, "yyyy-MM-dd")),
          endDate: formatDateForAPI(promotion.endingDate || format(defaultEndDate, "yyyy-MM-dd")),
        };

        // Include products if available
        if (promotion.attachedProducts && promotion.attachedProducts.length > 0) {
          createData.products = promotion.attachedProducts.map((p: any) => p._id || p.id).filter(Boolean);
        } else {
          createData.products = [];
        }

        console.log("Go Live - Create data:", { ...createData, image: "File present", products: createData.products.length });
        const createdPromotion = await promotionService.createPromotion(createData);
        console.log("Go Live - Created promotion response:", createdPromotion);
        console.log("Go Live - Created promotion isLive:", createdPromotion?.isLive);
        
        // Verify the create worked
        if (createdPromotion && !createdPromotion.isLive) {
          console.warn("Go Live - WARNING: Promotion was created but isLive is false!");
          console.warn("Go Live - Full response:", JSON.stringify(createdPromotion, null, 2));
        }
      }

      // Wait a bit for backend to process, then refresh
      console.log("Go Live - Waiting before refresh...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove from saved and refresh all promotions
      console.log("Go Live - Removing from saved and refreshing...");
      setSavedPromotions(prev => prev.filter((p) => p.id !== id));
      await fetchAllPromotions();
      console.log("Go Live - Refresh complete");
      Alert.alert("Success", "Promotion is now live!");
    } catch (error: any) {
      console.error("Error making promotion live:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      Alert.alert("Error", error?.response?.data?.message || error?.message || "Failed to make promotion live");
    } finally {
      setIsSavingPromotion(false);
      setPromotionToGoLive(null);
    }
  };

  const handleDeleteLive = (id: string) => {
    setPromotionToDeleteLive(id);
    setShowDeleteLiveModal(true);
  };

  const confirmDeleteLive = async () => {
    if (!promotionToDeleteLive) return;
    
    const id = promotionToDeleteLive;
    setShowDeleteLiveModal(false);

    try {
      const promotion = livePromotions.find((p) => p.id === id);
      if (promotion && promotion._id) {
        await promotionService.deletePromotion(promotion._id);
        // Remove from live promotions and refresh all promotions
        setLivePromotions(livePromotions.filter((p) => p.id !== id));
        fetchAllPromotions();
        Alert.alert("Success", "Promotion deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting promotion:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to delete promotion");
    } finally {
      setPromotionToDeleteLive(null);
    }
  };

  const handleDeleteSaved = (id: string) => {
    setPromotionToDeleteSaved(id);
    setShowDeleteSavedModal(true);
  };

  const confirmDeleteSaved = () => {
    if (!promotionToDeleteSaved) return;
    
    const id = promotionToDeleteSaved;
    setShowDeleteSavedModal(false);
    setSavedPromotions(savedPromotions.filter((p) => p.id !== id));
    setPromotionToDeleteSaved(null);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    redirectToPage(containers.EditPromotionScreen, {
      promotion: JSON.stringify(promotion),
    });
  };


  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Promotional Slides" />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="home" />;

  // Combine live and saved promotions into one array
  // Live promotions first, then saved promotions - both will be displayed together
  const allPromotions = [...livePromotions, ...savedPromotions];

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isWeb}
      scrollable={isWeb ? true : false}
      hideNavItems={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mobile: Add New Promotion Button */}
        {!isWeb && (
          <View style={styles.mobileButtonContainer as ViewStyle}>
            <TouchableOpacity
              style={styles.addNewButton as ViewStyle}
              onPress={() => {
                redirectToPage(containers.EditPromotionScreen, {
                  newPromotion: true,
                });
              }}
            >
              <Text style={styles.addNewButtonText as TextStyle}>+ Add New Promotion</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Header with Title and Add Button */}
        <View style={styles.headerRow as ViewStyle}>
          {isWeb && (
            <Text style={styles.pageTitle as TextStyle}>Promotions</Text>
          )}
          {isWeb && (
            <TouchableOpacity
              style={styles.addNewButtonWeb as ViewStyle}
              onPress={() => {
                redirectToPage(containers.EditPromotionScreen, {
                  newPromotion: true,
                });
              }}
            >
              <Text style={styles.addNewButtonText as TextStyle}>+ Add New Promotion</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isWeb && (
          <Text style={styles.pageTitle as TextStyle}>Promotions</Text>
        )}

        {/* Combined Promotions List */}
        {isLoadingLivePromotions ? (
          <View style={styles.emptyState as ViewStyle}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.emptyStateText as TextStyle}>Loading promotions...</Text>
          </View>
        ) : errorLoadingPromotions ? (
          <View style={styles.emptyState as ViewStyle}>
            <Text style={styles.emptyStateText as TextStyle}>{errorLoadingPromotions}</Text>
            <TouchableOpacity
              style={[styles.addNewButton as ViewStyle, { marginTop: 16 }]}
              onPress={fetchAllPromotions}
            >
              <Text style={styles.addNewButtonText as TextStyle}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : allPromotions.length > 0 ? (
          isWeb ? (
            <View style={styles.gridContainer as ViewStyle}>
              {allPromotions.map((item, index) => {
                const isLive = item.isLive;
                return (
                  <View 
                    key={item.id} 
                    style={[
                      styles.gridCardWrapper as ViewStyle,
                      (index + 1) % 4 === 0 && { marginRight: 0 } as ViewStyle
                    ]}
                  >
                    <View style={styles.cardContainer as ViewStyle}>
                      {isLive && (
                        <View style={styles.liveBadge as ViewStyle}>
                          <View style={styles.liveDot as ViewStyle} />
                          <Text style={styles.liveBadgeText as TextStyle}>Live</Text>
                        </View>
                      )}
                      <PromotionCard
                        image={item.image}
                        title={item.title}
                        isLive={item.isLive}
                        onEdit={() => handleEditPromotion(item)}
                        onDelete={() =>
                          item.isLive
                            ? handleDeleteLive(item.id)
                            : handleDeleteSaved(item.id)
                        }
                        onRemoveLive={() => handleRemoveLiveClick(item.id)}
                        onGoLive={() => handleGoLive(item.id)}
                      />

                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              {allPromotions.map((item) => {
                const isLive = item.isLive;
                return (
                  <View key={item.id} style={styles.mobileCardWrapper as ViewStyle}>
                    <View style={styles.cardContainer as ViewStyle}>
                      {isLive && (
                        <View style={styles.liveBadge as ViewStyle}>
                          <View style={styles.liveDot as ViewStyle} />
                          <Text style={styles.liveBadgeText as TextStyle}>Live</Text>
                        </View>
                      )}
                      <PromotionCard
                        image={item.image}
                        title={item.title}
                        isLive={item.isLive}
                        onEdit={() => handleEditPromotion(item)}
                        onDelete={() =>
                          item.isLive
                            ? handleDeleteLive(item.id)
                            : handleDeleteSaved(item.id)
                        }
                        onRemoveLive={() => handleRemoveLiveClick(item.id)}
                        onGoLive={() => handleGoLive(item.id)}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )
        ) : (
          <View style={styles.emptyState as ViewStyle}>
            <Text style={styles.emptyStateText as TextStyle}>No promotions found</Text>
          </View>
        )}
      </ScrollView>


      {/* Date Pickers for Mobile */}
      {!isWeb && (
        <>
          <DateTimePickerModal
            isVisible={showStartDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowStartDatePicker(false);
              setStartingDate(formatDateForInput(selectedDate));
              // If ending date is before new start date, clear it
              if (endingDate && new Date(endingDate) <= selectedDate) {
                setEndingDate("");
              }
            }}
            onCancel={() => setShowStartDatePicker(false)}
            minimumDate={getTodayDate()}
          />
          <DateTimePickerModal
            isVisible={showEndDatePicker}
            mode="date"
            onConfirm={(selectedDate) => {
              setShowEndDatePicker(false);
              const minDate = getMinEndDate();
              if (selectedDate >= minDate) {
                setEndingDate(formatDateForInput(selectedDate));
              } else {
                Alert.alert("Invalid Date", "Ending date must be after the starting date");
              }
            }}
            onCancel={() => setShowEndDatePicker(false)}
            minimumDate={getMinEndDate()}
          />
        </>
      )}

      {/* Product Selection Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay as ViewStyle}>
          <View style={styles.modalContent as ViewStyle}>
            <View style={styles.modalHeader as ViewStyle}>
              <Text style={styles.modalTitle as TextStyle}>Select Products</Text>
              <TouchableOpacity
                onPress={() => setShowProductModal(false)}
                style={styles.modalCloseButton as ViewStyle}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalSearchContainer as ViewStyle}>
              <SearchBar
                placeholder="Search by name..."
                value={productSearchQuery}
                onChangeText={setProductSearchQuery}
                onSubmitEditing={handleProductSearch}
                onPress={handleProductSearch}
              />
            </View>
            {isLoadingProducts ? (
              <View style={styles.modalLoadingContainer as ViewStyle}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 12 }}>Loading products...</Text>
              </View>
            ) : (
              <FlatList
                data={[...availableProducts].sort((a, b) => {
                  const aIsAttached = attachedProducts.some(
                    (p) => (p._id || p.id) === (a._id || a.id)
                  );
                  const bIsAttached = attachedProducts.some(
                    (p) => (p._id || p.id) === (b._id || b.id)
                  );
                  if (aIsAttached && !bIsAttached) return -1;
                  if (!aIsAttached && bIsAttached) return 1;
                  return 0;
                })}
                keyExtractor={(item) => String(item._id || item.id)}
                renderItem={({ item }) => {
                  const isAttached = attachedProducts.some(
                    (p) => (p._id || p.id) === (item._id || item.id)
                  );
                  const productImage = item.image?.[0] || item.image;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.productModalItem as ViewStyle,
                        isAttached && (styles.productModalItemSelected as ViewStyle),
                      ]}
                      onPress={() => handleToggleProductAttachment(item)}
                    >
                      <Image
                        source={
                          typeof productImage === "string"
                            ? { uri: productImage }
                            : productImage || require("../../../assets/Placeholder.png")
                        }
                        style={styles.productModalImage as ImageStyle}
                        resizeMode="cover"
                      />
                      <View style={styles.productModalInfo as ViewStyle}>
                        <Text style={styles.productModalName as TextStyle} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text style={styles.productModalSku as TextStyle}>
                          SKU: {item.id || item._id || "N/A"}
                        </Text>
                      </View>
                      {isAttached && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                style={styles.modalList as ViewStyle}
              />
            )}
            <View style={styles.modalFooter as ViewStyle}>
              <TouchableOpacity
                style={styles.modalDoneButton as ViewStyle}
                onPress={() => setShowProductModal(false)}
              >
                <Text style={styles.modalDoneButtonText as TextStyle}>Select Products</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Remove Live Confirmation Modal */}
      <ConfirmationModal
        isModalVisible={showRemoveLiveModal}
        onClose={() => {
          setShowRemoveLiveModal(false);
          setPromotionToRemoveLive(null);
        }}
        handleCancel={() => {
          setShowRemoveLiveModal(false);
          setPromotionToRemoveLive(null);
        }}
        handleSubmit={confirmRemoveLive}
        title="Remove Live Promotion"
        text="Are you sure you want to remove this promotion from live?"
        submitText="Yes"
        cancelText="No"
      />
      
      <ConfirmationModal
        isModalVisible={showGoLiveModal}
        onClose={() => {
          setShowGoLiveModal(false);
          setPromotionToGoLive(null);
        }}
        handleCancel={() => {
          setShowGoLiveModal(false);
          setPromotionToGoLive(null);
        }}
        handleSubmit={confirmGoLive}
        title="Go Live"
        text="Are you sure you want to make this promotion live?"
        submitText="Go Live"
        cancelText="Cancel"
      />
      
      <ConfirmationModal
        isModalVisible={showDeleteLiveModal}
        onClose={() => {
          setShowDeleteLiveModal(false);
          setPromotionToDeleteLive(null);
        }}
        handleCancel={() => {
          setShowDeleteLiveModal(false);
          setPromotionToDeleteLive(null);
        }}
        handleSubmit={confirmDeleteLive}
        title="Delete Promotion"
        text="Are you sure you want to delete this live promotion?"
        submitText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
      
      <ConfirmationModal
        isModalVisible={showDeleteSavedModal}
        onClose={() => {
          setShowDeleteSavedModal(false);
          setPromotionToDeleteSaved(null);
        }}
        handleCancel={() => {
          setShowDeleteSavedModal(false);
          setPromotionToDeleteSaved(null);
        }}
        handleSubmit={confirmDeleteSaved}
        title="Delete Promotion"
        text="Are you sure you want to delete this promotion?"
        submitText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </LayoutComponent>
  );
};

export default AdminPromotion;