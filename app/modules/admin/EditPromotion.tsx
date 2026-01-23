import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
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
import { useLocalSearchParams, useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import Header from "../../components/Header";
import AdminFooter from "@/app/components/AdminFooter";
import PageLayout from "@/app/components/commonComponents/pageLayoutProps";
import PageLayoutWeb from "@/app/components/commonComponentsWeb/pageLayoutPropsWeb";
import BrandHeaderWeb from "@/app/components/commonComponentsWeb/brandHeaderWeb";
import FooterWeb from "@/app/components/commonComponentsWeb/footerWeb";
import colors from "../../../constants/colors";
import styles from "./EditPromotionStyles";
import { globalStyles } from "@/assets/styles/globalStyles";
import { CustomTextInput } from "@/app/components/commonComponents/CustomTextInput";
import Button from "@/app/components/commonComponents/Button";
import { Product, ProductsAPI } from "@/services/productService";
import SearchBar from "@/app/components/searchBar";
import { categoryService } from "@/services/categoryService";
import useDebounce from "@/utilities/customHooks/useDebounce";
import { promotionService } from "@/services/promotionService";
import WebCategoryDropdown from "./componentsWeb/webCategoryDropdown";

const EditPromotion = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isNewPromotion = params.newPromotion === "true" || params.newPromotion === "1" || (Array.isArray(params.newPromotion) && params.newPromotion[0] === "true");
  const promotionData = params.promotion ? JSON.parse(Array.isArray(params.promotion) ? params.promotion[0] : params.promotion as string) : null;

  const [promotionImage, setPromotionImage] = useState<string | number | null>(
    isNewPromotion ? null : (promotionData?.image || promotionData?.imageURL || null)
  );
  const [promotionTitle, setPromotionTitle] = useState(
    isNewPromotion ? "" : (promotionData?.title || "")
  );
  const [promotionUrl, setPromotionUrl] = useState(
    isNewPromotion ? "" : (promotionData?.url || "")
  );
  const [startingDate, setStartingDate] = useState<string>(
    isNewPromotion ? "" : (promotionData?.startingDate || "")
  );
  const [endingDate, setEndingDate] = useState<string>(
    isNewPromotion ? "" : (promotionData?.endingDate || "")
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [attachedProducts, setAttachedProducts] = useState<Product[]>(
    isNewPromotion ? [] : (promotionData?.attachedProducts || [])
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productDisplayMode, setProductDisplayMode] = useState<"category" | "product">("product");
  const [selectedCategory, setSelectedCategory] = useState<string | number>("");
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const debouncedProductQuery = useDebounce(productSearchQuery, 300);
  const [isOnLive, setIsOnLive] = useState<boolean>(
    isNewPromotion ? false : (promotionData?.isLive || false)
  );

  const isWeb = Platform.OS === "web";

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

  useEffect(() => {
    if (showProductModal) {
      searchProductsByName(debouncedProductQuery);
    }
  }, [debouncedProductQuery, showProductModal, searchProductsByName]);

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

  const handleSelectProducts = useCallback(() => {
    setShowProductModal(true);
    setProductSearchQuery("");
    if (availableProducts.length === 0) {
      fetchAvailableProducts();
    }
  }, [availableProducts.length, fetchAvailableProducts]);

  const handleProductSearch = useCallback(async () => {
    await searchProductsByName(productSearchQuery);
  }, [productSearchQuery, searchProductsByName]);

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

  const prepareImageFile = async (): Promise<File | any | null> => {
    if (!promotionImage) return null;

    if (Platform.OS === "web") {
      // For web, handle data URI or regular URL
      if (typeof promotionImage === "string") {
        if (promotionImage.startsWith("data:")) {
          // Convert data URI to File
          const response = await fetch(promotionImage);
          const blob = await response.blob();
          return new File([blob], "promotion-image.jpg", { type: blob.type });
        } else if (promotionImage.startsWith("http://") || promotionImage.startsWith("https://")) {
          // Fetch from URL
          const response = await fetch(promotionImage);
          const blob = await response.blob();
          return new File([blob], "promotion-image.jpg", { type: blob.type });
        } else {
          // Local file path
          const response = await fetch(promotionImage);
          const blob = await response.blob();
          return new File([blob], "promotion-image.jpg", { type: blob.type });
        }
      } else {
        // If it's a require() asset, we can't upload it - user needs to select a new image
        Alert.alert("Error", "Please select a new image for upload");
        return null;
      }
    } else {
      // For mobile, use the URI directly
      if (typeof promotionImage === "string") {
        return {
          uri: promotionImage,
          type: "image/jpeg",
          name: "promotion-image.jpg",
        };
      } else {
        Alert.alert("Error", "Please select a new image for upload");
        return null;
      }
    }
  };

  const validateForm = (): boolean => {
    if (!promotionImage) {
      Alert.alert("Error", "Please add an image");
      return false;
    }
    if (!promotionTitle.trim()) {
      Alert.alert("Error", "Please enter a promotional slide title");
      return false;
    }
    if (!promotionUrl.trim()) {
      Alert.alert("Error", "Please enter a promotional URL");
      return false;
    }
    return true;
  };

  const handleAddPromotion = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      // Create promotion object to pass back to AdminPromotion
      const newPromotion = {
        id: Date.now().toString(),
        title: promotionTitle,
        url: promotionUrl,
        image: promotionImage,
        isLive: false,
        startingDate: startingDate,
        endingDate: endingDate,
        attachedProducts: attachedProducts,
      };

      // Navigate back with the new promotion data as a param
      router.setParams({
        newSavedPromotion: JSON.stringify(newPromotion),
      });
      router.back();
      
      Alert.alert("Success", "Promotion saved successfully");
    } catch (error: any) {
      console.error("Error saving promotion:", error);
      Alert.alert("Error", "Failed to save promotion");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoLive = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      // Determine if the link is internal or external
      const isInternalLink = !promotionUrl.startsWith("http://") && !promotionUrl.startsWith("https://");
      
      // Prepare image file for upload
      const imageFile = await prepareImageFile();
      if (!imageFile) {
        setIsSaving(false);
        return;
      }

      if (isNewPromotion) {
        // Create new promotion and save to API (makes it live)
        await promotionService.createPromotion({
          title: promotionTitle,
          link: promotionUrl,
          isInternalLink: isInternalLink,
          image: imageFile,
        });
        Alert.alert("Success", "Promotion is now live!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
        // Update existing promotion
        if (promotionData?._id) {
          await promotionService.updatePromotion(promotionData._id, {
            title: promotionTitle,
            link: promotionUrl,
            isInternalLink: isInternalLink,
            image: imageFile,
          });
          Alert.alert("Success", "Promotion updated and is live!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        } else {
          Alert.alert("Error", "Promotion ID not found");
        }
      }
    } catch (error: any) {
      console.error("Error saving promotion:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to save promotion");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePromotion = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      // Determine if the link is internal or external
      const isInternalLink = !promotionUrl.startsWith("http://") && !promotionUrl.startsWith("https://");
      
      // Prepare image file for upload
      const imageFile = await prepareImageFile();
      if (!imageFile) {
        setIsSaving(false);
        return;
      }

      if (isOnLive) {
        // If "On Live" is checked, update/create via API (makes it live, appears in carousel)
      if (promotionData?._id) {
          // Update existing live promotion
        await promotionService.updatePromotion(promotionData._id, {
          title: promotionTitle,
          link: promotionUrl,
          isInternalLink: isInternalLink,
          image: imageFile,
        });
          Alert.alert("Success", "Promotion updated and is live!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      } else {
          // Create new live promotion
          await promotionService.createPromotion({
            title: promotionTitle,
            link: promotionUrl,
            isInternalLink: isInternalLink,
            image: imageFile,
          });
          Alert.alert("Success", "Promotion is now live!", [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        }
      } else {
        // If "On Live" is not checked, save locally (doesn't appear in carousel)
        const updatedPromotion = {
          id: promotionData?.id || Date.now().toString(),
          title: promotionTitle,
          url: promotionUrl,
          image: promotionImage,
          isLive: false,
          startingDate: startingDate,
          endingDate: endingDate,
          attachedProducts: attachedProducts,
        };

        // Navigate back with the updated promotion data as a param
        router.setParams({
          updatedSavedPromotion: JSON.stringify(updatedPromotion),
        });
        router.back();
        
        Alert.alert("Success", "Promotion saved successfully");
      }
    } catch (error: any) {
      console.error("Error saving promotion:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to save promotion");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePromotion = async () => {
    Alert.alert(
      "Delete Promotion",
      "Are you sure you want to delete this promotion?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsSaving(true);
              
              // If it's a live promotion (has _id), delete via API
              if (promotionData?._id) {
                await promotionService.deletePromotion(promotionData._id);
            Alert.alert("Success", "Promotion deleted successfully", [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]);
              } else {
                // If it's a saved promotion, notify AdminPromotion to remove it
                router.setParams({
                  deletedPromotionId: promotionData?.id || "",
                });
                router.back();
                Alert.alert("Success", "Promotion deleted successfully");
              }
            } catch (error: any) {
              console.error("Error deleting promotion:", error);
              Alert.alert("Error", error?.response?.data?.message || "Failed to delete promotion");
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
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

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const headerText = isNewPromotion ? "Add Promotion" : "Edit Promotion";
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText={headerText} />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="home" />;

  return (
    <LayoutComponent
      hasHeader
      headerComponent={HeaderComponent}
      hasFooter
      footerComponent={FooterComponent}
      hasSidebar={isWeb}
      scrollable={false}
      hideNavItems={true}
    >

      <View style={{ flex: 1 }}>
        <View style={isWeb ? styles.webFormContainer as ViewStyle : { flex: 1 }}>
          <ScrollView
            style={styles.container as ViewStyle}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent as ViewStyle}
          >
            {/* Promotion Image */}
            <View style={styles.section as ViewStyle}>
              <Text style={styles.sectionTitle as TextStyle}>Promotion Image</Text>
              <TouchableOpacity
                onPress={openImagePicker}
                activeOpacity={0.7}
                style={styles.imageClickableContainer as ViewStyle}
              >
                {promotionImage ? (
                  <View style={styles.imagePreviewContainer as ViewStyle}>
                    <Image
                      source={
                        typeof promotionImage === "string"
                          ? { uri: promotionImage }
                          : promotionImage
                      }
                      style={styles.imagePreview as ImageStyle}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder as ViewStyle}>
                    <Ionicons
                      name="image-outline"
                      size={48}
                      color={colors.placeholdergrey}
                    />
                    {isWeb && (
                      <Text style={styles.imagePlaceholderText as TextStyle}>
                        Click to upload image
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </View>

        {/* Title Input */}
        <View style={styles.section as ViewStyle}>
          <Text style={styles.inputLabel as TextStyle}>Add Promotional Slide Title</Text>
          <CustomTextInput
            placeholder="Enter Promotional Slide title"
            value={promotionTitle}
            setValue={setPromotionTitle}
            style={styles.textInput as ViewStyle}
            onPress={() => {}}
          />
        </View>

        {/* URL Input */}
        {/* <View style={styles.section as ViewStyle}>
          <Text style={styles.inputLabel as TextStyle}>Enter Promotional URL</Text>
          <CustomTextInput
            placeholder="Enter your promotional url"
            value={promotionUrl}
            setValue={setPromotionUrl}
            style={styles.textInput as ViewStyle}
            keyboardType="url"
            onPress={() => {}}
          />
        </View> */}

        {/* Product Display Mode Selection */}
        <View style={styles.productDisplayModeSection as ViewStyle}>
          <Text style={styles.productDisplayModeTitle as TextStyle}>
            How do you want to display the products?
          </Text>
          <View style={styles.radioButtonContainer as ViewStyle}>
            <TouchableOpacity
              style={styles.radioButtonRow as ViewStyle}
              onPress={() => setProductDisplayMode("category")}
            >
              <Ionicons
                name={productDisplayMode === "category" ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={productDisplayMode === "category" ? colors.primary : colors.placeholdergrey}
              />
              <Text style={styles.radioButtonLabel as TextStyle}>Choose Category</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButtonRow as ViewStyle}
              onPress={() => setProductDisplayMode("product")}
            >
              <Ionicons
                name={productDisplayMode === "product" ? "radio-button-on" : "radio-button-off"}
                size={24}
                color={productDisplayMode === "product" ? colors.primary : colors.placeholdergrey}
              />
              <Text style={styles.radioButtonLabel as TextStyle}>Select Product</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Choose Category Section */}
        {productDisplayMode === "category" && (
          <View style={styles.categorySelectionSection as ViewStyle}>
            <Text style={styles.categorySelectionTitle as TextStyle}>Choose Category</Text>
            {isWeb ? (
              <View style={{ overflow: "visible", zIndex: 1000 }}>
                <WebCategoryDropdown
                  categories={allCategories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </View>
            ) : (
              <Text style={styles.categorySelectionTitle as TextStyle}>
                Category selection available on web
              </Text>
            )}
          </View>
        )}


        {/* Attach Products Section */}
        {productDisplayMode === "product" && (
          <View style={styles.attachProductsSection as ViewStyle}>
          <View style={styles.attachProductsHeader as ViewStyle}>
            <View style={styles.attachProductsTitleContainer as ViewStyle}>
              <Text style={styles.attachProductsTitle as TextStyle}>
                Attach Products to this Promotion
              </Text>
              <Text style={styles.attachProductsSubtitle as TextStyle}>
                (Optional) Link items to display below the banner
              </Text>
            </View>
            <TouchableOpacity
              style={styles.selectProductsButton as ViewStyle}
              onPress={handleSelectProducts}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
              <Text style={styles.selectProductsButtonText as TextStyle}>Select Products</Text>
            </TouchableOpacity>
          </View>

          {attachedProducts.length > 0 && (
            <View style={styles.attachedProductsList as ViewStyle}>
              {attachedProducts.map((product) => {
                const productId = String(product._id || product.id);
                const productImage = product.image?.[0] || product.image;
                return (
                  <View key={productId} style={styles.attachedProductCard as ViewStyle}>
                    <Image
                      source={
                        typeof productImage === "string"
                          ? { uri: productImage }
                          : productImage || require("../../../assets/Placeholder.png")
                      }
                      style={styles.attachedProductImage as ImageStyle}
                      resizeMode="cover"
                    />
                    <View style={styles.attachedProductInfo as ViewStyle}>
                      <Text style={styles.attachedProductName as TextStyle} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.attachedProductSku as TextStyle}>
                        SKU: {product.id || product._id || "N/A"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeProductButton as ViewStyle}
                      onPress={() => handleRemoveProduct(productId)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="close" size={20} color={colors.black} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        )}

        {/* On Live Checkbox - Only show when editing */}
        {!isNewPromotion && (
          <View style={styles.section as ViewStyle}>
            <TouchableOpacity
              style={styles.checkboxContainer as ViewStyle}
              onPress={() => setIsOnLive(!isOnLive)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox as ViewStyle,
                  isOnLive
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.white, borderColor: colors.placeholdergrey },
                ]}
              >
                {isOnLive && (
                  <Ionicons name="checkmark" size={20} color={colors.white} />
                )}
              </View>
              <Text style={styles.checkboxLabel as TextStyle}>On Live</Text>
            </TouchableOpacity>
        </View>
        )}

        {/* Date Range Selection */}
        <View style={styles.dateRangeContainer as ViewStyle}>
                  <View style={styles.dateInputWrapper as ViewStyle}>
                    <Text style={styles.dateLabel as TextStyle}>Starting From</Text>
                    {Platform.OS === "web" ? (
                      <input
                        type="date"
                        style={globalStyles.webDateInput}
                        value={startingDate}
                        onChange={(e) => setStartingDate(e.target.value)}
                        min={formatDateForInput(getTodayDate())}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.dateInput as ViewStyle}
                        onPress={() => setShowStartDatePicker(true)}
                      >
                        <Text style={styles.dateInputText as TextStyle}>
                          {startingDate ? formatDateForDisplay(startingDate) : "Select date"}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {Platform.OS === "web" && (
                    <Text style={styles.dateToLabel as TextStyle}>to</Text>
                  )}

                  <View style={styles.dateInputWrapper as ViewStyle}>
                    <Text style={styles.dateLabel as TextStyle}>Ending On</Text>
                    {Platform.OS === "web" ? (
                      <input
                        type="date"
                        style={globalStyles.webDateInput}
                        value={endingDate}
                        onChange={(e) => setEndingDate(e.target.value)}
                        min={formatDateForInput(getMinEndDate())}
                      />
                    ) : (
                      <TouchableOpacity
                        style={styles.dateInput as ViewStyle}
                        onPress={() => setShowEndDatePicker(true)}
                      >
                        <Text style={styles.dateInputText as TextStyle}>
                          {endingDate ? formatDateForDisplay(endingDate) : "Select date"}
                        </Text>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer as ViewStyle}>
              {isNewPromotion ? (
                <>
                  <TouchableOpacity
                    style={[styles.saveButton as ViewStyle, isWeb && styles.webButton]}
                    onPress={handleAddPromotion}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.saveButtonText as TextStyle}>Add</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.goLiveButton as ViewStyle, isWeb && styles.webButton]}
                    onPress={handleGoLive}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.goLiveButtonText as TextStyle}>Go Live</Text>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={[styles.saveButton as ViewStyle, isWeb && styles.webButton]}
                    onPress={handleSavePromotion}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.saveButtonText as TextStyle}>Add</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteButton as ViewStyle, isWeb && styles.webButton]}
                    onPress={handleDeletePromotion}
                    disabled={isSaving}
                  >
                    <Text style={styles.deleteButtonText as TextStyle}>Delete</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </View>

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
    </LayoutComponent>
  );
};

export default EditPromotion;

