import React, { useState, useCallback, useEffect } from "react";
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

interface Promotion {
  id: string;
  title: string;
  url: string;
  image: string | number;
  isLive: boolean;
}

const AdminPromotion = () => {
  const dummyPromotions: Promotion[] = [
    {
      id: "1",
      title: "Summer Savings Sale",
      url: "https://your-promo.com/summer-sale",
      image: require("../../../assets/Placeholder.png"),
      isLive: false,
    },
    {
      id: "2",
      title: "Weekend Saving Sale",
      url: "https://your-promo.com/summer-sale",
      image: require("../../../assets/Placeholder.png"),
      isLive: false,
    },
  ];

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
  const [livePromotions, setLivePromotions] = useState<Promotion[]>(
    dummyPromotions.map((p) => ({ ...p, isLive: true }))
  );
  const [savedPromotions, setSavedPromotions] = useState<Promotion[]>(
    dummyPromotions
  );

  const isWeb = Platform.OS === "web";

  const renderCategoryItems = () => (
    <>
      {allCategories.map((cat: any) => (
        <TouchableOpacity
          key={cat.id || cat._id}
          style={styles.dropdownItem as ViewStyle}
          onPress={() => {
            setSelectedCategory(cat.id || cat._id);
            setIsCategoryOpen(false);
          }}
        >
          <Text style={styles.dropdownItemText as TextStyle}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </>
  );

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
      isLive: true,
    };

    setLivePromotions([...livePromotions, newPromotion]);
    handleResetPromotion();
    Alert.alert("Success", "Promotion added successfully");
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

  const handleRemoveLive = (id: string) => {
    Alert.alert(
      "Remove Live Promotion",
      "Are you sure you want to remove this promotion from live?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const promotion = livePromotions.find((p) => p.id === id);
            if (promotion) {
              setLivePromotions(livePromotions.filter((p) => p.id !== id));
              setSavedPromotions([...savedPromotions, { ...promotion, isLive: false }]);
            }
          },
        },
      ]
    );
  };

  const handleDeleteSaved = (id: string) => {
    Alert.alert(
      "Delete Promotion",
      "Are you sure you want to delete this promotion?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setSavedPromotions(savedPromotions.filter((p) => p.id !== id));
          },
        },
      ]
    );
  };

  const handleEditPromotion = (promotion: Promotion) => {
    redirectToPage(containers.EditPromotionScreen, {
      promotion: JSON.stringify(promotion),
    });
  };

  const renderLivePromotionCard = ({ item }: { item: Promotion }) => (
    <View style={{ width: 280, marginRight: 16 }}>
      <PromotionCard
        image={item.image}
        title={item.title}
        url={item.url}
        showTitle={false}
        showLink={false}
        showEditButton={true}
        showDeleteButton={true}
        deleteButtonText="Remove Live"
        backgroundColor={colors.white}
        onEdit={() => handleEditPromotion(item)}
        onDelete={() => handleRemoveLive(item.id)}
      />
    </View>
  );

  const renderSavedPromotionCard = ({ item }: { item: Promotion }) => (
    <PromotionCard
      image={item.image}
      title={item.title}
      url={item.url}
      showTitle={true}
      showLink={true}
      showEditButton={true}
      showDeleteButton={true}
      onEdit={() => handleEditPromotion(item)}
      onDelete={() => handleDeleteSaved(item.id)}
    />
  );

  const LayoutComponent = isWeb ? PageLayoutWeb : PageLayout;
  const HeaderComponent = isWeb ? (
    <BrandHeaderWeb hideUserGreeting={true} />
  ) : (
    <Header headerText="Promotional Slides" />
  );

  const FooterComponent = isWeb ? <FooterWeb /> : <AdminFooter activeTab="home" />;

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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add New Promotion Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Promotion</Text>

          {/* Image Upload Area */}
          <TouchableOpacity
            style={styles.imageUploadArea}
            onPress={openImagePicker}
            activeOpacity={0.7}
          >
            {promotionImage ? (
              <Image
                source={{ uri: promotionImage }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons
                  name="image-outline"
                  size={48}
                  color={colors.primary}
                />
                <Text style={styles.placeholderText}>Add Image here</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Add Promotional Slide Title</Text>
            <CustomTextInput
              placeholder="e.g., Summer Sale Bonanza"
              value={promotionTitle}
              setValue={setPromotionTitle}
              style={styles.textInput}
              onPress={() => {}}
            />
          </View>

          {/* URL Input */}
          <View style={styles.inputContainer as ViewStyle}>
            <Text style={styles.inputLabel as TextStyle}>Enter Promotional URL</Text>
            <CustomTextInput
              placeholder="https://your-promo.com/summer-sale"
              value={promotionUrl}
              setValue={setPromotionUrl}
              style={styles.textInput as ViewStyle}
              keyboardType="url"
              onPress={() => {}}
            />
          </View>

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
              <View style={styles.categoryContainer as ViewStyle}>
                <TouchableOpacity
                  onPress={() => setIsCategoryOpen((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categorySelector as ViewStyle}>
                    <Text
                      style={[
                        styles.categoryText as TextStyle,
                        {
                          color:
                            selectedCategory && selectedCategory !== ""
                              ? colors.black
                              : colors.slateGrey,
                        },
                      ]}
                    >
                      {selectedCategory && selectedCategory !== ""
                        ? allCategories.find((c: any) => (c.id || c._id) == selectedCategory)?.name || "Select Category"
                        : "Select Category"}
                    </Text>
                    <Ionicons
                      name={isCategoryOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={colors.black}
                    />
                  </View>
                </TouchableOpacity>
                {isCategoryOpen && (
                  isWeb ? (
                    // ===== WEB: inline dropdown =====
                    <View style={styles.dropdownList as ViewStyle}>
                      <ScrollView style={styles.dropdownScrollArea as ViewStyle}>
                        {renderCategoryItems()}
                      </ScrollView>
                    </View>
                  ) : (
                    // ===== MOBILE: modal dropdown =====
                    Platform.OS !== "web" && (
                      <Modal
                        transparent
                        animationType="fade"
                        onRequestClose={() => setIsCategoryOpen(false)}
                      >
                        <Pressable
                          style={styles.modalOverlay as ViewStyle}
                          onPress={() => setIsCategoryOpen(false)}
                        >
                          <View style={styles.modalDropdown as ViewStyle}>
                            <ScrollView>
                              {renderCategoryItems()}
                            </ScrollView>
                          </View>
                        </Pressable>
                      </Modal>
                    )
                  )
                )}
              </View>
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

          {/* Date Range Selection */}
          <View style={styles.dateRangeContainer}>
            <View style={styles.dateInputWrapper}>
              <Text style={styles.dateLabel}>Starting From</Text>
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
                  style={styles.dateInput}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text style={styles.dateInputText}>
                    {startingDate ? formatDateForDisplay(startingDate) : "Select date"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {Platform.OS === "web" && (
              <Text style={styles.dateToLabel}>to</Text>
            )}

            <View style={styles.dateInputWrapper}>
              <Text style={styles.dateLabel}>Ending On</Text>
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
                  style={styles.dateInput}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Text style={styles.dateInputText}>
                    {endingDate ? formatDateForDisplay(endingDate) : "Select date"}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={handleAddPromotion}
            >
              <Text style={styles.addButtonText}>Add Promotion</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleResetPromotion}
            >
              <Text style={styles.resetButtonText}>Reset Promotion</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Promotions</Text>
          {livePromotions.length > 0 ? (
            <FlatList
              data={livePromotions}
              renderItem={renderLivePromotionCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No live promotions</Text>
            </View>
          )}
        </View>

        {/* Saved Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Promotions</Text>
          {savedPromotions.length > 0 ? (
            <FlatList
              data={savedPromotions}
              renderItem={renderSavedPromotionCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No saved promotions</Text>
            </View>
          )}
        </View>
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
    </LayoutComponent>
  );
};

export default AdminPromotion;